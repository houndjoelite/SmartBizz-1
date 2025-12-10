import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import theme from '../styles/theme';

const { width } = Dimensions.get('window');

/**
 * Graphique à barres pour l'inventaire
 */
const InventoryBarChart = ({ data, title, height = 200, color = theme.colors.primary }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.chartContainer, { height }]}>
          <Text style={styles.emptyText}>Aucune donnée disponible</Text>
        </View>
      </View>
    );
  }

  // Trouver la valeur maximale
  const maxValue = Math.max(...data.map(item => item.value));
  const yAxisSteps = 5;
  const stepValue = Math.ceil(maxValue / yAxisSteps);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chartWrapper}>
          {/* Axe Y avec labels */}
          <View style={styles.yAxis}>
            {Array.from({ length: yAxisSteps + 1 }).reverse().map((_, index) => (
              <View key={index} style={styles.yAxisLabel}>
                <Text style={styles.yAxisText}>
                  {(stepValue * index).toLocaleString('fr-FR')}
                </Text>
              </View>
            ))}
          </View>

          {/* Graphique */}
          <View style={styles.chartArea}>
            {/* Lignes de grille horizontales */}
            <View style={styles.gridLines}>
              {Array.from({ length: yAxisSteps + 1 }).map((_, index) => (
                <View key={index} style={styles.gridLine} />
              ))}
            </View>

            {/* Barres */}
            <View style={styles.barsContainer}>
              {data.map((item, index) => {
                const barHeight = maxValue > 0 ? (item.value / maxValue) * (height - 50) : 0;
                
                return (
                  <View key={index} style={styles.barWrapper}>
                    {/* Valeur au-dessus */}
                    <Text style={styles.barValue}>
                      {item.value.toLocaleString('fr-FR')}
                    </Text>
                    
                    {/* Barre */}
                    <View style={styles.barColumn}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: barHeight,
                            backgroundColor: item.color || color,
                          },
                        ]}
                      />
                    </View>
                    
                    {/* Label */}
                    <Text style={styles.barLabel} numberOfLines={2}>
                      {item.label}
                    </Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.lg,
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.textSecondary,
  },
  chartWrapper: {
    flexDirection: 'row',
    minWidth: width - 40,
  },
  yAxis: {
    width: 60,
    justifyContent: 'space-between',
    paddingRight: 8,
  },
  yAxisLabel: {
    height: 30,
    justifyContent: 'center',
  },
  yAxisText: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    textAlign: 'right',
  },
  chartArea: {
    flex: 1,
    position: 'relative',
  },
  gridLines: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 50,
    justifyContent: 'space-between',
  },
  gridLine: {
    height: 1,
    backgroundColor: theme.colors.border,
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 200,
    paddingBottom: 50,
  },
  barWrapper: {
    alignItems: 'center',
    marginHorizontal: 8,
    minWidth: 60,
  },
  barValue: {
    fontSize: 11,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  barColumn: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: 50,
  },
  bar: {
    width: 40,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    minHeight: 2,
  },
  barLabel: {
    fontSize: 10,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    width: 60,
  },
});

export default InventoryBarChart;


