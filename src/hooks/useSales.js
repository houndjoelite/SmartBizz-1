import { useState, useEffect, useCallback } from 'react';
import SalesService from '../services/salesService';

/**
 * Hook personnalisé pour gérer les ventes
 */
export const useSales = (options = {}) => {
  const { autoRefresh = false, refreshIntervalMs = 30000 } = options;
  const [sales, setSales] = useState([]);
  const [losses, setLosses] = useState([]);
  const [stats, setStats] = useState(null);
  const [lossStats, setLossStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Charger les ventes, pertes et calculer toutes les stats
   */
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Charger ventes
      const salesResult = await SalesService.getUserSales();
      const salesData = salesResult.success ? salesResult.sales : [];
      setSales(salesData);

      // Charger pertes
      const lossesResult = await SalesService.getUserLosses();
      const lossesData = lossesResult.success ? lossesResult.losses : [];
      setLosses(lossesData);
      
      // Calculer les stats combinées (ventes + pertes + factures)
      const invoicesData = []; // TODO: Ajouter quand le module factures sera créé
      const calculatedStats = SalesService.calculateSalesStats(salesData, lossesData, invoicesData);
      setStats(calculatedStats);
      
      // Calculer les stats de pertes séparément
      const calculatedLossStats = SalesService.calculateLossStats(lossesData);
      setLossStats(calculatedLossStats);

      if (!salesResult.success) {
        setError(salesResult.error);
      }
    } catch (err) {
      console.error('Erreur dans useSales:', err);
      setError('Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Rafraîchir les données
   */
  const refreshData = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  /**
   * Enregistrer une vente
   */
  const recordSale = useCallback(async (saleData) => {
    const result = await SalesService.recordSale(saleData);
    
    if (result.success) {
      await loadData(); // Recharger les données
    }
    
    return result;
  }, [loadData]);

  /**
   * Enregistrer une perte
   */
  const recordLoss = useCallback(async (lossData) => {
    const result = await SalesService.recordLoss(lossData);
    
    if (result.success) {
      await loadData(); // Recharger les données
    }
    
    return result;
  }, [loadData]);

  /**
   * Charger au montage et écouter les changements en temps réel
   */
  useEffect(() => {
    loadData();
    
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadData();
      }, refreshIntervalMs);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loadData, autoRefresh, refreshIntervalMs]);

  return {
    // Données
    sales,
    losses,
    stats,
    lossStats,
    
    // États
    loading,
    refreshing,
    error,
    
    // Actions
    recordSale,
    recordLoss,
    refreshData,
  };
};

export default useSales;


