import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import theme from '../styles/theme';
import Svg, { Path, Circle, Text as SvgText } from 'react-native-svg';

/**
 * Graphique circulaire pour l'inventaire
 */
const InventoryPieChart = ({ data, title, size = 200 }) => {
  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
        <View style={[styles.chartContainer, { height: size }]}>
          <Text style={styles.emptyText}>Aucune donnée disponible</Text>
        </View>
      </View>
    );
  }

  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculer les angles pour chaque segment
  let currentAngle = 0;
  const segments = data.map((item) => {
    const percentage = (item.value / total) * 100;
    const angle = (item.value / total) * 360;
    const segment = {
      ...item,
      percentage,
      startAngle: currentAngle,
      endAngle: currentAngle + angle,
    };
    currentAngle += angle;
    return segment;
  });

  // Fonction pour créer le path d'un segment
  const createArc = (startAngle, endAngle, radius) => {
    const start = polarToCartesian(size / 2, size / 2, radius, endAngle);
    const end = polarToCartesian(size / 2, size / 2, radius, startAngle);
    const largeArcFlag = endAngle - startAngle <= 180 ? '0' : '1';

    return [
      `M ${size / 2} ${size / 2}`,
      `L ${start.x} ${start.y}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 0 ${end.x} ${end.y}`,
      'Z',
    ].join(' ');
  };

  const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
    const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
    return {
      x: centerX + radius * Math.cos(angleInRadians),
      y: centerY + radius * Math.sin(angleInRadians),
    };
  };

  const radius = (size * 0.8) / 2;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      
      <View style={styles.chartRow}>
        {/* Graphique circulaire */}
        <View style={styles.chartWrapper}>
          <Svg width={size} height={size}>
            {segments.map((segment, index) => (
              <Path
                key={index}
                d={createArc(segment.startAngle, segment.endAngle, radius)}
                fill={segment.color || theme.colors.primary}
              />
            ))}
            {/* Cercle central blanc pour effet donut */}
            <Circle
              cx={size / 2}
              cy={size / 2}
              r={radius * 0.5}
              fill={theme.colors.surface}
            />
          </Svg>
        </View>

        {/* Légende */}
        <View style={styles.legend}>
          {segments.map((segment, index) => (
            <View key={index} style={styles.legendItem}>
              <View style={[styles.legendColor, { backgroundColor: segment.color }]} />
              <View style={styles.legendInfo}>
                <Text style={styles.legendLabel}>{segment.label}</Text>
                <Text style={styles.legendValue}>
                  {segment.percentage.toFixed(0)}%
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
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
  chartRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  chartWrapper: {
    marginRight: theme.spacing.xl,
  },
  legend: {
    flex: 1,
    minWidth: 200,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: theme.spacing.sm,
  },
  legendInfo: {
    flex: 1,
  },
  legendLabel: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  legendValue: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.fonts.weights.semibold,
  },
});

export default InventoryPieChart;


