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
  runTransaction
} from 'firebase/firestore';
import { db, auth } from './firebase';
import InventoryService from './inventoryService';
import SalesService from './salesService';

/**
 * Service de gestion des factures
 * Gère la création, mise à jour et récupération des factures
 */
export class InvoiceService {
  
  /**
   * Générer un numéro de facture unique
   */
  static async generateInvoiceNumber() {
    const user = auth.currentUser;
    if (!user) return null;

    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    
    // Format: INV-YYYYMM-XXX (ex: INV-202410-001)
    const invoicesRef = collection(db, `invoices/${user.uid}/documents`);
    const q = query(
      invoicesRef, 
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    const existingInvoices = snapshot.docs.filter(doc => {
      const num = doc.data().invoiceNumber;
      return num && num.startsWith(`INV-${year}${month}`);
    });
    
    const nextNumber = existingInvoices.length + 1;
    return `INV-${year}${month}-${String(nextNumber).padStart(3, '0')}`;
  }

  /**
   * Créer une nouvelle facture
   */
  static async createInvoice(invoiceData) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      // Validation
      if (!invoiceData.items || invoiceData.items.length === 0) {
        return { success: false, error: 'Aucun produit sélectionné' };
      }

      // Transaction atomique (facture + mise à jour stocks + enregistrement ventes)
      const result = await runTransaction(db, async (transaction) => {
        // Générer le numéro de facture
        const invoiceNumber = await this.generateInvoiceNumber();
        
        // Vérifier le stock pour chaque produit
        const productChecks = [];
        for (const item of invoiceData.items) {
          const productRef = doc(db, `inventory/${user.uid}/products`, item.productId);
          const productDoc = await transaction.get(productRef);
          
          if (!productDoc.exists()) {
            throw new Error(`Produit ${item.productName} non trouvé`);
          }
          
          const product = productDoc.data();
          if (product.quantity < item.quantity) {
            throw new Error(`Stock insuffisant pour ${item.productName}. Disponible: ${product.quantity}`);
          }
          
          productChecks.push({ ref: productRef, product, item });
        }

        // Calculer les totaux
        const subtotal = invoiceData.items.reduce((sum, item) => sum + item.total, 0);
        const discount = invoiceData.discount || 0;
        const total = subtotal - discount;

        // Créer la facture
        const invoiceId = doc(collection(db, `invoices/${user.uid}/documents`)).id;
        const invoice = {
          invoiceNumber,
          customerName: invoiceData.customerName || 'Client',
          items: invoiceData.items,
          subtotal,
          discount,
          total,
          paymentMethod: invoiceData.paymentMethod || 'Espèces',
          status: invoiceData.status || 'paid',
          notes: invoiceData.notes || '',
          date: invoiceData.date || serverTimestamp(),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        const invoiceRef = doc(db, `invoices/${user.uid}/documents`, invoiceId);
        transaction.set(invoiceRef, invoice);

        // Mettre à jour les stocks et enregistrer les ventes
        for (const check of productChecks) {
          const newQuantity = check.product.quantity - check.item.quantity;
          const newStatus = InventoryService.getStockStatus(newQuantity);
          
          // Mise à jour du stock
          transaction.update(check.ref, {
            quantity: newQuantity,
            status: newStatus,
            updatedAt: serverTimestamp(),
          });

          // Enregistrer la vente
          const saleId = doc(collection(db, `sales/${user.uid}/transactions`)).id;
          const sale = {
            productId: check.item.productId,
            productName: check.item.productName,
            category: check.product.category || 'Non catégorisé',
            quantity: check.item.quantity,
            unitPrice: check.item.unitPrice,
            totalPrice: check.item.total,
            cost: (check.product.purchasePrice || 0) * check.item.quantity,
            profit: check.item.total - ((check.product.purchasePrice || 0) * check.item.quantity),
            invoiceId: invoiceId,
            invoiceNumber: invoiceNumber,
            date: invoiceData.date || serverTimestamp(),
            createdAt: serverTimestamp(),
          };

          const saleRef = doc(db, `sales/${user.uid}/transactions`, saleId);
          transaction.set(saleRef, sale);
        }

        return { invoiceId, invoice, invoiceNumber };
      });

      console.log('✅ Facture créée:', result.invoiceNumber);
      return { success: true, ...result };
    } catch (error) {
      console.error('❌ Erreur création facture:', error);
      return { success: false, error: error.message || 'Erreur lors de la création' };
    }
  }

