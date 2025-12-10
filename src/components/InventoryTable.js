import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import theme from '../styles/theme';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

/**
 * Tableau d'inventaire avancé avec gestion des emplacements
 */
const InventoryTable = ({ 
  products, 
  categories,
  onEdit, 
  onDelete,
  onAddLocation 
}) => {
  const [selectedTab, setSelectedTab] = useState('Tout');
  const [expandedProducts, setExpandedProducts] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  /**
   * Filtrer les produits par catégorie
   */
  const filteredProducts = selectedTab === 'Tout'
    ? products
    : products.filter(p => p.category === selectedTab);

  /**
   * Calculer les statistiques d'un produit
   */
  const calculateProductStats = (product) => {
    const quantity = product.quantity || 0;
    const reserved = product.reserved || 0;
    const incoming = product.incoming || 0;
    const available = quantity - reserved;
    const missing = (product.minimumStock || 0) > quantity 
      ? (product.minimumStock || 0) - quantity 
      : 0;

    return { quantity, available, reserved, incoming, missing };
  };

  /**
   * Toggle l'expansion d'un produit
   */
  const toggleExpand = (productId) => {
    setExpandedProducts(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  /**
   * Réinitialiser les filtres
   */
  const resetFilters = () => {
    setSelectedTab('Tout');
    setExpandedProducts({});
  };

  return (
    <View style={styles.container}>
      {/* Onglets de catégories */}
      <View style={styles.tabsContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.tabsScroll}
        >
          <TouchableOpacity
            style={[
              styles.tab,
              selectedTab === 'Tout' && styles.tabActive
            ]}
            onPress={() => setSelectedTab('Tout')}
          >
            <Text style={[
              styles.tabText,
              selectedTab === 'Tout' && styles.tabTextActive
            ]}>
              Tout
            </Text>
          </TouchableOpacity>

          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[
                styles.tab,
                selectedTab === category && styles.tabActive
              ]}
              onPress={() => setSelectedTab(category)}
            >
              <Text style={[
                styles.tabText,
                selectedTab === category && styles.tabTextActive
              ]}>
                {category}
              </Text>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.tabNew}>
            <Text style={styles.tabNewText}>⊕ Nouvel onglet</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Boutons de contrôle */}
      <View style={styles.controlsContainer}>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.controlButtonText}>
            Afficher/Masquer les filtres
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.controlButton, styles.resetButton]}
          onPress={resetFilters}
        >
          <Text style={styles.controlButtonText}>Réinitialiser</Text>
        </TouchableOpacity>
      </View>

      {/* Tableau */}
      <ScrollView horizontal showsHorizontalScrollIndicator={true}>
        <View style={styles.tableContainer}>
          {/* En-tête du tableau */}
          <View style={styles.tableHeader}>
            <View style={[styles.headerCell, styles.expandColumn]}>
              <Text style={styles.headerText}></Text>
            </View>
            <View style={[styles.headerCell, styles.productColumn]}>
              <Text style={styles.headerText}>Produit</Text>
            </View>
            <View style={[styles.headerCell, styles.skuColumn]}>
              <Text style={styles.headerText}>SKU</Text>
            </View>
            <View style={[styles.headerCell, styles.numColumn]}>
              <Text style={styles.headerText}>Quantité</Text>
            </View>
            <View style={[styles.headerCell, styles.numColumn]}>
              <Text style={styles.headerText}>Disponible</Text>
            </View>
            <View style={[styles.headerCell, styles.numColumn]}>
              <Text style={styles.headerText}>Réservé</Text>
            </View>
            <View style={[styles.headerCell, styles.numColumn]}>
              <Text style={styles.headerText}>A venir</Text>
            </View>
            <View style={[styles.headerCell, styles.numColumn]}>
              <Text style={styles.headerText}>Manquant</Text>
            </View>
            <View style={[styles.headerCell, styles.actionsColumn]}>
              <Text style={styles.headerText}>Actions</Text>
            </View>
          </View>

          {/* Lignes du tableau */}
          <ScrollView style={styles.tableBody}>
            {filteredProducts.map((product) => {
              const stats = calculateProductStats(product);
              const isExpanded = expandedProducts[product.id];
              const hasNegative = stats.available < 0;

              return (
                <View key={product.id}>
                  {/* Ligne principale */}
                  <View style={[
                    styles.tableRow,
                    hasNegative && styles.tableRowNegative
                  ]}>
                    <TouchableOpacity
                      style={[styles.cell, styles.expandColumn]}
                      onPress={() => toggleExpand(product.id)}
                    >
                      <View style={styles.expandButton}>
                        <Text style={styles.expandButtonText}>
                          {isExpanded ? '×' : '+'}
                        </Text>
                      </View>
                    </TouchableOpacity>

                    <View style={[styles.cell, styles.productColumn]}>
                      <Text style={styles.productName}>{product.name}</Text>
                      {product.description && (
                        <Text style={styles.productDesc} numberOfLines={1}>
                          {product.description}
                        </Text>
                      )}
                    </View>

                    <View style={[styles.cell, styles.skuColumn]}>
                      <Text style={styles.cellText}>{product.sku || '-'}</Text>
                    </View>

                    <View style={[styles.cell, styles.numColumn]}>
                      <Text style={[styles.cellText, styles.numText]}>
                        {stats.quantity}
                      </Text>
                    </View>

                    <View style={[styles.cell, styles.numColumn]}>
                      <Text style={[
                        styles.cellText, 
                        styles.numText,
                        hasNegative && styles.negativeText
                      ]}>
                        {stats.available}
                      </Text>
                    </View>

                    <View style={[styles.cell, styles.numColumn]}>
                      <Text style={[styles.cellText, styles.numText]}>
                        {stats.reserved}
                      </Text>
                    </View>

                    <View style={[styles.cell, styles.numColumn]}>
                      <Text style={[styles.cellText, styles.numText]}>
                        {stats.incoming}
                      </Text>
                    </View>

                    <View style={[styles.cell, styles.numColumn]}>
                      <Text style={[
                        styles.cellText, 
                        styles.numText,
                        stats.missing > 0 && styles.warningText
                      ]}>
                        {stats.missing}
                      </Text>
                    </View>

                    <View style={[styles.cell, styles.actionsColumn]}>
                      <View style={styles.actionsButtons}>
                        <TouchableOpacity
                          style={styles.actionButton}
                          onPress={() => onEdit(product)}
                        >
                          <Text style={styles.actionButtonText}>✏️</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={[styles.actionButton, styles.deleteButton]}
                          onPress={() => onDelete(product)}
                        >
                          <Text style={styles.actionButtonText}>🗑️</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  {/* Section des emplacements (si développé) */}
                  {isExpanded && (
                    <View style={styles.locationsContainer}>
                      <View style={styles.locationsHeader}>
                        <View style={[styles.locationHeaderCell, styles.locationNameColumn]}>
                          <Text style={styles.locationHeaderText}>Lieu de stockage</Text>
                        </View>
                        <View style={[styles.locationHeaderCell, styles.locationNumColumn]}>
                          <Text style={styles.locationHeaderText}>Quantité</Text>
                        </View>
                        <View style={[styles.locationHeaderCell, styles.locationNumColumn]}>
                          <Text style={styles.locationHeaderText}>Disponible</Text>
                        </View>
                        <View style={[styles.locationHeaderCell, styles.locationNumColumn]}>
                          <Text style={styles.locationHeaderText}>Réservé</Text>
                        </View>
                        <View style={[styles.locationHeaderCell, styles.locationNumColumn]}>
                          <Text style={styles.locationHeaderText}>A venir</Text>
                        </View>
                        <View style={[styles.locationHeaderCell, styles.locationEmplColumn]}>
                          <Text style={styles.locationHeaderText}>Emplacement</Text>
                        </View>
                        <View style={[styles.locationHeaderCell, styles.locationNumColumn]}>
                          <Text style={styles.locationHeaderText}>Manquant</Text>
                        </View>
                      </View>

                      {/* Lignes d'emplacements */}
                      {product.locations && product.locations.length > 0 ? (
                        product.locations.map((location, index) => (
                          <View key={index} style={styles.locationRow}>
                            <View style={[styles.locationCell, styles.locationNameColumn]}>
                              <Text style={styles.locationText}>{location.name}</Text>
                            </View>
                            <View style={[styles.locationCell, styles.locationNumColumn]}>
                              <Text style={styles.locationNumText}>{location.quantity || 0}</Text>
                            </View>
                            <View style={[styles.locationCell, styles.locationNumColumn]}>
                              <Text style={styles.locationNumText}>
                                {(location.quantity || 0) - (location.reserved || 0)}
                              </Text>
                            </View>
                            <View style={[styles.locationCell, styles.locationNumColumn]}>
                              <Text style={styles.locationNumText}>{location.reserved || 0}</Text>
                            </View>
                            <View style={[styles.locationCell, styles.locationNumColumn]}>
                              <Text style={styles.locationNumText}>{location.incoming || 0}</Text>
                            </View>
                            <View style={[styles.locationCell, styles.locationEmplColumn]}>
                              <Text style={styles.locationText}>{location.placement || '-'}</Text>
                            </View>
                            <View style={[styles.locationCell, styles.locationNumColumn]}>
                              <Text style={styles.locationNumText}>
                                {location.missing || 0}
                              </Text>
                            </View>
                          </View>
                        ))
                      ) : (
                        <View style={styles.locationRow}>
                          <View style={[styles.locationCell, { flex: 1 }]}>
                            <Text style={styles.emptyLocationText}>
                              Aucun emplacement défini
                            </Text>
                          </View>
                        </View>
                      )}

                      {/* Bouton ajouter emplacement */}
                      <TouchableOpacity
                        style={styles.addLocationButton}
                        onPress={() => onAddLocation && onAddLocation(product)}
                      >
                        <Text style={styles.addLocationText}>
                          + Ajouter un emplacement
                        </Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })}

            {filteredProducts.length === 0 && (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>
                  Aucun produit dans cette catégorie
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  // Onglets
  tabsContainer: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  tabsScroll: {
    flexDirection: 'row',
  },
  tab: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: '#6B7280',
    backgroundColor: '#E5E7EB',
  },
  tabText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  tabTextActive: {
    color: theme.colors.textPrimary,
    fontWeight: '700',
  },
  tabNew: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#E5E7EB',
  },
  tabNewText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '500',
  },
  // Contrôles
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 12,
    backgroundColor: theme.colors.surface,
    gap: 12,
  },
  controlButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  resetButton: {
    backgroundColor: '#E5E7EB',
    opacity: 1,
  },
  controlButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '500',
  },
  // Tableau
  tableContainer: {
    minWidth: Platform.OS === 'web' ? 1200 : width,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  headerCell: {
    padding: 12,
    justifyContent: 'center',
  },
  headerText: {
    color: theme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    textAlign: 'center',
  },
  // Colonnes
  expandColumn: {
    width: 50,
  },
  productColumn: {
    width: 250,
  },
  skuColumn: {
    width: 150,
  },
  numColumn: {
    width: 100,
  },
  actionsColumn: {
    width: 120,
  },
  // Lignes
  tableBody: {
    backgroundColor: theme.colors.surface,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: '#FFFFFF',
  },
  tableRowNegative: {
    backgroundColor: '#FFF7ED',
  },
  cell: {
    padding: 12,
    justifyContent: 'center',
  },
  cellText: {
    fontSize: 13,
    color: theme.colors.textPrimary,
  },
  productName: {
    fontSize: 14,
    color: '#C2185B',
    fontWeight: '600',
    marginBottom: 2,
  },
  productDesc: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },
  numText: {
    textAlign: 'center',
    fontWeight: '600',
  },
  negativeText: {
    color: '#D32F2F',
    fontWeight: '700',
  },
  warningText: {
    color: '#F57C00',
    fontWeight: '700',
  },
  // Bouton expand
  expandButton: {
    width: 32,
    height: 32,
    borderRadius: 4,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
  expandButtonText: {
    color: theme.colors.textPrimary,
    fontSize: 20,
    fontWeight: '700',
    lineHeight: 24,
  },
  // Actions
  actionsButtons: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'center',
  },
  actionButton: {
    width: 36,
    height: 36,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  deleteButton: {
    backgroundColor: '#D32F2F',
  },
  actionButtonText: {
    fontSize: 16,
  },
  // Emplacements
  locationsContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    marginLeft: 50,
  },
  locationsHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  locationHeaderCell: {
    padding: 10,
    justifyContent: 'center',
  },
  locationHeaderText: {
    color: theme.colors.textPrimary,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  locationNameColumn: {
    width: 200,
  },
  locationNumColumn: {
    width: 100,
  },
  locationEmplColumn: {
    width: 120,
  },
  locationRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  locationCell: {
    padding: 10,
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 12,
    color: theme.colors.textPrimary,
  },
  locationNumText: {
    fontSize: 12,
    color: theme.colors.textPrimary,
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyLocationText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
    padding: 12,
  },
  addLocationButton: {
    marginTop: 8,
    padding: 10,
    backgroundColor: theme.colors.primary,
    borderRadius: 4,
    alignItems: 'center',
  },
  addLocationText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  // Empty state
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
});

export default InventoryTable;

