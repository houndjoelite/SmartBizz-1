import { 
  doc, 
  getDoc, 
  setDoc, 
  updateDoc,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  query,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { auth, db, storage } from './firebase';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { Platform } from 'react-native';

/**
 * Service de gestion des paramètres utilisateur
 */
class SettingsService {
  /**
   * Récupérer les paramètres de l'utilisateur
   */
  static async getUserSettings() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const settingsRef = doc(db, 'settings', user.uid);
      const settingsDoc = await getDoc(settingsRef);

      if (!settingsDoc.exists()) {
        // Créer les paramètres par défaut
        const defaultSettings = this.getDefaultSettings();
        await setDoc(settingsRef, defaultSettings);
        return { success: true, settings: defaultSettings };
      }

      const settings = settingsDoc.data();
      return { 
        success: true, 
        settings: {
          ...settings,
          createdAt: settings.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: settings.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des paramètres:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des paramètres',
      };
    }
  }

  /**
   * Paramètres par défaut
   */
  static getDefaultSettings() {
    return {
      // 1. Informations professionnelles
      businessInfo: {
        businessName: '',
        businessType: '', // salon, boutique, ferme, mobile_money, etc.
        taxId: '',
        registrationNumber: '',
        address: '',
        phone: '',
        email: '',
        website: '',
        onlineStoreUrl: '',
        logo: null,
        banner: null,
      },

      // 2. Abonnement
      subscription: {
        plan: 'free', // free, premium, enterprise
        status: 'active',
        startDate: Timestamp.now(),
        endDate: null,
        features: ['basic_inventory', 'basic_sales'],
      },

      // 3. Modes de paiement
      paymentMethods: {
        preferred: ['cash', 'mobile_money'],
        bankAccount: null,
        mobileMoneyAccounts: [],
      },

      // 4. Apparence
      appearance: {
        theme: 'light', // light, dark, auto
        primaryColor: '#3b82f6',
        language: 'fr',
        currency: 'FCFA',
      },

      // 5. Notifications
      notifications: {
        enabled: true,
        lowStockAlert: true,
        newSaleAlert: true,
        dailyReport: false,
        weeklyReport: false,
        emailNotifications: false,
        pushNotifications: true,
      },

      // 6. Sauvegarde
      backup: {
        autoBackup: true,
        frequency: 'daily', // daily, weekly, monthly
        lastBackup: null,
      },

      // 7. Sécurité
      security: {
        twoFactorEnabled: false,
        sessionTimeout: 30, // minutes
        requirePasswordForSensitiveActions: true,
      },

      // 8. Multi-boutiques
      stores: [],
      activeStoreId: null,

      // Metadata
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };
  }

  /**
   * Mettre à jour les paramètres
   */
  static async updateSettings(updates) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const settingsRef = doc(db, 'settings', user.uid);
      
      await updateDoc(settingsRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });

      return { success: true, message: 'Paramètres mis à jour avec succès' };
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour',
      };
    }
  }

  /**
   * Upload du logo
   */
  static async uploadLogo(imageUri) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      // Supprimer l'ancien logo si existe
      const settingsResult = await this.getUserSettings();
      if (settingsResult.success && settingsResult.settings.businessInfo?.logo) {
        await this.deleteLogo();
      }

      // Upload du nouveau logo (compatibilité Web / Mobile)
      let blob;
      if (Platform.OS === 'web') {
        // Sur Web, fetch() fonctionne mieux pour blob:http/ data: URIs
        const response = await fetch(imageUri);
        blob = await response.blob();
      } else {
        // Sur mobile natif, utiliser XMLHttpRequest
        blob = await new Promise((resolve, reject) => {
          try {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () { resolve(xhr.response); };
            xhr.onerror = function () { reject(new TypeError('Échec de conversion en blob')); };
            xhr.responseType = 'blob';
            xhr.open('GET', imageUri, true);
            xhr.send(null);
          } catch (e) { reject(e); }
        });
      }
      const filename = `logo_${Date.now()}.jpg`;
      const storageRef = ref(storage, `settings/${user.uid}/${filename}`);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      // Mettre à jour les paramètres
      await this.updateSettings({
        'businessInfo.logo': downloadURL,
      });

      return { success: true, url: downloadURL };
    } catch (error) {
      console.error('Erreur lors de l\'upload du logo:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'upload',
      };
    }
  }

  /**
   * Supprimer le logo
   */
  static async deleteLogo() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const settingsResult = await this.getUserSettings();
      if (!settingsResult.success || !settingsResult.settings.businessInfo?.logo) {
        return { success: true, message: 'Aucun logo à supprimer' };
      }

      const logoUrl = settingsResult.settings.businessInfo.logo;
      // La fonction ref(storage, url) accepte les URLs https:// et gs://
      const logoRef = ref(storage, logoUrl);
      
      await deleteObject(logoRef);
      
      await this.updateSettings({
        'businessInfo.logo': null,
      });

      return { success: true, message: 'Logo supprimé' };
    } catch (error) {
      console.error('Erreur lors de la suppression du logo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer les notifications
   */
  static async getNotifications() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const notificationsRef = collection(db, 'notifications', user.uid, 'list');
      const q = query(notificationsRef, orderBy('createdAt', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);

      const notifications = [];
      querySnapshot.forEach((doc) => {
        notifications.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        });
      });

      return { success: true, notifications };
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération',
      };
    }
  }

  /**
   * Créer une notification
   */
  static async createNotification(notificationData) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const notificationsRef = collection(db, 'notifications', user.uid, 'list');
      
      const notification = {
        type: notificationData.type || 'info', // info, success, warning, error
        title: notificationData.title || '',
        message: notificationData.message || '',
        read: false,
        actionUrl: notificationData.actionUrl || null,
        createdAt: Timestamp.now(),
      };

      await addDoc(notificationsRef, notification);

      return { success: true, message: 'Notification créée' };
    } catch (error) {
      console.error('Erreur lors de la création de la notification:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la création',
      };
    }
  }

  /**
   * Marquer une notification comme lue
   */
  static async markNotificationAsRead(notificationId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const notificationRef = doc(db, 'notifications', user.uid, 'list', notificationId);
      
      await updateDoc(notificationRef, {
        read: true,
      });

      return { success: true, message: 'Notification marquée comme lue' };
    } catch (error) {
      console.error('Erreur:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Supprimer une notification
   */
  static async deleteNotification(notificationId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const notificationRef = doc(db, 'notifications', user.uid, 'list', notificationId);
      await deleteDoc(notificationRef);

      return { success: true, message: 'Notification supprimée' };
    } catch (error) {
      console.error('Erreur:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer les appareils connectés
   */
  static async getConnectedDevices() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const devicesRef = collection(db, 'devices', user.uid, 'list');
      const q = query(devicesRef, orderBy('lastActivity', 'desc'));
      const querySnapshot = await getDocs(q);

      const devices = [];
      querySnapshot.forEach((doc) => {
        devices.push({
          id: doc.id,
          ...doc.data(),
          lastActivity: doc.data().lastActivity?.toDate?.()?.toISOString() || new Date().toISOString(),
          firstConnection: doc.data().firstConnection?.toDate?.()?.toISOString() || new Date().toISOString(),
        });
      });

      return { success: true, devices };
    } catch (error) {
      console.error('Erreur:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération',
      };
    }
  }

  /**
   * Enregistrer une connexion d'appareil
   */
  static async registerDevice(deviceInfo) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const devicesRef = collection(db, 'devices', user.uid, 'list');
      
      const device = {
        deviceName: deviceInfo.deviceName || 'Unknown Device',
        platform: deviceInfo.platform || 'web',
        browser: deviceInfo.browser || '',
        os: deviceInfo.os || '',
        ip: deviceInfo.ip || '',
        location: deviceInfo.location || '',
        firstConnection: Timestamp.now(),
        lastActivity: Timestamp.now(),
        active: true,
      };

      const docRef = await addDoc(devicesRef, device);

      return { success: true, deviceId: docRef.id };
    } catch (error) {
      console.error('Erreur:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Déconnecter un appareil
   */
  static async disconnectDevice(deviceId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const deviceRef = doc(db, 'devices', user.uid, 'list', deviceId);
      await deleteDoc(deviceRef);

      return { success: true, message: 'Appareil déconnecté' };
    } catch (error) {
      console.error('Erreur:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Calculer les statistiques du compte
   */
  static async getAccountStats() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      // Récupérer les données de différentes collections
      const [productsSnapshot, salesSnapshot, clientsSnapshot] = await Promise.all([
        getDocs(collection(db, 'inventory', user.uid, 'products')),
        getDocs(collection(db, 'sales', user.uid, 'records')),
        getDocs(collection(db, 'clients', user.uid, 'list')),
      ]);

      const products = [];
      const sales = [];
      const clients = [];

      productsSnapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
      salesSnapshot.forEach(doc => sales.push({ id: doc.id, ...doc.data() }));
      clientsSnapshot.forEach(doc => clients.push({ id: doc.id, ...doc.data() }));

      // Calculer les statistiques
      const totalRevenue = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
      const totalProfit = sales.reduce((sum, sale) => {
        const cost = (sale.quantity || 0) * (sale.purchasePrice || 0);
        const revenue = sale.total || 0;
        return sum + (revenue - cost);
      }, 0);

      const stats = {
        totalProducts: products.length,
        productsInStock: products.filter(p => p.quantity > 0).length,
        lowStockProducts: products.filter(p => p.quantity > 0 && p.quantity <= (p.stockThreshold || 5)).length,
        outOfStockProducts: products.filter(p => p.quantity === 0).length,
        
        totalSales: sales.length,
        totalRevenue: totalRevenue,
        totalProfit: totalProfit,
        
        totalClients: clients.length,
        activeClients: clients.filter(c => c.lastPurchaseDate).length,
        
        accountAge: this.calculateAccountAge(),
      };

      return { success: true, stats };
    } catch (error) {
      console.error('Erreur:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors du calcul',
      };
    }
  }

  /**
   * Calculer l'âge du compte
   */
  static calculateAccountAge() {
    const user = auth.currentUser;
    if (!user) return 0;

    const creationDate = new Date(user.metadata.creationTime);
    const now = new Date();
    const diffTime = Math.abs(now - creationDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays;
  }

  /**
   * Créer une sauvegarde manuelle
   */
  static async createBackup() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const backupRef = collection(db, 'backups', user.uid, 'list');
      
      // Récupérer toutes les données
      const [products, sales, clients, invoices] = await Promise.all([
        getDocs(collection(db, 'inventory', user.uid, 'products')),
        getDocs(collection(db, 'sales', user.uid, 'records')),
        getDocs(collection(db, 'clients', user.uid, 'list')),
        getDocs(collection(db, 'invoices', user.uid, 'documents')),
      ]);

      const backup = {
        products: [],
        sales: [],
        clients: [],
        invoices: [],
        createdAt: Timestamp.now(),
      };

      products.forEach(doc => backup.products.push({ id: doc.id, ...doc.data() }));
      sales.forEach(doc => backup.sales.push({ id: doc.id, ...doc.data() }));
      clients.forEach(doc => backup.clients.push({ id: doc.id, ...doc.data() }));
      invoices.forEach(doc => backup.invoices.push({ id: doc.id, ...doc.data() }));

      await addDoc(backupRef, backup);

      // Mettre à jour la date de dernière sauvegarde
      await this.updateSettings({
        'backup.lastBackup': Timestamp.now(),
      });

      return { success: true, message: 'Sauvegarde créée avec succès' };
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la sauvegarde',
      };
    }
  }

  /**
   * Récupérer la liste des sauvegardes
   */
  static async getBackups() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const backupsRef = collection(db, 'backups', user.uid, 'list');
      const q = query(backupsRef, orderBy('createdAt', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);

      const backups = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        backups.push({
          id: doc.id,
          createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          productsCount: data.products?.length || 0,
          salesCount: data.sales?.length || 0,
          clientsCount: data.clients?.length || 0,
          invoicesCount: data.invoices?.length || 0,
        });
      });

      return { success: true, backups };
    } catch (error) {
      console.error('Erreur:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération',
      };
    }
  }

  /**
   * Récupérer les informations commerciales
   */
  static async getBusinessInfo(userId) {
    try {
      const uid = userId || auth.currentUser?.uid;
      if (!uid) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const settingsRef = doc(db, 'settings', uid);
      const settingsDoc = await getDoc(settingsRef);

      if (!settingsDoc.exists()) {
        return { 
          success: true, 
          data: {
            hasCompletedInteractiveTour: false,
          }
        };
      }

      const settings = settingsDoc.data();
      return { 
        success: true, 
        data: {
          ...settings.businessInfo,
          hasCompletedInteractiveTour: settings.hasCompletedInteractiveTour || false,
          tourCompletedAt: settings.tourCompletedAt,
        }
      };
    } catch (error) {
      console.error('Erreur lors de la récupération des infos commerciales:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération',
      };
    }
  }

  /**
   * Mettre à jour les informations commerciales
   */
  static async updateBusinessInfo(userId, updates) {
    try {
      const uid = userId || auth.currentUser?.uid;
      if (!uid) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const settingsRef = doc(db, 'settings', uid);
      const settingsDoc = await getDoc(settingsRef);

      if (!settingsDoc.exists()) {
        // Créer le document avec les valeurs par défaut
        const defaultSettings = this.getDefaultSettings();
        await setDoc(settingsRef, {
          ...defaultSettings,
          ...updates,
          updatedAt: Timestamp.now(),
        });
      } else {
        // Mettre à jour le document existant
        await updateDoc(settingsRef, {
          ...updates,
          updatedAt: Timestamp.now(),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour des infos commerciales:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour',
      };
    }
  }
}

export default SettingsService;


