import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Sidebar } from './Sidebar';
import { TopBarFixed } from './TopBarFixed';
import { theme } from '../styles/theme';
import AuthService from '../services/authService';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

/**
 * Layout avec Sidebar + TopBar - Style ArchitectUI
 * Layout principal pour toutes les pages de l'application
 */
export const LayoutWithSidebar = ({ children, navigation, currentRoute }) => {
  const [sidebarVisible, setSidebarVisible] = React.useState(!isMobile);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <View style={styles.container}>
      {/* TopBar - Toujours en haut */}
      <TopBarFixed navigation={navigation} user={user} />

      {/* Container avec Sidebar + Contenu */}
      <View style={styles.bodyContainer}>
        {/* Sidebar - Desktop: toujours visible, Mobile: toggle */}
        {!isMobile && (
          <View style={styles.sidebarContainer}>
            <Sidebar navigation={navigation} currentRoute={currentRoute} />
          </View>
        )}

        {/* Sidebar Mobile avec Overlay */}
        {isMobile && sidebarVisible && (
          <>
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={1}
              onPress={toggleSidebar}
            />
            <View style={styles.sidebarMobile}>
              <Sidebar navigation={navigation} currentRoute={currentRoute} />
            </View>
          </>
        )}

        {/* Contenu principal - Scroll Container */}
        <View style={styles.mainContent}>
          {/* Bouton toggle sidebar sur mobile */}
          {isMobile && (
            <TouchableOpacity
              style={styles.menuButton}
              onPress={toggleSidebar}
            >
              <Ionicons
                name={sidebarVisible ? 'close' : 'menu'}
                size={24}
                color={theme.colors.textPrimary}
              />
            </TouchableOpacity>
          )}

          {/* Contenu scrollable de la page */}
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.contentContainer}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  // Container principal - Full height
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: theme.colors.background,
    ...Platform.select({
      web: {
        height: '100vh',
        overflow: 'hidden',
      },
    }),
  },

  // Body container - Sidebar + Content (sous le TopBar)
  bodyContainer: {
    flex: 1,
    flexDirection: 'row',
    ...Platform.select({
      web: {
        height: 'calc(100vh - 64px)', // 64px = hauteur TopBar
        overflow: 'hidden',
      },
    }),
  },

  // Sidebar Desktop - Fixe à gauche
  sidebarContainer: {
    width: 280,
    flexShrink: 0,
    backgroundColor: theme.colors.surface,
    borderRightWidth: 1,
    borderRightColor: theme.colors.border,
    ...Platform.select({
      web: {
        height: '100%',
        overflow: 'auto',
      },
    }),
  },

  // Sidebar Mobile - Overlay
  sidebarMobile: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 280,
    zIndex: 1001,
    backgroundColor: theme.colors.surface,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 2, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },

  // Overlay sur mobile
  overlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 1000,
  },

  // Main Content - À droite de la sidebar
  mainContent: {
    flex: 1,
    backgroundColor: theme.colors.background,
    ...Platform.select({
      web: {
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      },
    }),
  },

  // Scroll Container
  scrollContainer: {
    flex: 1,
    ...Platform.select({
      web: {
        overflow: 'auto',
        height: '100%',
      },
    }),
  },

  // Content Container (Padding)
  contentContainer: {
    padding: theme.spacing['2xl'],
    ...Platform.select({
      default: {
        paddingTop: 80, // Espace pour le bouton menu sur mobile
      },
      web: {
        paddingTop: theme.spacing['2xl'],
      },
    }),
  },

  // Bouton Menu Mobile
  menuButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 16 : 16,
    left: 16,
    zIndex: 100,
    width: 44,
    height: 44,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        display: 'none',
      },
    }),
  },
});

export default LayoutWithSidebar;

