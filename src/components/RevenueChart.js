import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { Ionicons } from '@expo/vector-icons';
import theme from '../styles/theme';

const { width } = Dimensions.get('window');

// Fonction utilitaire pour formater les montants
const formatAmount = (amount) => {
  return new Intl.NumberFormat('fr-FR', { 
    maximumFractionDigits: 0 
  }).format(amount) + ' F';
};

// Fonction pour calculer les statistiques
const calculateStats = (data) => {
  if (!data || !data.datasets || data.datasets.length === 0 || !data.datasets[0].data) {
    return {
      total: 0,
      average: 0,
      max: 0
    };
  }

  const amounts = data.datasets[0].data;
  const total = amounts.reduce((sum, val) => sum + val, 0);
  const average = amounts.length > 0 ? total / amounts.length : 0;
  const max = Math.max(...amounts, 0);

  return { total, average, max };
};

/**
 * Graphique de rapport de revenus - Style ArchitectUI
 */
export const RevenueChart = ({ 
  data, 
  dailyData,
  title = "RAPPORT DE REVENUS" 
}) => {
  const [viewMode, setViewMode] = useState('daily');
  const [chartWidth, setChartWidth] = useState(width - 80);
  
  // Mise à jour de la largeur du graphique en fonction des données
  useEffect(() => {
    const currentData = viewMode === 'daily' ? dailyData : data;
    if (currentData?.labels?.length > 0) {
      const minWidth = width - 80;
      const calculatedWidth = Math.max(minWidth, currentData.labels.length * 50);
      setChartWidth(calculatedWidth);
    }
  }, [viewMode, data, dailyData]);
  
  const currentData = viewMode === 'daily' ? dailyData : data;
  const stats = calculateStats(currentData);
  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`, // Rouge
    labelColor: (opacity = 1) => `rgba(100, 116, 139, ${opacity})`,
    style: {
      borderRadius: 12,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.colors.surface,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.colors.border,
      strokeWidth: 1,
    },
  };

  // Si pas de données, afficher un état vide - PAS de données fictives
  const hasData = currentData?.labels?.length > 0;
  
  if (!hasData) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.toggleContainer}>
            <View style={styles.toggleBackground}>
              <TouchableOpacity 
                style={[
                  styles.toggleButton, 
                  viewMode === 'daily' && styles.toggleButtonActive
                ]}
                onPress={() => setViewMode('daily')}
              >
                <Text style={[
                  styles.toggleText,
                  viewMode === 'daily' && styles.toggleTextActive
                ]}>
                  JOUR
                </Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.toggleButton, 
                  viewMode === 'monthly' && styles.toggleButtonActive
                ]}
                onPress={() => setViewMode('monthly')}
              >
                <Text style={[
                  styles.toggleText,
                  viewMode === 'monthly' && styles.toggleTextActive
                ]}>
                  MOIS
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={styles.emptyState}>
          <Ionicons name="bar-chart-outline" size={48} color={theme.colors.textSecondary} />
          <Text style={styles.emptyText}>
            Aucune donnée de revenus {viewMode === 'daily' ? 'journalière' : 'mensuelle'}
          </Text>
          <Text style={styles.emptySubtext}>
            {viewMode === 'daily' 
              ? 'Les données journalières apparaîtront après enregistrement des ventes' 
              : 'Les données mensuelles apparaîtront après enregistrement des ventes'}
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.toggleContainer}>
          <View style={styles.toggleBackground}>
            <TouchableOpacity 
              style={[
                styles.toggleButton, 
                viewMode === 'daily' && styles.toggleButtonActive
              ]}
              onPress={() => setViewMode('daily')}
            >
              <Text style={[
                styles.toggleText,
                viewMode === 'daily' && styles.toggleTextActive
              ]}>
                JOUR
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.toggleButton, 
                viewMode === 'monthly' && styles.toggleButtonActive
              ]}
              onPress={() => setViewMode('monthly')}
            >
              <Text style={[
                styles.toggleText,
                viewMode === 'monthly' && styles.toggleTextActive
              ]}>
                MOIS
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Statistiques */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Total</Text>
          <Text style={styles.statValue}>{formatAmount(stats.total)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Moyenne</Text>
          <Text style={styles.statValue}>{formatAmount(stats.average)}</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statLabel}>Max</Text>
          <Text style={styles.statValue}>{formatAmount(stats.max)}</Text>
        </View>
      </View>
      
      {/* Graphique avec défilement horizontal */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={true}
        contentContainerStyle={styles.scrollContainer}
      >
        <View style={styles.chartContainer}>
          <LineChart
            data={currentData}
            width={chartWidth}
            height={220}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={false}
            withVerticalLines={false}
            withHorizontalLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            segments={4}
            fromZero
          />
        </View>
      </ScrollView>
      
      {/* Indicateur de défilement si nécessaire */}
      {chartWidth > (width - 80) && (
        <Text style={styles.scrollHint}>
          <Ionicons name="arrow-forward" size={14} color={theme.colors.textSecondary} />
          {' '}Faites défiler pour voir plus de données
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  toggleBackground: {
    flexDirection: 'row',
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
    padding: 2,
  },
  
  toggleButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  
  toggleButtonActive: {
    backgroundColor: '#F43F5E',
  },
  
  toggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
  },
  
  toggleTextActive: {
    color: '#FFFFFF',
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 12,
  },

  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },

  title: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
    marginBottom: 16,
  },

  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
    backgroundColor: theme.colors.background,
    borderRadius: 8,
    padding: 12,
  },
  
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  
  statLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  
  scrollContainer: {
    paddingBottom: 8,
  },
  
  chartContainer: {
    alignItems: 'center',
  },

  chart: {
    borderRadius: 12,
  },
  
  scrollHint: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic',
  },
});

export default RevenueChart;


