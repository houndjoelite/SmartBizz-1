import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

/**
 * Carte de Statistique - Style ArchitectUI
 * Composant réutilisable pour afficher des statistiques avec icône colorée
 */
export const ArchitectUIStatCard = ({ 
  title, 
  value, 
  icon, 
  iconColor, 
  percentage, 
  subtitle 
}) => {
  const isPositive = percentage >= 0;
  
  return (
    <View style={styles.card}>
      {/* Icône avec background coloré */}
      <View style={[
        styles.iconContainer, 
        { backgroundColor: iconColor + '20' } // Opacité 12.5%
      ]}>
        <Ionicons name={icon} size={28} color={iconColor} />
      </View>

      {/* Contenu */}
      <View style={styles.content}>
        {/* Label/Titre */}
        <Text style={styles.label}>{title}</Text>

        {/* Valeur principale */}
        <Text style={styles.value}>{value}</Text>

        {/* Pourcentage ou sous-titre */}
        {percentage !== undefined ? (
          <View style={styles.percentageContainer}>
            <Ionicons 
              name={isPositive ? 'trending-up' : 'trending-down'} 
              size={14} 
              color={isPositive ? theme.colors.success : theme.colors.danger} 
            />
            <Text style={[
              styles.percentage,
              { color: isPositive ? theme.colors.success : theme.colors.danger }
            ]}>
              {Math.abs(percentage).toFixed(2)}%
            </Text>
            <Text style={styles.percentageLabel}>
              {isPositive ? 'de croissance' : 'moins de revenus'}
            </Text>
          </View>
        ) : subtitle ? (
          <Text style={styles.subtitle}>{subtitle}</Text>
        ) : null}
      </View>
    </View>
  );
};

/**
 * Carte Simple - Style ArchitectUI
 * Container de base pour contenu
 */
export const ArchitectUICard = ({ children, style }) => {
  return (
    <View style={[styles.simpleCard, style]}>
      {children}
    </View>
  );
};

/**
 * Header de Section - Style ArchitectUI
 */
export const ArchitectUISectionHeader = ({ title, subtitle, action }) => {
  return (
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderText}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle && <Text style={styles.sectionSubtitle}>{subtitle}</Text>}
      </View>
      {action && action}
    </View>
  );
};

/**
 * Badge - Style ArchitectUI
 */
export const ArchitectUIBadge = ({ text, color = 'primary', small = false }) => {
  const badgeColors = {
    primary: { bg: theme.colors.primary, text: theme.colors.textInverse },
    success: { bg: theme.colors.success, text: theme.colors.textInverse },
    danger: { bg: theme.colors.danger, text: theme.colors.textInverse },
    warning: { bg: theme.colors.warning, text: theme.colors.textInverse },
    secondary: { bg: theme.colors.backgroundDark, text: theme.colors.textPrimary },
  };

  const colors = badgeColors[color] || badgeColors.primary;

  return (
    <View style={[
      styles.badge,
      { backgroundColor: colors.bg },
      small && styles.badgeSmall
    ]}>
      <Text style={[
        styles.badgeText,
        { color: colors.text },
        small && styles.badgeTextSmall
      ]}>
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  // Carte de Statistique
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(91, 95, 237, 0.08)',
      },
      default: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      },
    }),
  },

  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  content: {
    flex: 1,
  },

  label: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
    fontWeight: theme.fonts.weights.medium,
  },

  value: {
    fontSize: theme.fonts.sizes['3xl'],
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },

  percentageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },

  percentage: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.semibold,
    marginLeft: 4,
  },

  percentageLabel: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textTertiary,
    marginLeft: 4,
  },

  subtitle: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
  },

  // Carte Simple
  simpleCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    ...Platform.select({
      web: {
        boxShadow: '0 2px 8px rgba(91, 95, 237, 0.08)',
      },
      default: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 2,
      },
    }),
  },

  // Header de Section
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },

  sectionHeaderText: {
    flex: 1,
  },

  sectionTitle: {
    fontSize: theme.fonts.sizes['2xl'],
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },

  sectionSubtitle: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textSecondary,
  },

  // Badge
  badge: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    alignSelf: 'flex-start',
  },

  badgeSmall: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 2,
  },

  badgeText: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.semibold,
  },

  badgeTextSmall: {
    fontSize: theme.fonts.sizes.xs,
  },
});

export default ArchitectUIStatCard;


