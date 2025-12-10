import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../styles/theme';

/**
 * Carte de Produit Moderne
 * Design élégant avec dégradés et badges
 */
const ModernProductCard = ({ product, onPress, onEdit, onDelete }) => {
  const getStatusConfig = (status) => {
    switch (status) {
      case 'disponible':
        return {
          label: 'En Stock',
          colors: theme.gradients.success,
          textColor: theme.colors.success,
          bgColor: '#D1FAE5',
        };
      case 'faible':
        return {
          label: 'Stock Faible',
          colors: theme.gradients.warning,
          textColor: theme.colors.warning,
          bgColor: '#FEF3C7',
        };
      case 'rupture':
        return {
          label: 'Rupture',
          colors: theme.gradients.danger,
          textColor: theme.colors.danger,
          bgColor: '#FEE2E2',
        };
      default:
        return {
          label: 'Inconnu',
          colors: theme.gradients.secondary,
          textColor: theme.colors.textSecondary,
          bgColor: theme.colors.backgroundDark,
        };
    }
  };

  const statusConfig = getStatusConfig(product.status);
  const formatPrice = (price) => price.toLocaleString('fr-FR');
  const margin = product.purchasePrice 
    ? ((product.sellingPrice - product.purchasePrice) / product.sellingPrice * 100).toFixed(0)
    : 0;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.card}>
        {/* Badge de Statut */}
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bgColor }]}>
          <View style={styles.statusDot}>
            <LinearGradient
              colors={statusConfig.colors}
              style={styles.statusDotGradient}
            />
          </View>
          <Text style={[styles.statusText, { color: statusConfig.textColor }]}>
            {statusConfig.label}
          </Text>
        </View>

        {/* En-tête */}
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <LinearGradient
              colors={theme.gradients.primary}
              style={styles.iconGradient}
            >
              <Text style={styles.icon}>📦</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.headerInfo}>
            <Text style={styles.productName} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={styles.category}>{product.category}</Text>
          </View>
        </View>

        {/* Informations Principales */}
        <View style={styles.mainInfo}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Prix de vente</Text>
            <Text style={styles.price}>{formatPrice(product.sellingPrice)} FCFA</Text>
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statLabel}>Stock</Text>
              <Text style={[
                styles.statValue,
                { color: statusConfig.textColor }
              ]}>
                {product.quantity}
              </Text>
            </View>
            
            {product.purchasePrice > 0 && (
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Marge</Text>
                <Text style={[styles.statValue, { color: theme.colors.success }]}>
                  {margin}%
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Description (si existe) */}
        {product.description && (
          <View style={styles.descriptionContainer}>
            <Text style={styles.description} numberOfLines={2}>
              {product.description}
            </Text>
          </View>
        )}

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={(e) => {
              e.stopPropagation();
              onEdit?.(product);
            }}
          >
            <Text style={styles.actionButtonText}>✏️ Modifier</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={(e) => {
              e.stopPropagation();
              onDelete?.(product);
            }}
          >
            <Text style={styles.actionButtonText}>🗑️ Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.lg,
    ...Platform.select({
      web: {
        boxShadow: theme.shadowsWeb.md,
      },
      default: theme.shadows.md,
    }),
  },
  statusBadge: {
    position: 'absolute',
    top: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    borderRadius: theme.borderRadius.full,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
    overflow: 'hidden',
  },
  statusDotGradient: {
    width: '100%',
    height: '100%',
  },
  statusText: {
    fontSize: theme.fonts.sizes.xs,
    fontWeight: theme.fonts.weights.semibold,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    marginRight: theme.spacing.md,
  },
  iconGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 28,
  },
  headerInfo: {
    flex: 1,
  },
  productName: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  category: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weights.medium,
  },
  mainInfo: {
    marginBottom: theme.spacing.md,
  },
  priceContainer: {
    marginBottom: theme.spacing.sm,
  },
  priceLabel: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  price: {
    fontSize: theme.fonts.sizes['2xl'],
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
  statsRow: {
    flexDirection: 'row',
    gap: theme.spacing.xl,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textSecondary,
    marginBottom: 4,
    textTransform: 'uppercase',
    fontWeight: theme.fonts.weights.semibold,
  },
  statValue: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.bold,
  },
  descriptionContainer: {
    marginBottom: theme.spacing.md,
    paddingTop: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  description: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginTop: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  editButton: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.secondary,
  },
  deleteButton: {
    backgroundColor: theme.colors.background,
    borderColor: theme.colors.danger,
  },
  actionButtonText: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.semibold,
  },
});

export default ModernProductCard;

