import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { db, auth } from './firebase';

/**
 * Service de recherche globale dans l'application
 */
class SearchService {
  /**
   * Rechercher dans toutes les collections
   */
  static async globalSearch(searchTerm) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié', results: [] };
      }

      if (!searchTerm || searchTerm.trim().length < 2) {
        return { success: true, results: [], message: 'Entrez au moins 2 caractères' };
      }

      const term = searchTerm.toLowerCase().trim();
      const results = {
        products: [],
        sales: [],
        invoices: [],
        customers: [],
        suppliers: [],
      };

      // Recherche dans les produits
      const productsRef = collection(db, 'products', user.uid, 'list');
      const productsSnapshot = await getDocs(productsRef);
      
      productsSnapshot.forEach((doc) => {
        const data = doc.data();
        const name = (data.name || '').toLowerCase();
        const category = (data.category || '').toLowerCase();
        const sku = (data.sku || '').toLowerCase();
        
        if (name.includes(term) || category.includes(term) || sku.includes(term)) {
          results.products.push({
            id: doc.id,
            type: 'product',
            title: data.name,
            subtitle: `${data.category} - ${data.price} FCFA`,
            icon: 'cube',
            screen: 'Inventory',
            data: { ...data, id: doc.id },
          });
        }
      });

      // Recherche dans les ventes
      const salesRef = collection(db, 'sales', user.uid, 'list');
      const salesQuery = query(salesRef, orderBy('createdAt', 'desc'), limit(100));
      const salesSnapshot = await getDocs(salesQuery);
      
      salesSnapshot.forEach((doc) => {
        const data = doc.data();
        const customerName = (data.customerName || '').toLowerCase();
        const items = data.items || [];
        
        // Recherche par nom client ou produit dans la vente
        const matchesCustomer = customerName.includes(term);
        const matchesProduct = items.some(item => 
          (item.productName || '').toLowerCase().includes(term)
        );
        
        if (matchesCustomer || matchesProduct) {
          results.sales.push({
            id: doc.id,
            type: 'sale',
            title: `Vente - ${data.customerName || 'Client'}`,
            subtitle: `${data.totalAmount} FCFA - ${new Date(data.createdAt).toLocaleDateString()}`,
            icon: 'cart',
            screen: 'SalesHistory',
            data: { ...data, id: doc.id },
          });
        }
      });

      // Recherche dans les factures
      const invoicesRef = collection(db, 'invoices', user.uid, 'list');
      const invoicesQuery = query(invoicesRef, orderBy('createdAt', 'desc'), limit(100));
      const invoicesSnapshot = await getDocs(invoicesQuery);
      
      invoicesSnapshot.forEach((doc) => {
        const data = doc.data();
        const clientName = (data.clientName || '').toLowerCase();
        const invoiceNumber = (data.invoiceNumber || '').toString().toLowerCase();
        
        if (clientName.includes(term) || invoiceNumber.includes(term)) {
          results.invoices.push({
            id: doc.id,
            type: 'invoice',
            title: `Facture ${data.invoiceNumber}`,
            subtitle: `${data.clientName} - ${data.totalAmount} FCFA`,
            icon: 'document-text',
            screen: 'Invoices',
            data: { ...data, id: doc.id },
          });
        }
      });

      // Compter le total des résultats
      const totalResults = 
        results.products.length +
        results.sales.length +
        results.invoices.length +
        results.customers.length +
        results.suppliers.length;

      return {
        success: true,
        results,
        totalResults,
        searchTerm: term,
      };
    } catch (error) {
      console.error('Erreur lors de la recherche:', error);
      return {
        success: false,
        error: error.message || 'Erreur lors de la recherche',
        results: [],
      };
    }
  }

  /**
   * Rechercher uniquement dans les produits
   */
  static async searchProducts(searchTerm) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié', results: [] };
      }

      const term = searchTerm.toLowerCase().trim();
      const productsRef = collection(db, 'products', user.uid, 'list');
      const snapshot = await getDocs(productsRef);
      
      const results = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const name = (data.name || '').toLowerCase();
        
        if (name.includes(term)) {
          results.push({ id: doc.id, ...data });
        }
      });

      return { success: true, results };
    } catch (error) {
      console.error('Erreur:', error);
      return { success: false, error: error.message, results: [] };
    }
  }

  /**
   * Rechercher uniquement dans les ventes
   */
  static async searchSales(searchTerm) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non authentifié', results: [] };
      }

      const term = searchTerm.toLowerCase().trim();
      const salesRef = collection(db, 'sales', user.uid, 'list');
      const q = query(salesRef, orderBy('createdAt', 'desc'), limit(100));
      const snapshot = await getDocs(q);
      
      const results = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        const customerName = (data.customerName || '').toLowerCase();
        
        if (customerName.includes(term)) {
          results.push({ id: doc.id, ...data });
        }
      });

      return { success: true, results };
    } catch (error) {
      console.error('Erreur:', error);
      return { success: false, error: error.message, results: [] };
    }
  }
}

export default SearchService;


