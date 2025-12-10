import { useState, useEffect, useCallback, useMemo } from 'react';
import ProductService from '../services/productService';

/**
 * Hook personnalisé pour gérer les produits
 */
export const useProducts = (options = {}) => {
  const { autoRefresh = false, refreshIntervalMs = 30000 } = options;
  const [allProducts, setAllProducts] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    disponible: 0,
    faible: 0,
    rupture: 0,
    valeurTotale: 0,
  });
  const [alerts, setAlerts] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // États de filtrage
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');

  /**
   * Charger les produits et calculer les stats
   */
  const loadData = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      setError(null);

      // Charger les produits
      const result = await ProductService.getUserProducts(filters);
      
      if (result.success) {
        const productsData = result.products || [];
        setAllProducts(productsData);
        
        // Calculer les statistiques
        const calculatedStats = ProductService.calculateProductStats(productsData);
        
        // Mapper les stats au format attendu par l'UI
        setStats({
          total: calculatedStats.total || 0,
          disponible: calculatedStats.byStatus?.disponible || 0,
          faible: calculatedStats.byStatus?.faible || 0,
          rupture: calculatedStats.byStatus?.rupture || 0,
          valeurTotale: calculatedStats.totalValue || 0,
        });
        
        // Récupérer les alertes
        const alertsResult = await ProductService.getLowStockAlerts();
        if (alertsResult.success) {
          setAlerts(alertsResult);
        }
        
        // Extraire les catégories uniques
        const uniqueCategories = [...new Set(productsData.map(p => p.category))].filter(Boolean);
        setCategories(uniqueCategories);
      } else {
        setError(result.error);
        setAllProducts([]);
        setStats({
          total: 0,
          disponible: 0,
          faible: 0,
          rupture: 0,
          valeurTotale: 0,
        });
      }
    } catch (err) {
      console.error('Erreur dans useProducts:', err);
      setError('Une erreur inattendue est survenue');
      setAllProducts([]);
      setStats({
        total: 0,
        disponible: 0,
        faible: 0,
        rupture: 0,
        valeurTotale: 0,
      });
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
   * Ajouter un produit
   */
  const addProduct = useCallback(async (productData) => {
    const result = await ProductService.addProduct(productData);
    
    if (result.success) {
      await loadData(); // Recharger les données
    }
    
    return result;
  }, [loadData]);

  /**
   * Mettre à jour un produit
   */
  const updateProduct = useCallback(async (productId, updates) => {
    const result = await ProductService.updateProduct(productId, updates);
    
    if (result.success) {
      await loadData(); // Recharger les données
    }
    
    return result;
  }, [loadData]);

  /**
   * Supprimer un produit
   */
  const deleteProduct = useCallback(async (productId) => {
    const result = await ProductService.deleteProduct(productId);
    
    if (result.success) {
      await loadData(); // Recharger les données
    }
    
    return result;
  }, [loadData]);

  /**
   * Récupérer l'historique d'un produit
   */
  const getHistory = useCallback(async (productId) => {
    return await ProductService.getProductHistory(productId);
  }, []);

  /**
   * Filtrer et trier les produits
   */
  const products = useMemo(() => {
    let filtered = [...allProducts];

    // Filtre par recherche
    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name.toLowerCase().includes(search) ||
          p.category.toLowerCase().includes(search) ||
          (p.description && p.description.toLowerCase().includes(search))
      );
    }

    // Filtre par catégorie
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Filtre par statut
    if (selectedStatus !== 'all') {
      filtered = filtered.filter((p) => p.status === selectedStatus);
    }

    // Tri
    filtered.sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'quantity':
          comparison = a.quantity - b.quantity;
          break;
        case 'sellingPrice':
          comparison = a.sellingPrice - b.sellingPrice;
          break;
        case 'createdAt':
          comparison = new Date(a.createdAt) - new Date(b.createdAt);
          break;
        default:
          comparison = 0;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [allProducts, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  /**
   * Rafraîchir les produits
   */
  const refreshProducts = useCallback(async () => {
    await refreshData();
  }, [refreshData]);

  /**
   * Charger les produits au montage et écouter les changements en temps réel
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
    products,
    allProducts,
    stats,
    alerts,
    categories,
    
    // États
    loading,
    refreshing,
    error,
    
    // Filtres
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    selectedStatus,
    setSelectedStatus,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    
    // Actions
    addProduct,
    updateProduct,
    deleteProduct,
    getHistory,
    refreshProducts,
    refreshData,
    loadData,
  };
};

export default useProducts;

