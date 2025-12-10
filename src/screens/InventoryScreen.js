import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Alert,
  RefreshControl,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { useSales } from '../hooks/useSales';
import ModernProductCard from '../components/ModernProductCard';
import ProductModalAdvanced from '../components/ProductModalAdvanced';
import ProductDetailsModal from '../components/ProductDetailsModal';
import InventoryBarChart from '../components/InventoryBarChart';
import InventoryLineChart from '../components/InventoryLineChart';
import InventoryPieChart from '../components/InventoryPieChart';
import InventoryTable from '../components/InventoryTable';
import theme from '../styles/theme';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const InventoryScreen = ({ navigation }) => {
  const {
    products,
    allProducts,
    stats,
    loading,
    refreshing,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts,
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
    categories,
  } = useProducts();

  const { sales, loading: salesLoading } = useSales();

  const [modalVisible, setModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);

  // États pour les statistiques du dashboard
  const [kpiData, setKpiData] = useState({
    totalQuantity: 0,
    totalProducts: 0,
    lowStock: 0,
    outOfStock: 0,
  });

  const [monthlyStockData, setMonthlyStockData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [stockMovementData, setStockMovementData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [categoryPieData, setCategoryPieData] = useState([]);
  const [stockStatusData, setStockStatusData] = useState([]);

  /**
   * Calculer toutes les statistiques du dashboard
   */
  useEffect(() => {
    if (allProducts.length > 0) {
      calculateKPIs();
      calculateMonthlyStock();
      calculateCategoryDistribution();
      calculateStockMovement();
      calculateTopProducts();
      calculateCategoryPie();
      calculateStockStatus();
    }
  }, [allProducts, sales]);

  /**
   * Calculer les KPIs (SANS PRIX)
   */
  const calculateKPIs = () => {
    // Quantité totale en stock
    const totalQuantity = allProducts.reduce(
      (sum, product) => sum + (product.quantity || 0),
      0
    );

    // Nombre total de produits
    const totalProducts = allProducts.length;

    // Produits en stock faible
    const lowStock = allProducts.filter((p) => {
      const qty = p.quantity || 0;
      const min = p.minimumStock || 5;
      return qty > 0 && qty <= min;
    }).length;

    // Produits en rupture de stock
    const outOfStock = allProducts.filter((p) => (p.quantity || 0) === 0).length;

    setKpiData({
      totalQuantity,
      totalProducts,
      lowStock,
      outOfStock,
    });
  };

  /**
   * Stock total par mois
   */
  const calculateMonthlyStock = () => {
    const monthlyData = {};
    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
      'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
    ];

    // Initialiser les 12 derniers mois
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyData[key] = 0;
    }

    // Calculer le stock total par mois
    allProducts.forEach((product) => {
      if (product.createdAt) {
        const date = product.createdAt.toDate ? product.createdAt.toDate() : new Date(product.createdAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
        if (monthlyData[key] !== undefined) {
          monthlyData[key] += product.quantity || 0;
        }
      }
    });

    const chartData = Object.entries(monthlyData).map(([key, value]) => {
      const [year, month] = key.split('-');
      return {
        label: months[parseInt(month) - 1],
        value: value,
        color: theme.colors.primary,
      };
    });

    setMonthlyStockData(chartData);
  };

  /**
   * Répartition par catégorie
   */
  const calculateCategoryDistribution = () => {
    const categoryMap = {};
    const colors = [
      theme.colors.primary,
      theme.colors.success,
      '#F59E0B',
      '#EF4444',
      '#8B5CF6',
      '#EC4899',
      '#14B8A6',
    ];

    allProducts.forEach((product) => {
      const category = product.category || 'Sans catégorie';
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category] += product.quantity || 0;
    });

    const chartData = Object.entries(categoryMap)
      .map(([category, quantity], index) => ({
        label: category,
        value: quantity,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value);

    setCategoryData(chartData);
  };

  /**
   * Mouvement de stock (entrées/sorties par mois)
   */
  const calculateStockMovement = () => {
    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
      'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
    ];

    const entriesData = [];
    const exitsData = [];
    const labels = [];

    // Calculer pour les 12 derniers mois
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthLabel = months[date.getMonth()];
      labels.push(monthLabel);

      // Entrées: nouveaux produits ce mois
      const monthProducts = allProducts.filter((product) => {
        if (!product.createdAt) return false;
        const pDate = product.createdAt.toDate ? product.createdAt.toDate() : new Date(product.createdAt);
        return pDate.getMonth() === date.getMonth() && pDate.getFullYear() === date.getFullYear();
      });

      const entries = monthProducts.reduce((sum, p) => sum + (p.quantity || 0), 0);

      // Sorties: quantités vendues ce mois
      const monthSales = sales.filter((sale) => {
        if (!sale.createdAt) return false;
        const sDate = sale.createdAt.toDate ? sale.createdAt.toDate() : new Date(sale.createdAt);
        return sDate.getMonth() === date.getMonth() && sDate.getFullYear() === date.getFullYear();
      });

      let exits = 0;
      monthSales.forEach((sale) => {
        if (sale.items && Array.isArray(sale.items)) {
          sale.items.forEach((item) => {
            exits += item.quantity || 0;
          });
        }
      });

      entriesData.push(entries);
      exitsData.push(exits);
    }

    const chartData = [
      {
        label: 'Entrées',
        values: entriesData,
        labels: labels,
      },
      {
        label: 'Sorties',
        values: exitsData,
        labels: labels,
      },
    ];

    setStockMovementData(chartData);
  };

  /**
   * Top 7 produits par quantité en stock
   */
  const calculateTopProducts = () => {
    const topProducts = [...allProducts]
      .sort((a, b) => (b.quantity || 0) - (a.quantity || 0))
      .slice(0, 7);

    const colors = [
      '#10B981', // Vert
      '#3B82F6', // Bleu
      '#6B7280', // Gris
      '#1F2937', // Gris foncé
      '#F59E0B', // Orange
      '#3B82F6', // Bleu clair
      '#059669', // Vert foncé
    ];

    const chartData = topProducts.map((product, index) => ({
      label: product.name || 'Produit',
      value: product.quantity || 0,
      color: colors[index % colors.length],
    }));

    setTopProductsData(chartData);
  };

  /**
   * Répartition par catégorie (graphique circulaire)
   */
  const calculateCategoryPie = () => {
    const categoryMap = {};
    const colors = [
      '#34D399',
      '#60A5FA',
      '#A78BFA',
      '#F472B6',
      '#FBBF24',
      '#F87171',
      '#4ADE80',
    ];

    allProducts.forEach((product) => {
      const category = product.category || 'Sans catégorie';
      if (!categoryMap[category]) {
        categoryMap[category] = 0;
      }
      categoryMap[category]++;
    });

    const chartData = Object.entries(categoryMap)
      .map(([category, count], index) => ({
        label: category,
        value: count,
        color: colors[index % colors.length],
      }))
      .sort((a, b) => b.value - a.value);

    setCategoryPieData(chartData);
  };

  /**
   * Statut du stock par mois
   */
  const calculateStockStatus = () => {
    const months = [
      'Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Jun',
      'Jul', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'
    ];

    const disponibleData = [];
    const lowStockData = [];
    const outOfStockData = [];
    const labels = [];

    // Calculer pour les 12 derniers mois
    const now = new Date();
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(months[date.getMonth()]);

      // Compter les produits selon leur statut
      const disponible = allProducts.filter((p) => {
        const qty = p.quantity || 0;
        const min = p.minimumStock || 5;
        return qty > min;
      }).length;

      const lowStock = allProducts.filter((p) => {
        const qty = p.quantity || 0;
        const min = p.minimumStock || 5;
        return qty > 0 && qty <= min;
      }).length;

      const outOfStock = allProducts.filter((p) => (p.quantity || 0) === 0).length;

      disponibleData.push(disponible);
      lowStockData.push(lowStock);
      outOfStockData.push(outOfStock);
    }

    const chartData = [
      {
        label: 'Disponible',
        values: disponibleData,
        labels: labels,
      },
      {
        label: 'Stock Faible',
        values: lowStockData,
        labels: labels,
      },
      {
        label: 'Rupture',
        values: outOfStockData,
        labels: labels,
      },
    ];

    setStockStatusData(chartData);
  };

  /**
   * Ouvrir le modal pour ajouter un produit
   */
  const handleAddProduct = () => {
    setSelectedProduct(null);
    setModalVisible(true);
  };

  /**
   * Ouvrir le modal pour modifier un produit
   */
  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setModalVisible(true);
  };

  /**
   * Ouvrir le modal de détails du produit
   */
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
    setDetailsModalVisible(true);
  };

  /**
   * Soumettre le formulaire (ajout ou modification)
   */
  const handleSubmitProduct = async (productData) => {
    setSubmitting(true);

    try {
      let result;
      
      if (selectedProduct) {
        // Modification
        result = await updateProduct(selectedProduct.id, productData);
      } else {
        // Ajout
        result = await addProduct(productData);
      }

      if (result.success) {
        setModalVisible(false);
        setSelectedProduct(null);
        Alert.alert(
          'Succès',
          selectedProduct
            ? 'Produit modifié avec succès'
            : 'Produit ajouté avec succès'
        );
      } else {
        Alert.alert('Erreur', result.error);
      }
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur inattendue est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Supprimer un produit avec confirmation
   */
  const handleDeleteProduct = (product) => {
    if (Platform.OS === 'web') {
      const confirmation = window.confirm(
        `Êtes-vous sûr de vouloir supprimer "${product.name}" ?\n\nCette action est irréversible.`
      );
      
      if (confirmation) {
        performDelete(product);
      }
    } else {
      Alert.alert(
        'Confirmer la suppression',
        `Êtes-vous sûr de vouloir supprimer "${product.name}" ?\n\nCette action est irréversible.`,
        [
          { text: 'Annuler', style: 'cancel' },
          {
            text: 'Supprimer',
            style: 'destructive',
            onPress: () => performDelete(product),
          },
        ]
      );
    }
  };

  /**
   * Effectuer la suppression
   */
  const performDelete = async (product) => {
    setSubmitting(true);
    
    try {
      const result = await deleteProduct(product.id);
      
      if (result.success) {
        if (Platform.OS === 'web') {
          alert('Produit supprimé avec succès');
        } else {
          Alert.alert('Succès', 'Produit supprimé avec succès');
        }
      } else {
        if (Platform.OS === 'web') {
          alert(`Erreur : ${result.error}`);
        } else {
          Alert.alert('Erreur', result.error);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      if (Platform.OS === 'web') {
        alert('Une erreur inattendue est survenue');
      } else {
        Alert.alert('Erreur', 'Une erreur inattendue est survenue');
      }
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Changer le tri
   */
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  /**
   * Formater les grands nombres
   */
  const formatNumber = (num) => {
    return num.toLocaleString('fr-FR');
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement de l'inventaire...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>❌ {error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshProducts}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* En-tête avec boutons */}
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <Text style={styles.headerTitle}>Inventaire</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            style={styles.addButton}
            onPress={refreshProducts}
            disabled={refreshing}
          >
            {refreshing ? (
              <ActivityIndicator color={theme.colors.textPrimary} />
            ) : (
              <Text style={styles.addButtonText}>↻ Rafraîchir</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewToggle, !showDashboard && styles.viewToggleActive]}
            onPress={() => setShowDashboard(false)}
          >
            <Text style={[styles.viewToggleText, !showDashboard && styles.viewToggleTextActive]}>
              Liste
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.viewToggle, showDashboard && styles.viewToggleActive]}
            onPress={() => setShowDashboard(true)}
          >
            <Text style={[styles.viewToggleText, showDashboard && styles.viewToggleTextActive]}>
              Statistiques
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.addButton} onPress={handleAddProduct}>
            <Text style={styles.addButtonText}>+ Ajouter</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Vue Dashboard */}
      {showDashboard ? (
        <ScrollView style={styles.dashboardContainer} showsVerticalScrollIndicator={false}>
          {/* En-tête Dashboard */}
          <View style={styles.dashboardHeader}>
            <Text style={styles.dashboardTitle}>
              Tableau de Bord - Inventaire
            </Text>
            <Text style={styles.dashboardSubtitle}>
              Affichage des quantités, stock et catégories
            </Text>
          </View>

          {/* 4 grandes cartes KPI (SANS PRIX) */}
          <View style={styles.kpiContainer}>
            <View style={[styles.kpiCard, { borderLeftColor: theme.colors.success }]}>
              <Text style={styles.kpiValue}>{formatNumber(kpiData.totalQuantity)}</Text>
              <Text style={styles.kpiLabel}>Quantité Totale en Stock</Text>
            </View>

            <View style={[styles.kpiCard, { borderLeftColor: theme.colors.primary }]}>
              <Text style={styles.kpiValue}>{formatNumber(kpiData.totalProducts)}</Text>
              <Text style={styles.kpiLabel}>Nombre de Produits</Text>
            </View>

            <View style={[styles.kpiCard, { borderLeftColor: '#F59E0B' }]}>
              <Text style={styles.kpiValue}>{formatNumber(kpiData.lowStock)}</Text>
              <Text style={styles.kpiLabel}>Stock Faible</Text>
            </View>

            <View style={[styles.kpiCard, { borderLeftColor: '#EF4444' }]}>
              <Text style={styles.kpiValue}>{formatNumber(kpiData.outOfStock)}</Text>
              <Text style={styles.kpiLabel}>Rupture de Stock</Text>
            </View>
          </View>

          {/* Grille de graphiques */}
          <View style={styles.chartsGrid}>
            {/* Première ligne */}
            <View style={styles.chartRow}>
              <View style={[styles.chartCell, isMobile && styles.chartCellFull]}>
                <InventoryBarChart
                  data={monthlyStockData}
                  title="Quantités en Stock par Mois"
                  height={220}
                />
              </View>
              <View style={[styles.chartCell, isMobile && styles.chartCellFull]}>
                <InventoryBarChart
                  data={categoryData}
                  title="Quantités par Catégorie"
                  height={220}
                />
              </View>
            </View>

            {/* Deuxième ligne */}
            <View style={styles.chartRow}>
              <View style={[styles.chartCell, isMobile && styles.chartCellFull]}>
                <InventoryLineChart
                  data={stockMovementData}
                  title="Mouvement de Stock (Entrées/Sorties)"
                  height={220}
                  colors={[theme.colors.success, '#EF4444']}
                />
              </View>
            </View>

            {/* Troisième ligne */}
            <View style={styles.chartRow}>
              <View style={[styles.chartCell, isMobile && styles.chartCellFull]}>
                <InventoryBarChart
                  data={topProductsData}
                  title="Top 7 Produits par Quantité"
                  height={220}
                />
              </View>
              <View style={[styles.chartCell, isMobile && styles.chartCellFull]}>
                <InventoryPieChart
                  data={categoryPieData}
                  title="Nombre de Produits par Catégorie"
                  size={200}
                />
              </View>
            </View>

            {/* Quatrième ligne */}
            <View style={styles.chartRow}>
              <View style={[styles.chartCell, isMobile && styles.chartCellFull]}>
                <InventoryLineChart
                  data={stockStatusData}
                  title="Évolution du Statut de Stock"
                  height={220}
                  colors={[theme.colors.success, '#F59E0B', '#EF4444']}
                />
              </View>
            </View>
          </View>

          <View style={{ height: 40 }} />
        </ScrollView>
      ) : (
        /* Vue Liste */
        <>
          {/* Statistiques rapides */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{stats.total}</Text>
              <Text style={styles.statLabel}>Produits</Text>
            </View>
            
            <View style={[styles.statCard, styles.statCardSuccess]}>
              <Text style={[styles.statValue, styles.statValueSuccess]}>
                {stats.disponible}
              </Text>
              <Text style={styles.statLabel}>Disponibles</Text>
            </View>
            
            <View style={[styles.statCard, styles.statCardWarning]}>
              <Text style={[styles.statValue, styles.statValueWarning]}>
                {stats.faible}
              </Text>
              <Text style={styles.statLabel}>Stock faible</Text>
            </View>
            
            <View style={[styles.statCard, styles.statCardDanger]}>
              <Text style={[styles.statValue, styles.statValueDanger]}>
                {stats.rupture}
              </Text>
              <Text style={styles.statLabel}>Ruptures</Text>
            </View>
          </View>

          {/* Overlay de chargement pendant suppression */}
          {submitting && (
            <View style={styles.loadingOverlay}>
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text style={styles.loadingOverlayText}>Opération en cours...</Text>
              </View>
            </View>
          )}

          {/* Tableau d'inventaire avancé */}
          {products.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>
                Aucun produit dans l'inventaire
              </Text>
              <Text style={styles.emptyText}>
                Commencez par ajouter votre premier produit
              </Text>
              <TouchableOpacity style={styles.emptyButton} onPress={handleAddProduct}>
                <Text style={styles.emptyButtonText}>+ Ajouter un produit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <InventoryTable
              products={products}
              categories={categories}
              onEdit={handleEditProduct}
              onDelete={handleDeleteProduct}
              onAddLocation={(product) => {
                // TODO: Ajouter modal pour gérer les emplacements
                Alert.alert('Emplacement', `Gérer les emplacements pour ${product.name}`);
              }}
            />
          )}
        </>
      )}

      {/* Modal d'ajout/modification */}
      <ProductModalAdvanced
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleSubmitProduct}
        product={selectedProduct}
        loading={submitting}
      />

      {/* Modal de détails */}
      <ProductDetailsModal
        visible={detailsModalVisible}
        onClose={() => {
          setDetailsModalVisible(false);
          setSelectedProduct(null);
        }}
        product={selectedProduct}
        onEdit={() => {
          setDetailsModalVisible(false);
          handleEditProduct(selectedProduct);
        }}
        onDelete={() => {
          setDetailsModalVisible(false);
          handleDeleteProduct(selectedProduct);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  loadingText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.textSecondary,
  },
  errorText: {
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.danger,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.semibold,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerMobile: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: theme.spacing.sm,
  },
  headerTitle: {
    fontSize: theme.fonts.sizes['2xl'],
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    flexWrap: isMobile ? 'wrap' : 'nowrap',
    width: '100%',
    marginTop: isMobile ? theme.spacing.xs : 0,
  },
  viewToggle: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
  },
  viewToggleActive: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
  },
  viewToggleText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weights.medium,
  },
  viewToggleTextActive: {
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weights.semibold,
  },
  addButton: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  addButtonText: {
    color: theme.colors.textPrimary,
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.bold,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.sm,
    gap: 6,
    backgroundColor: theme.colors.surface,
    alignItems: 'flex-start',
  },
  statCard: {
    width: isMobile ? '100%' : 120,
    backgroundColor: theme.colors.background,
    padding: 8,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  statCardSuccess: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: theme.colors.success,
  },
  statCardWarning: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: '#F59E0B',
  },
  statCardDanger: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: theme.colors.danger,
  },
  statValue: {
    fontSize: 18,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 1,
  },
  statValueSuccess: {
    color: theme.colors.success,
  },
  statValueWarning: {
    color: '#F59E0B',
  },
  statValueDanger: {
    color: theme.colors.danger,
  },
  statLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weights.medium,
    lineHeight: 12,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.md,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
  },
  searchInput: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.textPrimary,
  },
  clearIcon: {
    fontSize: theme.fonts.sizes.xl,
    color: theme.colors.textSecondary,
    padding: 4,
  },
  filterButton: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  filterButtonText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weights.medium,
  },
  filtersPanel: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterGroup: {
    marginBottom: theme.spacing.lg,
  },
  filterLabel: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: '#E5E7EB',
    borderColor: '#E5E7EB',
  },
  filterChipText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
  },
  filterChipTextActive: {
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weights.semibold,
  },
  listContent: {
    padding: theme.spacing.lg,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing['3xl'],
  },
  emptyTitle: {
    fontSize: theme.fonts.sizes['2xl'],
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  emptyButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.semibold,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
  loadingBox: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: 'center',
  },
  loadingOverlayText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weights.medium,
  },
  // Styles Dashboard
  dashboardContainer: {
    flex: 1,
  },
  dashboardHeader: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dashboardTitle: {
    fontSize: theme.fonts.sizes['2xl'],
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },
  dashboardSubtitle: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
  },
  kpiContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.sm,
    gap: 8,
    alignItems: 'flex-start',
  },
  kpiCard: {
    width: isMobile ? '48%' : 140,
    maxWidth: 180,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    padding: 10,
    borderLeftWidth: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  kpiValue: {
    fontSize: 20,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  kpiLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weights.medium,
    lineHeight: 12,
  },
  chartsGrid: {
    padding: theme.spacing.lg,
  },
  chartRow: {
    flexDirection: isMobile ? 'column' : 'row',
    gap: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
  },
  chartCell: {
    flex: 1,
    minWidth: isMobile ? '100%' : 300,
  },
  chartCellFull: {
    width: '100%',
  },
});

export default InventoryScreen;
