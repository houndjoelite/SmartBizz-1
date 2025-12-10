import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * Badge d'alerte de stock
 * Affiche un indicateur visuel selon le niveau de stock
 */
const StockAlertBadge = ({ quantity, stockThreshold = 5 }) => {
  // Déterminer le niveau d'alerte
  const getAlertLevel = () => {
    if (quantity === 0) {
      return {
        level: 'rupture',
        text: 'Rupture de stock',
        icon: '❌',
        color: '#dc2626',
        backgroundColor: '#fef2f2',
      };
    } else if (quantity <= stockThreshold) {
      return {
        level: 'faible',
        text: `Stock faible (${quantity})`,
        icon: '⚠️',
        color: '#d97706',
        backgroundColor: '#fffbeb',
      };
    } else {
      return {
        level: 'disponible',
        text: `En stock (${quantity})`,
        icon: '✅',
        color: '#16a34a',
        backgroundColor: '#f0fdf4',
      };
    }
  };

  const alert = getAlertLevel();

  return (
    <View style={[styles.badge, { backgroundColor: alert.backgroundColor }]}>
      <Text style={styles.icon}>{alert.icon}</Text>
      <Text style={[styles.text, { color: alert.color }]}>
        {alert.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  icon: {
    fontSize: 14,
  },
  text: {
    fontSize: 12,
    fontWeight: '600',
  },
});

export default StockAlertBadge;


