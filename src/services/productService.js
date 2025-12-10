import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  addDoc
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage, auth } from './firebase';

/**
 * Service complet de gestion des produits
 * Inclut : Upload d'images, historique, alertes, catégories, etc.
 */
export class ProductService {
  
  /**
   * Uploader une image vers Firebase Storage
   */
  static async uploadProductImage(imageFile, productId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      // Créer un nom de fichier unique
      const timestamp = Date.now();
      const fileExtension = imageFile.name?.split('.').pop() || 'jpg';
      const fileName = `${productId}_${timestamp}.${fileExtension}`;
      
      // Référence dans Storage
      const storageRef = ref(storage, `products/${user.uid}/${fileName}`);
      
      // Upload
      await uploadBytes(storageRef, imageFile);
      
      // Récupérer l'URL
      const downloadURL = await getDownloadURL(storageRef);
      
      return { success: true, url: downloadURL, path: storageRef.fullPath };
    } catch (error) {
      console.error('❌ Erreur upload image:', error);
      return { success: false, error: 'Erreur lors de l\'upload de l\'image' };
    }
  }

  /**
   * Supprimer une image de Firebase Storage
   */
  static async deleteProductImage(imagePath) {
    try {
      if (!imagePath) return { success: true };
      
      const imageRef = ref(storage, imagePath);
      await deleteObject(imageRef);
      
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur suppression image:', error);
      // Ne pas bloquer si l'image n'existe pas
      return { success: true };
    }
  }

  /**
   * Ajouter un produit (version complète)
   */
  static async addProduct(productData) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      // Validation
      if (!productData.name || !productData.category) {
        return { success: false, error: 'Nom et catégorie requis' };
      }

      // Créer l'ID du produit
      const productId = doc(collection(db, `inventory/${user.uid}/products`)).id;

      // Upload de l'image si fournie
      let imageUrl = null;
      let imagePath = null;
      if (productData.imageFile) {
        const uploadResult = await this.uploadProductImage(productData.imageFile, productId);
        if (uploadResult.success) {
          imageUrl = uploadResult.url;
          imagePath = uploadResult.path;
        }
      }

      // Déterminer le statut du stock
      const quantity = productData.quantity || 0;
      const stockThreshold = productData.stockThreshold || 5;
      const status = this.getStockStatus(quantity, stockThreshold);

      // Créer le produit
      const product = {
        // Informations de base
        name: productData.name,
        category: productData.category,
        description: productData.description || '',
        
        // Prix
        purchasePrice: parseFloat(productData.purchasePrice) || 0,
        sellingPrice: parseFloat(productData.sellingPrice) || 0,
        
        // Stock
        quantity: quantity,
        unit: productData.unit || 'pièce',
        stockThreshold: stockThreshold,
        status: status,
        
        // Image
        imageUrl: imageUrl,
        imagePath: imagePath,
        
        // Visibilité en ligne
        online: productData.online || false,
        
        // Métadonnées
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
      };

      // Sauvegarder dans Firestore
      const productRef = doc(db, `inventory/${user.uid}/products`, productId);
      await setDoc(productRef, product);

      // Créer l'entrée dans l'historique
      await this.addToHistory(user.uid, productId, {
        action: 'created',
        changes: {
          quantity: { from: 0, to: quantity },
        },
        description: `Produit créé avec un stock initial de ${quantity} ${product.unit}`,
      });

      console.log('✅ Produit ajouté:', productId);
      return { success: true, productId, product };
    } catch (error) {
      console.error('❌ Erreur ajout produit:', error);
      return { success: false, error: 'Erreur lors de l\'ajout du produit' };
    }
  }

  /**
   * Mettre à jour un produit
   */
  static async updateProduct(productId, updates) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      // Récupérer le produit actuel
      const productRef = doc(db, `inventory/${user.uid}/products`, productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        return { success: false, error: 'Produit non trouvé' };
      }

      const currentProduct = productSnap.data();

      // Upload nouvelle image si fournie
      let imageUrl = currentProduct.imageUrl;
      let imagePath = currentProduct.imagePath;
      
      if (updates.imageFile) {
        // Supprimer l'ancienne image
        if (currentProduct.imagePath) {
          await this.deleteProductImage(currentProduct.imagePath);
        }
        
        // Upload nouvelle image
        const uploadResult = await this.uploadProductImage(updates.imageFile, productId);
        if (uploadResult.success) {
          imageUrl = uploadResult.url;
          imagePath = uploadResult.path;
        }
      }

      // Préparer les mises à jour
      const updatedData = {
        ...updates,
        imageUrl: imageUrl,
        imagePath: imagePath,
        updatedAt: serverTimestamp(),
      };

      // Supprimer les champs non autorisés
      delete updatedData.imageFile;
      delete updatedData.createdAt;
      delete updatedData.createdBy;

      // Mettre à jour le statut si la quantité a changé
      if (updates.quantity !== undefined) {
        const stockThreshold = updates.stockThreshold || currentProduct.stockThreshold || 5;
        updatedData.status = this.getStockStatus(updates.quantity, stockThreshold);
      }

      // Sauvegarder
      await updateDoc(productRef, updatedData);

      // Ajouter à l'historique
      const changes = {};
      let hasChanges = false;

      if (updates.quantity !== undefined && updates.quantity !== currentProduct.quantity) {
        changes.quantity = {
          from: currentProduct.quantity,
          to: updates.quantity,
        };
        hasChanges = true;
      }

      if (updates.purchasePrice !== undefined && updates.purchasePrice !== currentProduct.purchasePrice) {
        changes.purchasePrice = {
          from: currentProduct.purchasePrice,
          to: updates.purchasePrice,
        };
        hasChanges = true;
      }

      if (updates.sellingPrice !== undefined && updates.sellingPrice !== currentProduct.sellingPrice) {
        changes.sellingPrice = {
          from: currentProduct.sellingPrice,
          to: updates.sellingPrice,
        };
        hasChanges = true;
      }

      if (hasChanges) {
        await this.addToHistory(user.uid, productId, {
          action: 'updated',
          changes: changes,
          description: this.generateUpdateDescription(changes),
        });
      }

      console.log('✅ Produit mis à jour:', productId);
      return { success: true, productId };
    } catch (error) {
      console.error('❌ Erreur mise à jour produit:', error);
      return { success: false, error: 'Erreur lors de la mise à jour' };
    }
  }

  /**
   * Supprimer un produit
   */
  static async deleteProduct(productId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      // Récupérer le produit
      const productRef = doc(db, `inventory/${user.uid}/products`, productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        return { success: false, error: 'Produit non trouvé' };
      }

      const product = productSnap.data();

      // Supprimer l'image si elle existe
      if (product.imagePath) {
        await this.deleteProductImage(product.imagePath);
      }

      // Ajouter à l'historique avant de supprimer
      await this.addToHistory(user.uid, productId, {
        action: 'deleted',
        changes: {},
        description: `Produit "${product.name}" supprimé`,
      });

      // Supprimer le produit
      await deleteDoc(productRef);

      console.log('✅ Produit supprimé:', productId);
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur suppression produit:', error);
      return { success: false, error: 'Erreur lors de la suppression' };
    }
  }

  /**
   * Récupérer tous les produits
   */
  static async getUserProducts(filters = {}) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const productsRef = collection(db, `inventory/${user.uid}/products`);
      let q = query(productsRef, orderBy('createdAt', 'desc'));

      // Appliquer les filtres
      if (filters.category) {
        q = query(productsRef, where('category', '==', filters.category), orderBy('createdAt', 'desc'));
      }

      if (filters.status) {
        q = query(productsRef, where('status', '==', filters.status), orderBy('createdAt', 'desc'));
      }

      const querySnapshot = await getDocs(q);
      const products = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        products.push({
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      });

      // Filtres locaux
      let filteredProducts = products;

      if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchTerm) ||
          p.category.toLowerCase().includes(searchTerm)
        );
      }

      if (filters.lowStock) {
        filteredProducts = filteredProducts.filter(p => 
          p.quantity <= (p.stockThreshold || 5)
        );
      }

      if (filters.online !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.online === filters.online);
      }

      return { success: true, products: filteredProducts };
    } catch (error) {
      console.error('❌ Erreur récupération produits:', error);
      return { success: false, error: 'Erreur lors de la récupération' };
    }
  }

  /**
   * Récupérer l'historique d'un produit
   */
  static async getProductHistory(productId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const historyRef = collection(db, `inventory/${user.uid}/products/${productId}/history`);
      const q = query(historyRef, orderBy('timestamp', 'desc'));
      const querySnapshot = await getDocs(q);

      const history = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        history.push({
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate(),
        });
      });

      return { success: true, history };
    } catch (error) {
      console.error('❌ Erreur récupération historique:', error);
      return { success: false, error: 'Erreur lors de la récupération de l\'historique' };
    }
  }

  /**
   * Ajouter une entrée dans l'historique
   */
  static async addToHistory(userId, productId, historyData) {
    try {
      const historyRef = collection(db, `inventory/${userId}/products/${productId}/history`);
      
      await addDoc(historyRef, {
        ...historyData,
        timestamp: serverTimestamp(),
        userId: userId,
      });

      return { success: true };
    } catch (error) {
      console.error('❌ Erreur ajout historique:', error);
      return { success: false };
    }
  }

  /**
   * Obtenir les alertes de stock bas
   */
  static async getLowStockAlerts() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const result = await this.getUserProducts();
      if (!result.success) {
        return result;
      }

      const lowStockProducts = result.products.filter(product => 
        product.quantity <= (product.stockThreshold || 5) && product.quantity > 0
      );

      const outOfStockProducts = result.products.filter(product => 
        product.quantity === 0
      );

      return {
        success: true,
        lowStock: lowStockProducts,
        outOfStock: outOfStockProducts,
        totalAlerts: lowStockProducts.length + outOfStockProducts.length,
      };
    } catch (error) {
      console.error('❌ Erreur alertes stock:', error);
      return { success: false, error: 'Erreur lors de la récupération des alertes' };
    }
  }

  /**
   * Obtenir les catégories disponibles
   */
  static async getCategories() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const result = await this.getUserProducts();
      if (!result.success) {
        return result;
      }

      const categories = [...new Set(result.products.map(p => p.category))];
      
      return { success: true, categories: categories.sort() };
    } catch (error) {
      console.error('❌ Erreur récupération catégories:', error);
      return { success: false, error: 'Erreur lors de la récupération des catégories' };
    }
  }

  /**
   * Calculer les statistiques des produits
   */
  static calculateProductStats(products) {
    const stats = {
      total: products.length,
      totalValue: 0,
      lowStock: 0,
      outOfStock: 0,
      online: 0,
      byCategory: {},
      byStatus: {
        disponible: 0,
        faible: 0,
        rupture: 0,
      },
    };

    products.forEach(product => {
      // Valeur totale du stock
      stats.totalValue += (product.purchasePrice || 0) * (product.quantity || 0);

      // Alertes stock
      if (product.quantity === 0) {
        stats.outOfStock++;
      } else if (product.quantity <= (product.stockThreshold || 5)) {
        stats.lowStock++;
      }

      // En ligne
      if (product.online) {
        stats.online++;
      }

      // Par catégorie
      if (!stats.byCategory[product.category]) {
        stats.byCategory[product.category] = {
          count: 0,
          totalValue: 0,
        };
      }
      stats.byCategory[product.category].count++;
      stats.byCategory[product.category].totalValue += (product.purchasePrice || 0) * (product.quantity || 0);

      // Par statut
      if (product.status) {
        stats.byStatus[product.status] = (stats.byStatus[product.status] || 0) + 1;
      }
    });

    return stats;
  }

  /**
   * Déterminer le statut du stock
   */
  static getStockStatus(quantity, threshold = 5) {
    if (quantity === 0) return 'rupture';
    if (quantity <= threshold) return 'faible';
    return 'disponible';
  }

  /**
   * Générer une description pour l'historique
   */
  static generateUpdateDescription(changes) {
    const descriptions = [];

    if (changes.quantity) {
      descriptions.push(`Stock modifié : ${changes.quantity.from} → ${changes.quantity.to}`);
    }

    if (changes.purchasePrice) {
      descriptions.push(`Prix d'achat : ${changes.purchasePrice.from} → ${changes.purchasePrice.to} FCFA`);
    }

    if (changes.sellingPrice) {
      descriptions.push(`Prix de vente : ${changes.sellingPrice.from} → ${changes.sellingPrice.to} FCFA`);
    }

    return descriptions.join(', ') || 'Produit mis à jour';
  }

  /**
   * Catégories par défaut suggérées
   */
  static getDefaultCategories() {
    return [
      'Alimentation',
      'Boissons',
      'Coiffure',
      'Transfert d\'argent',
      'Électronique',
      'Vêtements',
      'Cosmétiques',
      'Fournitures',
      'Services',
      'Autre',
    ];
  }

  /**
   * Unités de mesure disponibles
   */
  static getUnits() {
    return [
      'pièce',
      'kg',
      'g',
      'litre',
      'ml',
      'paquet',
      'boîte',
      'sachet',
      'mètre',
      'cm',
    ];
  }
}

export default ProductService;


