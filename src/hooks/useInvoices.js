import { useState, useEffect, useCallback } from 'react';
import InvoiceService from '../services/invoiceService';
import { 
  doc, 
  deleteDoc, 
  getDoc,
  collection
} from 'firebase/firestore';
import { db, auth } from '../services/firebase';

/**
 * Hook personnalisé pour gérer les factures
 */
export const useInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Charger les factures et calculer les stats
   */
  const loadData = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Charger les factures
      const result = await InvoiceService.getUserInvoices(filters);
      
      if (result.success) {
        const invoicesData = result.invoices || [];
        setInvoices(invoicesData);
        
        // Calculer les statistiques
        const calculatedStats = InvoiceService.calculateInvoiceStats(invoicesData);
        setStats(calculatedStats);
      } else {
        setError(result.error);
        setInvoices([]);
        setStats(null);
      }
    } catch (err) {
      console.error('Erreur dans useInvoices:', err);
      setError('Une erreur inattendue est survenue');
      setInvoices([]);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Rafraîchir les données
   */
  const refreshData = useCallback(async (filters = {}) => {
    setRefreshing(true);
    await loadData(filters);
    setRefreshing(false);
  }, [loadData]);

  /**
   * Créer une nouvelle facture
   */
  const createInvoice = useCallback(async (invoiceData) => {
    const result = await InvoiceService.createInvoice(invoiceData);
    
    if (result.success) {
      await loadData(); // Recharger les données
    }
    
    return result;
  }, [loadData]);

  /**
   * Récupérer une facture par ID
   */
  const getInvoice = useCallback(async (invoiceId) => {
    return await InvoiceService.getInvoiceById(invoiceId);
  }, []);

  /**
   * Mettre à jour le statut d'une facture
   */
  const updateStatus = useCallback(async (invoiceId, status) => {
    const result = await InvoiceService.updateInvoiceStatus(invoiceId, status);
    
    if (result.success) {
      await loadData(); // Recharger les données
    }
    
    return result;
  }, [loadData]);

  /**
   * Mettre à jour une facture existante
   */
  const updateInvoice = useCallback(async (invoiceId, updateData) => {
    try {
      setLoading(true);
      
      // Vérifier que la facture existe et peut être modifiée
      const invoice = invoices.find(inv => inv.id === invoiceId);
      if (!invoice) {
        return { success: false, error: 'Facture introuvable' };
      }
      
      // Vérifier que la facture n'est pas payée
      if (invoice.status === 'paid') {
        return { success: false, error: 'Impossible de modifier une facture déjà payée' };
      }
      
      // Vérifier que la facture n'est pas annulée
      if (invoice.status === 'cancelled') {
        return { success: false, error: 'Impossible de modifier une facture annulée' };
      }
      
      // Préparer les données de mise à jour
      const updatedData = {
        ...updateData,
        updatedAt: new Date().toISOString(),
      };
      
      // Appeler le service pour mettre à jour la facture
      const result = await InvoiceService.updateInvoiceStatus(invoiceId, updatedData);
      
      if (result.success) {
        // Recharger les données
        await loadData();
        return { success: true, invoice: { ...invoice, ...updatedData } };
      } else {
        return { success: false, error: result.error };
      }
    } catch (err) {
      console.error('Erreur mise à jour facture:', err);
      return { success: false, error: 'Erreur lors de la mise à jour de la facture' };
    } finally {
      setLoading(false);
    }
  }, [invoices, loadData]);

  /**
   * Supprimer/Annuler une facture (hard delete direct)
   */
  const deleteInvoice = useCallback(async (invoiceId) => {
    try {
      setLoading(true);
      console.log('🔥 Hook deleteInvoice appelé pour:', invoiceId);
      
      const user = auth.currentUser;
      console.log('👤 Utilisateur:', user ? 'connecté' : 'non connecté');
      console.log('🆔 User UID:', user?.uid);
      
      if (!user) {
        console.log('❌ Utilisateur non connecté dans le hook');
        return { success: false, error: 'Utilisateur non connecté' };
      }

      console.log('📂 Suppression directe du document...');
      console.log('📍 Chemin: invoices/' + user.uid + '/documents/' + invoiceId);
      
      // Construire la référence comme dans le service
      const invoicesCollection = collection(db, `invoices/${user.uid}/documents`);
      const invoiceRef = doc(invoicesCollection, invoiceId);
      
      console.log('📄 Référence du document créée');
      console.log('🗂️ Collection path:', invoicesCollection.path);
      console.log('📄 Document path:', invoiceRef.path);
      
      // Vérifier que le document existe
      const docSnap = await getDoc(invoiceRef);
      if (!docSnap.exists()) {
        console.log('❌ Document non trouvé dans le hook:', invoiceId);
        return { success: false, error: 'Facture non trouvée' };
      }
      
      console.log('✅ Document trouvé, suppression en cours...');
      
      // Supprimer directement
      await deleteDoc(invoiceRef);
      console.log('🔥 Document supprimé directement dans le hook:', invoiceId);
      
      // Recharger les données
      await loadData();
      return { success: true };
    } catch (err) {
      console.error('❌ Erreur suppression facture dans le hook:', err);
      console.error('❌ Détails erreur:', err.code, err.message);
      console.error('❌ Stack trace:', err.stack);
      return { success: false, error: err.message || 'Erreur lors de la suppression' };
    } finally {
      setLoading(false);
    }
  }, [loadData]);

  /**
   * Charger au montage
   */
  useEffect(() => {
    loadData();
  }, [loadData]);

  return {
    // Données
    invoices,
    stats,
    
    // États
    loading,
    refreshing,
    error,
    
    // Actions
    createInvoice,
    getInvoice,
    updateStatus,
    updateInvoice,
    deleteInvoice,
    refreshData,
    loadData,
  };
};

export default useInvoices;


