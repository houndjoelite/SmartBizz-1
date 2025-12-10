import { useState, useEffect, useCallback } from 'react';
import InventoryService from '../services/inventoryService';

/**
 * Hook personnalisé pour gérer l'inventaire
 * Fournit toutes les fonctions CRUD et les états nécessaires
 * 
 * @deprecated Utilisez useProducts() à la place pour garantir la synchronisation
 * entre les différents modules (inventaire, ventes, factures)
 */
export const useInventory = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  
  // Filtres et tri
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  /**
   * Charger tous les produits
   */
  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await InventoryService.getUserProducts();
      
      if (result.success) {
        setProducts(result.products);
      } else {
        setError(result.error);
      }
    } catch (err) {
      console.error('Erreur dans useInventory:', err);
      setError('Une erreur inattendue est survenue');
    } finally {
      setLoading(false);
    }
  }, []);

  /**
   * Rafraîchir les produits
   */
  const refreshProducts = useCallback(async () => {
    setRefreshing(true);
    await loadProducts();
    setRefreshing(false);
  }, [loadProducts]);

  /**
   * Ajouter un produit
   */
  const addProduct = useCallback(async (productData) => {
    const result = await InventoryService.addProduct(productData);
    
    if (result.success) {
      await loadProducts(); // Recharger la liste
    }
    
    return result;
  }, [loadProducts]);

  /**
   * Mettre à jour un produit
   */
  const updateProduct = useCallback(async (productId, productData) => {
    const result = await InventoryService.updateProduct(productId, productData);
    
    if (result.success) {
      await loadProducts(); // Recharger la liste
    }
    
    return result;
  }, [loadProducts]);

  /**
   * Supprimer un produit
   */
  const deleteProduct = useCallback(async (productId) => {
    const result = await InventoryService.deleteProduct(productId);
    
    if (result.success) {
      await loadProducts(); // Recharger la liste
    }
    
    return result;
  }, [loadProducts]);


  /**
   * Appliquer les filtres et le tri
   */
  useEffect(() => {
    let result = [...products];

    // Recherche
    if (searchTerm) {
      result = InventoryService.searchProducts(result, searchTerm);
    }

    // Filtrer par catégorie
    if (selectedCategory && selectedCategory !== 'all') {
      result = InventoryService.filterByCategory(result, selectedCategory);
    }

    // Filtrer par statut
    if (selectedStatus && selectedStatus !== 'all') {
      result = InventoryService.filterByStatus(result, selectedStatus);
    }

    // Trier
    if (sortBy) {
      result = InventoryService.sortProducts(result, sortBy, sortOrder);
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedCategory, selectedStatus, sortBy, sortOrder]);

  /**
   * Charger au montage du composant
   */
  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  /**
   * Obtenir les statistiques
   */
  const stats = InventoryService.getInventoryStats(products);

  /**
   * Obtenir les catégories uniques
   */
  const categories = [...new Set(products.map(p => p.category))];

  return {
    // Données
    products: filteredProducts,
    allProducts: products,
    stats,
    categories,
    
    // États
    loading,
    refreshing,
    error,
    
    // Actions CRUD
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
    
    // Filtres et tri
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
  };
};

export default useInventory;

