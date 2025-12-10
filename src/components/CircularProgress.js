import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import theme from '../styles/theme';

/**
 * Graphique circulaire de progression - Style ArchitectUI
 */
export const CircularProgress = ({ 
  percentage, 
  size = 120, 
  strokeWidth = 10,
  color = theme.colors.success,
  showPercentage = true,
  subtitle,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <View style={[styles.svgContainer, { width: size, height: size }]}>
        <Svg width={size} height={size}>
          {/* Cercle de fond */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.colors.border}
            strokeWidth={strokeWidth}
            fill="none"
          />
          {/* Cercle de progression */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={progress}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
          />
        </Svg>
        
        {showPercentage && (
          <View style={styles.percentageContainer}>
            <Text style={styles.percentage}>{percentage}</Text>
            <Text style={styles.percentSymbol}>%</Text>
          </View>
        )}
      </View>
      
      {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },

  svgContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },

  percentageContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  percentage: {
    fontSize: 32,
    fontWeight: '700',
    color: theme.colors.success,
  },

  percentSymbol: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.success,
    marginLeft: 2,
    marginTop: 4,
  },

  subtitle: {
    marginTop: 8,
    fontSize: 12,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});

export default CircularProgress;