  /**
   * Récupérer toutes les factures de l'utilisateur
   */
  static async getUserInvoices(filters = {}) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const invoicesRef = collection(db, `invoices/${user.uid}/documents`);
      let q = query(invoicesRef, orderBy('date', 'desc'));

      // Appliquer les filtres si nécessaire
      if (filters.status) {
        q = query(invoicesRef, where('status', '==', filters.status), orderBy('date', 'desc'));
      }

      const querySnapshot = await getDocs(q);
      const invoices = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        invoices.push({
          id: doc.id,
          ...data,
          date: data.date?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        });
      });

      // Filtrer par date si nécessaire (côté client)
      let filteredInvoices = invoices;
      if (filters.startDate || filters.endDate) {
        filteredInvoices = invoices.filter(invoice => {
          const invoiceDate = invoice.date;
          if (filters.startDate && invoiceDate < filters.startDate) return false;
          if (filters.endDate && invoiceDate > filters.endDate) return false;
          return true;
        });
      }

      // Filtrer par client si nécessaire
      if (filters.customerName) {
        const searchTerm = filters.customerName.toLowerCase();
        filteredInvoices = filteredInvoices.filter(invoice => 
          invoice.customerName.toLowerCase().includes(searchTerm)
        );
      }

      return { success: true, invoices: filteredInvoices };
    } catch (error) {
      console.error('❌ Erreur récupération factures:', error);
      return { success: false, error: 'Erreur lors de la récupération des factures' };
    }
  }

  /**
   * Récupérer une facture par son ID
   */
  static async getInvoiceById(invoiceId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const invoiceRef = doc(db, `invoices/${user.uid}/documents`, invoiceId);
      const invoiceDoc = await getDoc(invoiceRef);

      if (!invoiceDoc.exists()) {
        return { success: false, error: 'Facture non trouvée' };
      }

      const data = invoiceDoc.data();
      const invoice = {
        id: invoiceDoc.id,
        ...data,
        date: data.date?.toDate(),
        createdAt: data.createdAt?.toDate(),
        updatedAt: data.updatedAt?.toDate(),
      };

      return { success: true, invoice };
    } catch (error) {
      console.error('❌ Erreur récupération facture:', error);
      return { success: false, error: 'Erreur lors de la récupération' };
    }
  }

  /**
   * Mettre à jour le statut d'une facture
   */
  static async updateInvoiceStatus(invoiceId, status) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      if (!['paid', 'unpaid', 'cancelled'].includes(status)) {
        return { success: false, error: 'Statut invalide' };
      }

      const invoiceRef = doc(db, `invoices/${user.uid}/documents`, invoiceId);
      await updateDoc(invoiceRef, {
        status,
        updatedAt: serverTimestamp(),
      });

      console.log('✅ Statut facture mis à jour:', invoiceId, status);
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur mise à jour statut:', error);
      return { 
        success: false, 
        error: error.message || 'Erreur lors de la mise à jour' 
      };
    }
  }

  /**
   * Supprimer une facture (hard delete - suppression réelle)
   */
  static async deleteInvoice(invoiceId) {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.log('❌ Utilisateur non connecté');
        return { success: false, error: 'Utilisateur non connecté' };
      }

      console.log('🔍 Tentative de suppression facture:', invoiceId);
      console.log('📂 Chemin du document:', `invoices/${user.uid}/documents/${invoiceId}`);

      // Hard delete : supprimer réellement le document
      const invoiceRef = doc(db, `invoices/${user.uid}/documents`, invoiceId);
      
      // Vérifier que le document existe avant de le supprimer
      const docSnap = await getDoc(invoiceRef);
      if (!docSnap.exists()) {
        console.log('❌ Document non trouvé:', invoiceId);
        return { success: false, error: 'Facture non trouvée' };
      }
      
      console.log('✅ Document trouvé, suppression en cours...');
      await deleteDoc(invoiceRef);

      console.log('✅ Facture supprimée avec succès:', invoiceId);
      return { success: true };
    } catch (error) {
      console.error('❌ Erreur suppression facture:', error);
      console.error('❌ Détails erreur:', error.code, error.message);
      return { 
        success: false, 
        error: error.message || 'Erreur lors de la suppression de la facture' 
      };
    }
  }

  /**
   * Calculer les statistiques des factures
   */
  static calculateInvoiceStats(invoices) {
    const now = new Date();
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const stats = {
      totalInvoices: invoices.length,
      totalAmount: 0,
      paidAmount: 0,
      unpaidAmount: 0,
      
      monthInvoices: 0,
      monthAmount: 0,
      monthPaidAmount: 0,
      monthUnpaidAmount: 0,
      
      invoicesByStatus: {
        paid: 0,
        unpaid: 0,
        cancelled: 0,
      },
      
      invoicesByPaymentMethod: {},
      topCustomers: {},
    };

    invoices.forEach(invoice => {
      const amount = invoice.total || 0;
      const invoiceDate = invoice.date;
      
      // Totaux globaux
      stats.totalAmount += amount;
      
      if (invoice.status === 'paid') {
        stats.paidAmount += amount;
      } else if (invoice.status === 'unpaid') {
        stats.unpaidAmount += amount;
      }
      
      // Totaux du mois
      if (invoiceDate >= thisMonth) {
        stats.monthInvoices++;
        stats.monthAmount += amount;
        
        if (invoice.status === 'paid') {
          stats.monthPaidAmount += amount;
        } else if (invoice.status === 'unpaid') {
          stats.monthUnpaidAmount += amount;
        }
      }
      
      // Par statut
      stats.invoicesByStatus[invoice.status] = (stats.invoicesByStatus[invoice.status] || 0) + 1;
      
      // Par mode de paiement
      const method = invoice.paymentMethod || 'Espèces';
      if (!stats.invoicesByPaymentMethod[method]) {
        stats.invoicesByPaymentMethod[method] = { count: 0, amount: 0 };
      }
      stats.invoicesByPaymentMethod[method].count++;
      stats.invoicesByPaymentMethod[method].amount += amount;
      
      // Top clients
      const customer = invoice.customerName || 'Client';
      if (!stats.topCustomers[customer]) {
        stats.topCustomers[customer] = { count: 0, amount: 0 };
      }
      stats.topCustomers[customer].count++;
      stats.topCustomers[customer].amount += amount;
    });

    // Trier les top clients
    stats.topCustomersArray = Object.entries(stats.topCustomers)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 5);

    return stats;
  }

  /**
   * Générer les données pour PDF (structure de base)
   */
  static generateInvoicePDFData(invoice, businessInfo = {}) {
    return {
      // Informations entreprise
      businessName: businessInfo.name || 'Entrepreneur Africa',
      businessAddress: businessInfo.address || '',
      businessPhone: businessInfo.phone || '',
      businessEmail: businessInfo.email || '',
      
      // Informations facture
      invoiceNumber: invoice.invoiceNumber,
      date: invoice.date,
      customerName: invoice.customerName,
      
      // Articles
      items: invoice.items,
      
      // Totaux
      subtotal: invoice.subtotal,
      discount: invoice.discount,
      total: invoice.total,
      
      // Paiement
      paymentMethod: invoice.paymentMethod,
      status: invoice.status,
      
      // Notes
      notes: invoice.notes,
    };
  }
}

export default InvoiceService;


