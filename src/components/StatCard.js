import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import theme from '../styles/theme';

/**
 * Carte de Statistique Moderne
 * Design inspiré de Dribbble avec dégradés et icônes
 */
const StatCard = ({ 
  icon, 
  label, 
  value, 
  subtitle, 
  gradient = theme.gradients.primary,
  trend,
  trendUp = true,
}) => {
  return (
    <View style={styles.container}>
      <LinearGradient
        colors={gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {/* Icône */}
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{icon}</Text>
        </View>
        
        {/* Contenu */}
        <View style={styles.content}>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.value}>{value}</Text>
          
          {/* Sous-titre ou Tendance */}
          {subtitle && (
            <Text style={styles.subtitle}>{subtitle}</Text>
          )}
          
          {trend && (
            <View style={styles.trendContainer}>
              <Text style={styles.trendIcon}>
                {trendUp ? '↑' : '↓'}
              </Text>
              <Text style={styles.trendText}>{trend}</Text>
            </View>
          )}
        </View>
        
        {/* Décoration circulaire */}
        <View style={styles.decorCircle} />
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '48%',
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: theme.shadowsWeb.lg,
      },
      default: theme.shadows.lg,
    }),
  },
  gradient: {
    padding: theme.spacing.lg,
    minHeight: 140,
    position: 'relative',
    overflow: 'hidden',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  icon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
  },
  label: {
    fontSize: theme.fonts.sizes.sm,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: theme.fonts.weights.medium,
    marginBottom: 4,
  },
  value: {
    fontSize: theme.fonts.sizes['3xl'],
    color: theme.colors.textInverse,
    fontWeight: theme.fonts.weights.bold,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: theme.fonts.sizes.xs,
    color: 'rgba(255, 255, 255, 0.8)',
    fontWeight: theme.fonts.weights.regular,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trendIcon: {
    fontSize: 16,
    color: theme.colors.textInverse,
    marginRight: 4,
  },
  trendText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textInverse,
    fontWeight: theme.fonts.weights.semibold,
  },
  decorCircle: {
    position: 'absolute',
    right: -30,
    bottom: -30,
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
});

export default StatCard;

