import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../styles/theme';

/**
 * Produits Les Plus Populaires - Basé sur les vraies ventes
 */
export const TopProducts = ({ products = [] }) => {
  // Si pas de données, afficher un message
  if (!products || products.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Produits Les Plus Populaires</Text>
        <View style={styles.emptyState}>
          <Ionicons name="cube-outline" size={48} color={theme.colors.textSecondary} />
          <Text style={styles.emptyText}>Aucune vente enregistrée</Text>
          <Text style={styles.emptySubtext}>
            Les produits les plus vendus apparaîtront ici
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Produits Les Plus Populaires</Text>
        <Text style={styles.subtitle}>Top {products.length} des meilleures ventes</Text>
      </View>

      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.productsContainer}
      >
        {products.map((product, index) => (
          <View key={index} style={styles.productCard}>
            {/* Badge de position */}
            <View style={[
              styles.rankBadge,
              index === 0 && styles.rankBadgeGold,
              index === 1 && styles.rankBadgeSilver,
              index === 2 && styles.rankBadgeBronze,
            ]}>
              <Text style={styles.rankText}>#{index + 1}</Text>
            </View>

            {/* Image du produit */}
            <View style={styles.productImageContainer}>
              {product.image ? (
                <Image 
                  source={{ uri: product.image }} 
                  style={styles.productImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.productImagePlaceholder}>
                  <Ionicons name="cube" size={40} color={theme.colors.textSecondary} />
                </View>
              )}
            </View>

            {/* Nom du produit */}
            <Text style={styles.productName} numberOfLines={2}>
              {product.name}
            </Text>

            {/* Catégorie */}
            {product.category && (
              <View style={styles.categoryBadge}>
                <Text style={styles.categoryText}>{product.category}</Text>
              </View>
            )}

            {/* Statistiques */}
            <View style={styles.statsContainer}>
              {/* Quantité vendue */}
              <View style={styles.statItem}>
                <Ionicons name="cart" size={16} color={theme.colors.primary} />
                <Text style={styles.statLabel}>Vendus</Text>
                <Text style={styles.statValue}>{product.totalSold}</Text>
              </View>

              {/* Revenus */}
              <View style={styles.statItem}>
                <Ionicons name="cash" size={16} color={theme.colors.success} />
                <Text style={styles.statLabel}>Revenus</Text>
                <Text style={styles.statValue}>{product.revenue.toLocaleString()} FCFA</Text>
              </View>
            </View>

            {/* Prix unitaire */}
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Prix unitaire</Text>
              <Text style={styles.price}>{product.price.toLocaleString()} FCFA</Text>
            </View>

            {/* Stock restant */}
            <View style={styles.stockContainer}>
              <View style={styles.stockBar}>
                <View 
                  style={[
                    styles.stockBarFill,
                    { 
                      width: `${Math.min((product.stock / (product.stock + product.totalSold)) * 100, 100)}%`,
                      backgroundColor: product.stock > 10 ? theme.colors.success : 
                                      product.stock > 5 ? theme.colors.warning : 
                                      theme.colors.danger
                    }
                  ]}
                />
              </View>
              <Text style={styles.stockText}>
                Stock: {product.stock} unités
              </Text>
            </View>

            {/* Taux de popularité */}
            <View style={styles.popularityContainer}>
              <Text style={styles.popularityLabel}>Popularité</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Ionicons 
                    key={star}
                    name={star <= product.popularity ? "star" : "star-outline"}
                    size={16}
                    color="#FFC107"
                  />
                ))}
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
  },

  productsContainer: {
    paddingRight: 20,
    gap: 16,
  },

  productCard: {
    width: 280,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    position: 'relative',
  },

  rankBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: theme.colors.textSecondary,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },

  rankBadgeGold: {
    backgroundColor: '#FFD700',
  },

  rankBadgeSilver: {
    backgroundColor: '#C0C0C0',
  },

  rankBadgeBronze: {
    backgroundColor: '#CD7F32',
  },

  rankText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  productImageContainer: {
    width: '100%',
    height: 160,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 12,
    backgroundColor: theme.colors.surface,
  },

  productImage: {
    width: '100%',
    height: '100%',
  },

  productImagePlaceholder: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },

  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
    minHeight: 40,
  },

  categoryBadge: {
    backgroundColor: theme.colors.primary + '20',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },

  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginTop: 4,
    marginBottom: 2,
  },

  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },

  priceContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },

  priceLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },

  price: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.primary,
  },

  stockContainer: {
    marginBottom: 12,
  },

  stockBar: {
    height: 6,
    backgroundColor: theme.colors.border,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },

  stockBarFill: {
    height: '100%',
    borderRadius: 3,
  },

  stockText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },

  popularityContainer: {
    alignItems: 'center',
  },

  popularityLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 6,
  },

  starsContainer: {
    flexDirection: 'row',
    gap: 4,
  },

  // Empty state
  emptyState: {
    paddingVertical: 60,
    alignItems: 'center',
  },

  emptyText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },

  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default TopProducts;


