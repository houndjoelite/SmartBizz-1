import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import theme from '../styles/theme';
import Svg, { Line, Circle, Polyline, Text as SvgText } from 'react-native-svg';

const { width } = Dimensions.get('window');

/**
 * Graphique linéaire pour l'inventaire
 */
const InventoryLineChart = ({ 
  data, 
  title, 
  height = 200, 
  colors = [theme.colors.primary, theme.colors.success] 
}) => {
  if (!data || data.length === 0 || !data[0]?.values) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.chartContainer, { height }]}>
          <Text style={styles.emptyText}>Aucune donnée disponible</Text>
        </View>
      </View>
    );
  }

  const chartWidth = Math.max(width - 120, data[0].values.length * 60);
  const chartHeight = height - 80;
  const padding = { top: 20, right: 20, bottom: 40, left: 50 };

  // Trouver min/max pour toutes les séries
  const allValues = data.flatMap(series => series.values);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues, 0);
  const valueRange = maxValue - minValue || 1;

  // Fonction pour convertir valeur en position Y
  const getY = (value) => {
    return padding.top + ((maxValue - value) / valueRange) * chartHeight;
  };

  // Fonction pour obtenir position X
  const getX = (index) => {
    return padding.left + (index * (chartWidth - padding.left - padding.right)) / (data[0].values.length - 1);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      {/* Légende */}
      <View style={styles.legend}>
        {data.map((series, index) => (
          <View key={index} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors[index] || theme.colors.primary }]} />
            <Text style={styles.legendText}>{series.label}</Text>
          </View>
        ))}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ width: chartWidth, height: height }}>
          <Svg width={chartWidth} height={height}>
            {/* Lignes de grille horizontales */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, index) => {
              const y = padding.top + ratio * chartHeight;
              const value = maxValue - ratio * valueRange;
              return (
                <React.Fragment key={index}>
                  <Line
                    x1={padding.left}
                    y1={y}
                    x2={chartWidth - padding.right}
                    y2={y}
                    stroke={theme.colors.border}
                    strokeWidth="1"
                  />
                  <SvgText
                    x={padding.left - 10}
                    y={y + 5}
                    fontSize="10"
                    fill={theme.colors.textSecondary}
                    textAnchor="end"
                  >
                    {Math.round(value)}
                  </SvgText>
                </React.Fragment>
              );
            })}

            {/* Labels X */}
            {data[0].labels.map((label, index) => {
              const x = getX(index);
              return (
                <SvgText
                  key={index}
                  x={x}
                  y={height - 10}
                  fontSize="10"
                  fill={theme.colors.textSecondary}
                  textAnchor="middle"
                >
                  {label}
                </SvgText>
              );
            })}

            {/* Lignes de données */}
            {data.map((series, seriesIndex) => {
              const points = series.values
                .map((value, index) => `${getX(index)},${getY(value)}`)
                .join(' ');

              return (
                <React.Fragment key={seriesIndex}>
                  <Polyline
                    points={points}
                    fill="none"
                    stroke={colors[seriesIndex] || theme.colors.primary}
                    strokeWidth="2"
                  />
                  {/* Points */}
                  {series.values.map((value, index) => (
                    <Circle
                      key={index}
                      cx={getX(index)}
                      cy={getY(value)}
                      r="4"
                      fill={colors[seriesIndex] || theme.colors.primary}
                    />
                  ))}
                </React.Fragment>
              );
            })}
          </Svg>
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
    marginBottom: theme.spacing.md,
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.sm,
  },
  legendText: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
  },
  chartContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: theme.fonts.sizes.md,
    color: theme.colors.textSecondary,
  },
});

export default InventoryLineChart;


