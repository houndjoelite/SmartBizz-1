import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../styles/theme';

/**
 * Carte de performance - Style ArchitectUI
 * Utilisé pour afficher les métriques clés (Dépôts, Dividendes, Gains)
 */
export const PerformanceCard = ({ 
  icon, 
  iconBg, 
  iconColor,
  title, 
  value, 
  subtitle,
  subtitleColor,
  trend,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: iconBg }]}>
          <Ionicons name={icon} size={24} color={iconColor} />
        </View>
        
        <View style={styles.stats}>
          <Text style={styles.value}>{value}</Text>
          {subtitle && (
            <View style={styles.subtitleRow}>
              {trend && (
                <Ionicons 
                  name={trend === 'up' ? 'trending-up' : 'trending-down'} 
                  size={14} 
                  color={subtitleColor || theme.colors.textSecondary} 
                  style={styles.trendIcon}
                />
              )}
              <Text style={[styles.subtitle, { color: subtitleColor || theme.colors.textSecondary }]}>
                {subtitle}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: isMobile ? 16 : 20,
    marginBottom: isMobile ? 0 : 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    flex: 1,
    minWidth: isMobile ? '100%' : undefined,
  },

  header: {
    marginBottom: isMobile ? 12 : 16,
  },

  title: {
    fontSize: isMobile ? 11 : 13,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  iconContainer: {
    width: isMobile ? 48 : 56,
    height: isMobile ? 48 : 56,
    borderRadius: isMobile ? 24 : 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isMobile ? 12 : 16,
  },

  stats: {
    flex: 1,
  },

  value: {
    fontSize: isMobile ? 26 : 32,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },

  subtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  trendIcon: {
    marginRight: 4,
  },

  subtitle: {
    fontSize: isMobile ? 11 : 12,
    fontWeight: '500',
    flexShrink: 1,
  },
});

export default PerformanceCard;
