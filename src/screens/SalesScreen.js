import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Dimensions,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSales } from '../hooks/useSales';
import { useProducts } from '../hooks/useProducts';
import SaleModal from '../components/SaleModal';
import theme from '../styles/theme';
import ReceiptPdfService from '../services/receiptPdfService';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const SalesScreen = ({ navigation }) => {
  const {
    sales,
    stats,
    loading,
    refreshing,
    error,
    recordSale,
    refreshData,
  } = useSales();

  const { 
    allProducts, 
    loading: productsLoading, 
    refreshProducts 
  } = useProducts();

  const [saleModalVisible, setSaleModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [periodFilter, setPeriodFilter] = useState('all'); // all, today, week, month, year

  /**
   * Ouvrir le modal de vente
   */
  const handleOpenSaleModal = (product) => {
    setSelectedProduct(product);
    setSaleModalVisible(true);
  };

  /**
   * Enregistrer une vente
   */
  const handleRecordSale = async (saleData) => {
    setSubmitting(true);

    try {
      const result = await recordSale(saleData);

      if (result.success) {
        setSaleModalVisible(false);
        setSelectedProduct(null);
        
        // ✅ IMPORTANT: Rafraîchir les produits après la vente pour synchroniser l'inventaire
        await refreshProducts();
        
        if (Platform.OS === 'web') {
          // Proposer d'imprimer le reçu
          const printReceipt = window.confirm(`✅ Vente enregistrée avec succès!\n\nNouveau stock: ${result.newQuantity} unités\n\nVoulez-vous imprimer le reçu ?`);
          
          if (printReceipt && result.sale) {
            // Imprimer le reçu professionnel
            await handlePrintReceipt(result.sale);
          }
        }
      } else {
        if (Platform.OS === 'web') {
          alert(`Erreur: ${result.error}`);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      if (Platform.OS === 'web') {
        alert('Une erreur inattendue est survenue');
      }
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Imprimer le reçu d'une vente
   */
  const handlePrintReceipt = async (sale) => {
    if (Platform.OS !== 'web') {
      return;
    }

    const result = await ReceiptPdfService.generateAndPrintReceipt(sale);
    
    if (!result.success) {
      alert(`Erreur lors de la génération du reçu: ${result.error}`);
    }
  };

  /**
   * Formater les nombres
   */
  const formatNumber = (num) => {
    return Math.round(num || 0).toLocaleString('fr-FR');
  };

  /**
   * Formater la date
   */
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  /**
   * Filtrer les statistiques par période
   */
  const getFilteredStats = () => {
    if (!stats) return null;
    
    // TODO: Implémenter le filtrage réel
    return stats;
  };

  if (loading || productsLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>
          {loading ? 'Chargement des ventes...' : 'Chargement des produits...'}
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const filteredStats = getFilteredStats() || stats;
  const hasData = sales && sales.length > 0;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={theme.gradients.secondary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.header}
        >
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Text style={styles.backButtonText}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>📊 Ventes & Performances</Text>
        </LinearGradient>

        {/* Filtres de période */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['all', 'today', 'week', 'month', 'year'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[styles.filterChip, periodFilter === period && styles.filterChipActive]}
                onPress={() => setPeriodFilter(period)}
              >
                <Text style={[styles.filterChipText, periodFilter === period && styles.filterChipTextActive]}>
                  {period === 'all' && 'Tout'}
                  {period === 'today' && 'Aujourd\'hui'}
                  {period === 'week' && 'Cette semaine'}
                  {period === 'month' && 'Ce mois'}
                  {period === 'year' && 'Cette année'}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {hasData ? (
          <>
            {/* Indicateurs clés - Grille responsive */}
            <View style={styles.statsGrid}>
              {/* Revenu total */}
              <View style={[styles.statCard, styles.statCardBlue]}>
                <Text style={styles.statIcon}>💰</Text>
                <Text style={styles.statLabel}>Revenu total cumulé</Text>
                <Text style={styles.statValue}>{formatNumber(filteredStats.totalRevenue)} FCFA</Text>
                <Text style={styles.statSubtext}>{filteredStats.totalSales} ventes</Text>
              </View>

              {/* Produits vendus */}
              <View style={[styles.statCard, styles.statCardGreen]}>
                <Text style={styles.statIcon}>📦</Text>
                <Text style={styles.statLabel}>Total produits vendus</Text>
                <Text style={styles.statValue}>{formatNumber(filteredStats.totalProductsSold)}</Text>
                <Text style={styles.statSubtext}>Unités</Text>
              </View>

              {/* Pertes */}
              <View style={[styles.statCard, styles.statCardRed]}>
                <Text style={styles.statIcon}>⚠️</Text>
                <Text style={styles.statLabel}>Total des pertes</Text>
                <Text style={styles.statValue}>{filteredStats.totalLosses}</Text>
                <Text style={styles.statSubtext}>{formatNumber(filteredStats.totalLossesCost)} FCFA</Text>
              </View>

              {/* Factures */}
              <View style={[styles.statCard, styles.statCardPurple]}>
                <Text style={styles.statIcon}>🧾</Text>
                <Text style={styles.statLabel}>Total factures</Text>
                <Text style={styles.statValue}>{filteredStats.totalInvoices}</Text>
                <Text style={styles.statSubtext}>Générées</Text>
              </View>

              {/* Revenu du mois */}
              <View style={[styles.statCard, styles.statCardOrange]}>
                <Text style={styles.statIcon}>📈</Text>
                <Text style={styles.statLabel}>Revenu du mois</Text>
                <Text style={styles.statValue}>{formatNumber(filteredStats.monthRevenue)} FCFA</Text>
                <Text style={styles.statSubtext}>{filteredStats.monthSales} ventes</Text>
              </View>

              {/* Comparaison mois précédent */}
              <View style={[styles.statCard, styles.statCardTeal]}>
                <Text style={styles.statIcon}>🕒</Text>
                <Text style={styles.statLabel}>Croissance mensuelle</Text>
                <Text style={[
                  styles.statValue,
                  filteredStats.revenueGrowth >= 0 ? styles.statValuePositive : styles.statValueNegative
                ]}>
                  {filteredStats.revenueGrowth >= 0 ? '+' : ''}
                  {filteredStats.revenueGrowth.toFixed(1)}%
                </Text>
                <Text style={styles.statSubtext}>vs mois précédent</Text>
              </View>
            </View>

            {/* Section Analyse des performances */}
            <View style={styles.chartsSection}>
              <Text style={styles.sectionTitle}>Analyse des performances</Text>
              
              {/* Revenus journaliers (30 derniers jours) */}
              {filteredStats.dailySalesData && filteredStats.dailySalesData.length > 0 && (
                <View style={styles.chartCard}>
                  <Text style={styles.chartTitle}>Revenus journaliers (30 derniers jours)</Text>
                  <View style={styles.monthlyBarsContainer}>
                    {filteredStats.dailySalesData.map((item, index) => {
                      const maxRevenue = Math.max(...filteredStats.dailySalesData.map(d => d.revenue));
                      const barHeight = maxRevenue > 0 ? (item.revenue / maxRevenue) * 100 : 0;
                      
                      // Afficher seulement tous les 5 jours pour éviter la surcharge
                      const showLabel = index % 5 === 0 || index === filteredStats.dailySalesData.length - 1;
                      
                      return (
                        <View key={index} style={styles.monthlyBarWrapper}>
                          <View style={styles.monthlyBarContainer}>
                            <View style={[styles.monthlyBar, { height: `${barHeight}%` }]}>
                              {item.revenue > 0 && barHeight > 15 && (
                                <Text style={styles.monthlyBarLabel}>
                                  {(item.revenue / 1000).toFixed(0)}K
                                </Text>
                              )}
                            </View>
                          </View>
                          {showLabel && (
                            <Text style={styles.monthlyBarMonth}>{item.day}</Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Top produits vendus */}
              {filteredStats.topProductsArray && filteredStats.topProductsArray.length > 0 && (
                <View style={styles.chartCard}>
                  <Text style={styles.chartTitle}>Top 5 produits les plus vendus</Text>
                  {filteredStats.topProductsArray.map((product, index) => {
                    const maxQuantity = filteredStats.topProductsArray[0].quantity;
                    const percentage = (product.quantity / maxQuantity) * 100;
                    
                    return (
                      <View key={index} style={styles.topProductItem}>
                        <View style={styles.topProductHeader}>
                          <Text style={styles.topProductRank}>#{index + 1}</Text>
                          <Text style={styles.topProductName}>{product.name}</Text>
                          <Text style={styles.topProductQuantity}>{product.quantity} unités</Text>
                        </View>
                        <View style={styles.topProductBarContainer}>
                          <View style={[styles.topProductBar, { width: `${percentage}%` }]} />
                        </View>
                        <Text style={styles.topProductRevenue}>
                          {formatNumber(product.revenue)} FCFA
                        </Text>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Ventes par catégorie */}
              {filteredStats.categorySalesData && filteredStats.categorySalesData.length > 0 && (
                <View style={styles.chartCard}>
                  <Text style={styles.chartTitle}>Ventes par catégorie</Text>
                  {filteredStats.categorySalesData.map((category, index) => {
                    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
                    const color = colors[index % colors.length];
                    const totalRevenue = filteredStats.categorySalesData.reduce((sum, c) => sum + c.value, 0);
                    const percentage = totalRevenue > 0 ? ((category.value / totalRevenue) * 100).toFixed(1) : 0;
                    
                    return (
                      <View key={index} style={styles.categoryItem}>
                        <View style={styles.categoryHeader}>
                          <View style={[styles.categoryDot, { backgroundColor: color }]} />
                          <Text style={styles.categoryName}>{category.name}</Text>
                        </View>
                        <View style={styles.categoryStats}>
                          <Text style={styles.categoryPercentage}>{percentage}%</Text>
                          <Text style={styles.categoryRevenue}>
                            {formatNumber(category.value)} FCFA
                          </Text>
                          <Text style={styles.categoryQuantity}>
                            {category.quantity} unités
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>

            {/* Timeline d'événements récents */}
            {filteredStats.recentEvents && filteredStats.recentEvents.length > 0 && (
              <View style={styles.timelineSection}>
                <Text style={styles.sectionTitle}>Événements récents</Text>
                {filteredStats.recentEvents.map((event, index) => (
                  <View key={index} style={styles.timelineItem}>
                    <View style={[
                      styles.timelineDot,
                      event.type === 'sale' && styles.timelineDotGreen,
                      event.type === 'loss' && styles.timelineDotRed,
                      event.type === 'invoice' && styles.timelineDotBlue,
                    ]} />
                    <View style={styles.timelineContent}>
                      <Text style={styles.timelineDescription}>{event.description}</Text>
                      <Text style={styles.timelineDate}>{formatDate(event.date)}</Text>
                    </View>
                    <Text style={[
                      styles.timelineAmount,
                      event.amount >= 0 ? styles.timelineAmountPositive : styles.timelineAmountNegative
                    ]}>
                      {event.amount >= 0 ? '+' : ''}{formatNumber(event.amount)} FCFA
                    </Text>
                    {/* Bouton d'impression pour les ventes */}
                    {event.type === 'sale' && event.saleData && Platform.OS === 'web' && (
                      <TouchableOpacity
                        style={styles.timelinePrintButton}
                        onPress={() => handlePrintReceipt(event.saleData)}
                      >
                        <Text style={styles.timelinePrintText}>🖨️</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
              </View>
            )}

            {/* Produits disponibles pour vente rapide */}
            {allProducts && allProducts.filter(p => p.quantity > 0).length > 0 && (
              <View style={styles.quickSaleSection}>
                <Text style={styles.sectionTitle}>Vente rapide</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  {allProducts
                    .filter(p => p.quantity > 0)
                    .slice(0, 10)
                    .map((product) => (
                      <TouchableOpacity
                        key={product.id}
                        style={styles.productQuickCard}
                        onPress={() => handleOpenSaleModal(product)}
                      >
                        <Text style={styles.productQuickName} numberOfLines={1}>
                          {product.name}
                        </Text>
                        <Text style={styles.productQuickPrice}>
                          {formatNumber(product.sellingPrice)} FCFA
                        </Text>
                        <Text style={styles.productQuickStock}>
                          Stock: {product.quantity}
                        </Text>
                        <View style={styles.productQuickAction}>
                          <Text style={styles.productQuickActionText}>Vendre</Text>
                        </View>
                      </TouchableOpacity>
                    ))}
                </ScrollView>
              </View>
            )}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📊</Text>
            <Text style={styles.emptyTitle}>Aucune donnée disponible</Text>
            <Text style={styles.emptyText}>
              Commencez à enregistrer des ventes pour voir vos statistiques et performances ici.
            </Text>
            {allProducts && allProducts.filter(p => p.quantity > 0).length > 0 && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => handleOpenSaleModal(allProducts.find(p => p.quantity > 0))}
              >
                <Text style={styles.emptyButtonText}>Enregistrer une première vente</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>

      {/* Modal de vente */}
      <SaleModal
        visible={saleModalVisible}
        onClose={() => {
          setSaleModalVisible(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleRecordSale}
        product={selectedProduct}
        loading={submitting}
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
    backgroundColor: theme.colors.secondary,
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
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
  },
  backButton: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: theme.borderRadius.md,
  },
  backButtonText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textInverse,
    fontWeight: theme.fonts.weights.medium,
  },
  headerTitle: {
    fontSize: theme.fonts.sizes['3xl'],
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textInverse,
  },
  filterContainer: {
    backgroundColor: theme.colors.surface,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterChip: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.background,
    marginRight: theme.spacing.sm,
  },
  filterChipActive: {
    backgroundColor: theme.colors.secondary,
  },
  filterChipText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textPrimary,
    fontWeight: theme.fonts.weights.medium,
  },
  filterChipTextActive: {
    color: theme.colors.textInverse,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  statCard: {
    width: isMobile ? '48%' : '31%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    borderWidth: 0,
    ...Platform.select({
      web: {
        boxShadow: theme.shadowsWeb.md,
      },
      default: theme.shadows.md,
    }),
  },
  statCardBlue: { 
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.secondary,
  },
  statCardGreen: { 
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.success,
  },
  statCardRed: { 
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.danger,
  },
  statCardPurple: { 
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.info,
  },
  statCardOrange: { 
    borderLeftWidth: 4,
    borderLeftColor: theme.colors.primary,
  },
  statCardTeal: { 
    borderLeftWidth: 4,
    borderLeftColor: '#14b8a6',
  },
  statIcon: {
    fontSize: theme.fonts.sizes['2xl'],
    marginBottom: theme.spacing.sm,
  },
  statLabel: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
    textTransform: 'uppercase',
    fontWeight: theme.fonts.weights.semibold,
  },
  statValue: {
    fontSize: theme.fonts.sizes['2xl'],
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  statValuePositive: {
    color: theme.colors.success,
  },
  statValueNegative: {
    color: theme.colors.danger,
  },
  statSubtext: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textSecondary,
  },
  sectionTitle: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  chartsSection: {
    padding: theme.spacing.lg,
  },
  chartCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    marginBottom: theme.spacing.lg,
    ...Platform.select({
      web: {
        boxShadow: theme.shadowsWeb.md,
      },
      default: theme.shadows.md,
    }),
  },
  chartTitle: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  chartPlaceholder: {
    textAlign: 'center',
    color: theme.colors.textSecondary,
    fontSize: theme.fonts.sizes.sm,
    paddingVertical: 40,
  },
  timelineSection: {
    padding: theme.spacing.lg,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 12,
  },
  timelineDotGreen: {
    backgroundColor: '#10b981',
  },
  timelineDotRed: {
    backgroundColor: '#ef4444',
  },
  timelineDotBlue: {
    backgroundColor: '#3b82f6',
  },
  timelineContent: {
    flex: 1,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
    marginBottom: 2,
  },
  timelineDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  timelineAmount: {
    fontSize: 14,
    fontWeight: '700',
  },
  timelineAmountPositive: {
    color: '#10b981',
  },
  timelineAmountNegative: {
    color: '#ef4444',
  },
  timelinePrintButton: {
    marginLeft: 12,
    padding: 8,
    backgroundColor: '#eff6ff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#3b82f6',
  },
  timelinePrintText: {
    fontSize: 16,
  },
  quickSaleSection: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  productQuickCard: {
    width: 140,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: theme.spacing.md,
    marginRight: theme.spacing.md,
  },
  productQuickName: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 6,
  },
  productQuickPrice: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.success,
    marginBottom: 4,
  },
  productQuickStock: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.sm,
  },
  productQuickAction: {
    backgroundColor: theme.colors.success,
    paddingVertical: 6,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  productQuickActionText: {
    color: theme.colors.textInverse,
    fontSize: theme.fonts.sizes.xs,
    fontWeight: theme.fonts.weights.semibold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing['3xl'],
    minHeight: 400,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: theme.spacing.lg,
  },
  emptyTitle: {
    fontSize: theme.fonts.sizes['2xl'],
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    lineHeight: 20,
  },
  emptyButton: {
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  emptyButtonText: {
    color: theme.colors.textInverse,
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.semibold,
  },
  // Styles pour les barres mensuelles
  monthlyBarsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 200,
    paddingTop: 20,
  },
  monthlyBarWrapper: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  monthlyBarContainer: {
    height: 150,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  monthlyBar: {
    width: '80%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
    minHeight: 10,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 4,
  },
  monthlyBarLabel: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
  monthlyBarMonth: {
    fontSize: 11,
    color: '#6b7280',
    marginTop: 8,
    textAlign: 'center',
  },
  // Styles pour top produits
  topProductItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  topProductHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  topProductRank: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b82f6',
    width: 30,
  },
  topProductName: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  topProductQuantity: {
    fontSize: 13,
    color: '#6b7280',
  },
  topProductBarContainer: {
    height: 8,
    backgroundColor: '#f3f4f6',
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  topProductBar: {
    height: '100%',
    backgroundColor: '#10b981',
    borderRadius: 4,
  },
  topProductRevenue: {
    fontSize: 13,
    color: '#10b981',
    fontWeight: '600',
    textAlign: 'right',
  },
  // Styles pour catégories
  categoryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  categoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  categoryPercentage: {
    fontSize: 14,
    fontWeight: '700',
    color: '#3b82f6',
    minWidth: 40,
    textAlign: 'right',
  },
  categoryRevenue: {
    fontSize: 13,
    color: '#6b7280',
    minWidth: 80,
    textAlign: 'right',
  },
  categoryQuantity: {
    fontSize: 12,
    color: '#9ca3af',
  },
});

export default SalesScreen;
