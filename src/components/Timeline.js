import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../styles/theme';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

/**
 * Timeline/Chronologie - Style ArchitectUI
 */
export const Timeline = ({ items = [] }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {items.map((item, index) => (
        <View key={index} style={styles.timelineItem}>
          {/* Ligne verticale */}
          {index < items.length - 1 && <View style={styles.line} />}
          
          {/* Point/Icône */}
          <View style={[styles.dot, { backgroundColor: item.color || theme.colors.primary }]}>
            {item.icon && <Ionicons name={item.icon} size={isMobile ? 10 : 12} color="#FFFFFF" />}
          </View>
          
          {/* Heure */}
          <Text style={styles.time}>{item.time}</Text>
          
          {/* Contenu */}
          <View style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            {item.description && (
              <Text style={styles.description}>{item.description}</Text>
            )}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  timelineItem: {
    flexDirection: 'row',
    marginBottom: isMobile ? 16 : 24,
    position: 'relative',
  },

  line: {
    position: 'absolute',
    left: isMobile ? 11 : 15,
    top: isMobile ? 20 : 24,
    bottom: isMobile ? -16 : -24,
    width: 2,
    backgroundColor: theme.colors.border,
  },

  dot: {
    width: isMobile ? 20 : 24,
    height: isMobile ? 20 : 24,
    borderRadius: isMobile ? 10 : 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: isMobile ? 10 : 12,
    zIndex: 1,
  },

  time: {
    fontSize: isMobile ? 10 : 12,
    color: theme.colors.textSecondary,
    width: isMobile ? 50 : 60,
    marginRight: isMobile ? 10 : 12,
  },

  content: {
    flex: 1,
    paddingTop: 0,
  },

  title: {
    fontSize: isMobile ? 13 : 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: isMobile ? 2 : 4,
  },

  description: {
    fontSize: isMobile ? 12 : 13,
    color: theme.colors.textSecondary,
    lineHeight: isMobile ? 16 : 18,
  },
});

export default Timeline;


