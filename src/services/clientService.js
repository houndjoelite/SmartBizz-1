import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  orderBy,
  Timestamp,
  getDoc
} from 'firebase/firestore';
import { auth, db } from './firebase';

/**
 * Service de gestion des clients
 */
class ClientService {
  /**
   * Ajouter un nouveau client
   */
  static async addClient(clientData) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const clientsRef = collection(db, 'clients', user.uid, 'list');
      
      const newClient = {
        name: clientData.name || '',
        phone: clientData.phone || '',
        email: clientData.email || '',
        address: clientData.address || '',
        notes: clientData.notes || '',
        totalPurchases: 0,
        totalAmount: 0,
        lastPurchaseDate: null,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      const docRef = await addDoc(clientsRef, newClient);

      return {
        success: true,
        clientId: docRef.id,
        client: { id: docRef.id, ...newClient },
      };
    } catch (error) {
      console.error('Erreur lors de l\'ajout du client:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de l\'ajout du client',
      };
    }
  }

  /**
   * Récupérer tous les clients de l'utilisateur
   */
  static async getUserClients() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const clientsRef = collection(db, 'clients', user.uid, 'list');
      const q = query(clientsRef, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);

      const clients = [];
      querySnapshot.forEach((doc) => {
        clients.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
          lastPurchaseDate: doc.data().lastPurchaseDate?.toDate?.()?.toISOString() || null,
        });
      });

      return { success: true, clients };
    } catch (error) {
      console.error('Erreur lors de la récupération des clients:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération des clients',
      };
    }
  }

  /**
   * Récupérer un client par ID
   */
  static async getClient(clientId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const clientRef = doc(db, 'clients', user.uid, 'list', clientId);
      const clientDoc = await getDoc(clientRef);

      if (!clientDoc.exists()) {
        return { success: false, error: 'Client non trouvé' };
      }

      const clientData = {
        id: clientDoc.id,
        ...clientDoc.data(),
        createdAt: clientDoc.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        updatedAt: clientDoc.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
        lastPurchaseDate: clientDoc.data().lastPurchaseDate?.toDate?.()?.toISOString() || null,
      };

      return { success: true, client: clientData };
    } catch (error) {
      console.error('Erreur lors de la récupération du client:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la récupération du client',
      };
    }
  }

  /**
   * Mettre à jour un client
   */
  static async updateClient(clientId, updates) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const clientRef = doc(db, 'clients', user.uid, 'list', clientId);
      
      await updateDoc(clientRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });

      return { success: true, message: 'Client mis à jour avec succès' };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du client:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour du client',
      };
    }
  }

  /**
   * Supprimer un client
   */
  static async deleteClient(clientId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const clientRef = doc(db, 'clients', user.uid, 'list', clientId);
      await deleteDoc(clientRef);

      return { success: true, message: 'Client supprimé avec succès' };
    } catch (error) {
      console.error('Erreur lors de la suppression du client:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la suppression du client',
      };
    }
  }

  /**
   * Mettre à jour les statistiques d'achat d'un client
   */
  static async updateClientPurchaseStats(clientId, amount) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié' };
      }

      const clientRef = doc(db, 'clients', user.uid, 'list', clientId);
      const clientDoc = await getDoc(clientRef);

      if (!clientDoc.exists()) {
        return { success: false, error: 'Client non trouvé' };
      }

      const clientData = clientDoc.data();
      
      await updateDoc(clientRef, {
        totalPurchases: (clientData.totalPurchases || 0) + 1,
        totalAmount: (clientData.totalAmount || 0) + amount,
        lastPurchaseDate: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });

      return { success: true, message: 'Statistiques client mises à jour' };
    } catch (error) {
      console.error('Erreur lors de la mise à jour des stats client:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la mise à jour des statistiques',
      };
    }
  }

  /**
   * Rechercher des clients par nom ou téléphone
   */
  static searchClients(clients, searchTerm) {
    if (!searchTerm) return clients;

    const search = searchTerm.toLowerCase();
    return clients.filter(client =>
      client.name.toLowerCase().includes(search) ||
      (client.phone && client.phone.includes(search)) ||
      (client.email && client.email.toLowerCase().includes(search))
    );
  }

  /**
   * Calculer les statistiques des clients
   */
  static calculateClientStats(clients) {
    return {
      total: clients.length,
      active: clients.filter(c => c.lastPurchaseDate).length,
      totalRevenue: clients.reduce((sum, c) => sum + (c.totalAmount || 0), 0),
      averagePerClient: clients.length > 0
        ? clients.reduce((sum, c) => sum + (c.totalAmount || 0), 0) / clients.length
        : 0,
    };
  }
}

export default ClientService;


