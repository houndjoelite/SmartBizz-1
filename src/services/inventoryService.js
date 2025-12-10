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
  Timestamp
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage';
import { db, storage } from './firebase';
import { auth } from './firebase';

/**
 * Service de gestion d'inventaire
 * Gère tous les produits dans Firestore
 */
export class InventoryService {
  
  /**
   * Obtenir tous les produits de l'utilisateur connecté
   */
  static async getUserProducts() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const productsRef = collection(db, `inventory/${user.uid}/products`);
      const q = query(productsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);

      const products = [];
      querySnapshot.forEach((doc) => {
        products.push({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        });
      });

      return { success: true, products };
    } catch (error) {
      console.error('Erreur lors de la récupération des produits:', error);
      return { success: false, error: 'Erreur lors de la récupération des produits' };
    }
  }

  /**
   * Obtenir un produit spécifique
   */
  static async getProduct(productId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const productRef = doc(db, `inventory/${user.uid}/products`, productId);
      const productDoc = await getDoc(productRef);

      if (!productDoc.exists()) {
        return { success: false, error: 'Produit non trouvé' };
      }

      const product = {
        id: productDoc.id,
        ...productDoc.data(),
        createdAt: productDoc.data().createdAt?.toDate(),
        updatedAt: productDoc.data().updatedAt?.toDate(),
      };

      return { success: true, product };
    } catch (error) {
      console.error('Erreur lors de la récupération du produit:', error);
      return { success: false, error: 'Erreur lors de la récupération du produit' };
    }
  }

  /**
   * Ajouter un nouveau produit
   */
  static async addProduct(productData) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      // Validation des données
      if (!productData.name || !productData.name.trim()) {
        return { success: false, error: 'Le nom du produit est requis' };
      }
      if (!productData.category) {
        return { success: false, error: 'La catégorie est requise' };
      }
      if (productData.sellingPrice === undefined || productData.sellingPrice < 0) {
        return { success: false, error: 'Le prix de vente est requis et doit être positif' };
      }
      if (productData.quantity === undefined || productData.quantity < 0) {
        return { success: false, error: 'La quantité est requise et doit être positive' };
      }

      // Générer un ID unique
      const productId = doc(collection(db, `inventory/${user.uid}/products`)).id;

      // Déterminer le statut basé sur la quantité
      const status = this.getStockStatus(productData.quantity);

      // Créer le document produit
      const product = {
        name: productData.name.trim(),
        category: productData.category,
        purchasePrice: productData.purchasePrice || 0,
        sellingPrice: productData.sellingPrice,
        quantity: productData.quantity,
        description: productData.description?.trim() || '',
        status: status,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const productRef = doc(db, `inventory/${user.uid}/products`, productId);
      await setDoc(productRef, product);

      return { success: true, productId, product };
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      return { success: false, error: 'Erreur lors de l\'ajout du produit' };
    }
  }

  /**
   * Mettre à jour un produit existant
   */
  static async updateProduct(productId, productData) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      // Validation
      if (productData.name !== undefined && !productData.name.trim()) {
        return { success: false, error: 'Le nom du produit ne peut pas être vide' };
      }
      if (productData.sellingPrice !== undefined && productData.sellingPrice < 0) {
        return { success: false, error: 'Le prix de vente doit être positif' };
      }
      if (productData.quantity !== undefined && productData.quantity < 0) {
        return { success: false, error: 'La quantité doit être positive' };
      }

      const productRef = doc(db, `inventory/${user.uid}/products`, productId);

      // Préparer les données à mettre à jour
      const updateData = {
        ...productData,
        updatedAt: serverTimestamp(),
      };

      // Mettre à jour le statut si la quantité a changé
      if (productData.quantity !== undefined) {
        updateData.status = this.getStockStatus(productData.quantity);
      }

      // Nettoyer les valeurs undefined
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined) {
          delete updateData[key];
        }
      });

      await updateDoc(productRef, updateData);

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la mise à jour du produit:', error);
      return { success: false, error: 'Erreur lors de la mise à jour du produit' };
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

      const productRef = doc(db, `inventory/${user.uid}/products`, productId);
      await deleteDoc(productRef);

      return { success: true };
    } catch (error) {
      console.error('Erreur lors de la suppression du produit:', error);
      return { success: false, error: 'Erreur lors de la suppression du produit' };
    }
  }


  /**
   * Obtenir le statut du stock basé sur la quantité
   */
  static getStockStatus(quantity) {
    if (quantity === 0) {
      return 'rupture';
    } else if (quantity > 0 && quantity <= 5) {
      return 'faible';
    } else {
      return 'disponible';
    }
  }

  /**
   * Rechercher des produits
   */
  static searchProducts(products, searchTerm) {
    if (!searchTerm || !searchTerm.trim()) {
      return products;
    }

    const term = searchTerm.toLowerCase().trim();
    return products.filter(product => 
      product.name.toLowerCase().includes(term) ||
      product.category.toLowerCase().includes(term) ||
      (product.description && product.description.toLowerCase().includes(term))
    );
  }

  /**
   * Trier les produits
   */
  static sortProducts(products, sortBy, sortOrder = 'asc') {
    const sorted = [...products].sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Gérer les valeurs null/undefined
      if (aValue === null || aValue === undefined) return 1;
      if (bValue === null || bValue === undefined) return -1;

      // Comparaison pour les strings
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  /**
   * Filtrer par catégorie
   */
  static filterByCategory(products, category) {
    if (!category || category === 'all') {
      return products;
    }
    return products.filter(product => product.category === category);
  }

  /**
   * Filtrer par statut
   */
  static filterByStatus(products, status) {
    if (!status || status === 'all') {
      return products;
    }
    return products.filter(product => product.status === status);
  }

  /**
   * Obtenir les statistiques de l'inventaire
   */
  static getInventoryStats(products) {
    const stats = {
      total: products.length,
      disponible: 0,
      faible: 0,
      rupture: 0,
      valeurTotale: 0,
    };

    products.forEach(product => {
      stats[product.status]++;
      stats.valeurTotale += product.sellingPrice * product.quantity;
    });

    return stats;
  }
}

export default InventoryService;

