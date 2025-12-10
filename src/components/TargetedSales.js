import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../styles/theme';

/**
 * Ventes Ciblées avec barres de progression - Style ArchitectUI
 */
export const TargetedSales = ({ sales = [] }) => {
  // Données par défaut
  const defaultSales = sales.length > 0 ? sales : [
    { label: 'Ventes', percentage: 65, color: '#00BCD4' },
    { label: 'Profils', percentage: 22, color: '#FFA726' },
    { label: 'Relais', percentage: 83, color: '#4CAF50' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>VENTES CIBLÉES</Text>
      <View style={styles.salesContainer}>
        {defaultSales.map((sale, index) => (
          <View key={index} style={styles.saleItem}>
            <Text style={styles.percentage}>{sale.percentage}%</Text>
            <View style={styles.progressBarContainer}>
              <View 
                style={[
                  styles.progressBar, 
                  { 
                    width: `${sale.percentage}%`,
                    backgroundColor: sale.color,
                  }
                ]} 
              />
            </View>
            <Text style={styles.label}>{sale.label}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 20,
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  title: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 20,
  },

  salesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 40,
  },

  saleItem: {
    flex: 1,
    alignItems: 'center',
  },

  percentage: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },

  progressBarContainer: {
    width: '100%',
    height: 6,
    backgroundColor: theme.colors.background,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 8,
  },

  progressBar: {
    height: '100%',
    borderRadius: 3,
  },

  label: {
    fontSize: 13,
    fontWeight: '500',
    color: theme.colors.textSecondary,
  },
});

export default TargetedSales;


