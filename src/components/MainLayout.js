import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Sidebar } from './Sidebar';
import { TopBarFixed } from './TopBarFixed';
import { InteractiveTour } from './InteractiveTour';
import { theme } from '../styles/theme';
import AuthService from '../services/authService';

// Import de tous les écrans
import DashboardScreen from '../screens/DashboardScreen';
import InventoryScreen from '../screens/InventoryScreen';
import SalesScreen from '../screens/SalesScreen';
import SalesAnalyticsScreen from '../screens/SalesAnalyticsScreen';
import InvoicesScreen from '../screens/InvoicesScreen';
import QuickSaleScreen from '../screens/QuickSaleScreen';
import SettingsScreen from '../screens/SettingsScreen';
import ProfileSettingsScreen from '../screens/settings/ProfileSettingsScreen';
import AccountStatsScreen from '../screens/settings/AccountStatsScreen';
import NotificationsScreen from '../screens/settings/NotificationsScreen';
import PaymentSettingsScreen from '../screens/settings/PaymentSettingsScreen';
import AppearanceSettingsScreen from '../screens/settings/AppearanceSettingsScreen';
import BackupSettingsScreen from '../screens/settings/BackupSettingsScreen';
import ConnectedDevicesScreen from '../screens/settings/ConnectedDevicesScreen';
import DataScreen from '../screens/DataScreen';
import SecuritySettingsScreen from '../screens/settings/SecuritySettingsScreen';
import SubscriptionScreen from '../screens/settings/SubscriptionScreen';
import ThemeDemo from '../screens/ThemeDemo';
import OnlineStoreScreen from '../screens/OnlineStoreScreen';

const { width, height } = Dimensions.get('window');
const isMobile = width < 768;
const isTablet = width >= 768 && width < 1024;

/**
 * MainLayout - Layout principal avec Sidebar et TopBar fixes
 * Seul le contenu central change lors de la navigation
 */
export const MainLayout = ({ navigation: reactNavigation }) => {
  const [currentScreen, setCurrentScreen] = useState('Dashboard');
  const [sidebarVisible, setSidebarVisible] = useState(!isMobile);
  const [user, setUser] = useState(null);
  const [screenData, setScreenData] = useState(null);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // Navigation interne - Change seulement le contenu
  const navigateTo = (screenName, params = {}) => {
    setCurrentScreen(screenName);
    setScreenData(params);
    // Fermer la sidebar sur mobile après navigation
    if (isMobile) {
      setSidebarVisible(false);
    }
  };

  // Configuration de la navigation
  const navigationConfig = [
    { name: 'Tableau de bord', icon: 'grid-outline', component: DashboardScreen },
    { name: 'Inventaire', icon: 'cube-outline', component: InventoryScreen },
    { name: 'Ventes', icon: 'cash-outline', component: SalesScreen },
    { name: 'Analytique', icon: 'analytics-outline', component: SalesAnalyticsScreen },
    { name: 'Données', icon: 'bar-chart-outline', component: DataScreen },
    { name: 'Factures', icon: 'document-text-outline', component: InvoicesScreen },
    { name: 'Vente Rapide', icon: 'add-circle-outline', component: QuickSaleScreen },
    { 
      name: 'Paramètres', 
      icon: 'settings-outline', 
      component: SettingsScreen,
      nestedScreens: [
        { name: 'Profil', component: ProfileSettingsScreen },
        { name: 'Statistiques', component: AccountStatsScreen },
        { name: 'Notifications', component: NotificationsScreen },
        { name: 'Paiements', component: PaymentSettingsScreen },
        { name: 'Apparence', component: AppearanceSettingsScreen },
        { name: 'Sauvegarde', component: BackupSettingsScreen },
        { name: 'Appareils connectés', component: ConnectedDevicesScreen },
        { name: 'Sécurité', component: SecuritySettingsScreen },
        { name: 'Abonnement', component: SubscriptionScreen },
      ]
    },
    { name: 'Boutique en ligne', icon: 'globe-outline', component: OnlineStoreScreen },
    { name: 'Thème', icon: 'color-palette-outline', component: ThemeDemo },
  ];

  // Mapping des écrans
  const screens = {
    Dashboard: DashboardScreen,
    Inventory: InventoryScreen,
    Sales: SalesAnalyticsScreen, // Nouveau écran de statistiques
    SalesHistory: SalesScreen, // Ancien écran d'historique
    Invoices: InvoicesScreen,
    QuickSale: QuickSaleScreen,
    Settings: SettingsScreen,
    ProfileSettings: ProfileSettingsScreen,
    OnlineStore: OnlineStoreScreen,
    AccountStats: AccountStatsScreen,
    Notifications: NotificationsScreen,
    PaymentSettings: PaymentSettingsScreen,
    AppearanceSettings: AppearanceSettingsScreen,
    BackupSettings: BackupSettingsScreen,
    ConnectedDevices: ConnectedDevicesScreen,
    SecuritySettings: SecuritySettingsScreen,
    Subscription: SubscriptionScreen,
    ThemeDemo: ThemeDemo,
    Data: DataScreen,
  };

  // Navigation simulée pour compatibilité avec les écrans existants
  const mockNavigation = {
    navigate: navigateTo,
    goBack: () => navigateTo('Dashboard'),
    push: navigateTo,
    replace: navigateTo,
    reset: (config) => {
      if (config.routes && config.routes.length > 0) {
        navigateTo(config.routes[0].name);
      }
    },
    setParams: (params) => {
      setScreenData({ ...screenData, ...params });
    },
    addListener: () => () => {}, // Mock pour les listeners
    removeListener: () => {},
    isFocused: () => true,
    canGoBack: () => false,
  };

  // Route mock pour les écrans
  const mockRoute = {
    name: currentScreen,
    params: screenData,
  };

  // Récupérer le composant de l'écran actuel
  const CurrentScreenComponent = screens[currentScreen] || DashboardScreen;

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  return (
    <View style={styles.container}>
      {/* TopBar - Toujours en haut */}
      <TopBarFixed 
        navigation={mockNavigation} 
        user={user} 
        onMenuPress={isMobile ? toggleSidebar : null}
        isMobile={isMobile}
      />

      {/* Container avec Sidebar + Contenu */}
      <View style={styles.bodyContainer}>
        {/* Sidebar - Desktop/Tablet: toujours visible, Mobile: toggle */}
        {!isMobile ? (
          <View style={[
            styles.sidebarContainer,
            isTablet && styles.sidebarTablet
          ]}>
            <Sidebar 
              navigation={mockNavigation} 
              currentRoute={currentScreen}
              isMobile={isMobile}
              isTablet={isTablet}
            />
          </View>
        ) : null}

        {/* Sidebar Mobile avec Overlay */}
        {isMobile && sidebarVisible && (
          <>
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={0.5}
              onPress={toggleSidebar}
            />
            <View style={styles.sidebarMobile}>
              <Sidebar 
                navigation={mockNavigation} 
                currentRoute={currentScreen}
                isMobile={true}
                onClose={toggleSidebar}
              />
            </View>
          </>
        )}

        {/* Contenu principal - Zone qui change */}
        <View style={[
          styles.mainContent,
          isMobile && styles.mainContentMobile,
          isTablet && styles.mainContentTablet
        ]}>
          {/* Bouton toggle sidebar sur mobile - déplacé dans TopBar */}

          {/* Écran actuel - S'affiche dans la zone de contenu */}
          <View style={styles.screenContainer}>
            <CurrentScreenComponent 
              navigation={mockNavigation} 
              route={mockRoute}
            />
          </View>
        </View>
      </View>

      {/* Guide interactif pour les nouveaux utilisateurs */}
      <InteractiveTour 
        userId={user?.uid} 
        onComplete={() => console.log('✅ Guide interactif terminé')}
      />
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
  },
  sidebarContainer: {
    width: 280,
    backgroundColor: theme.colors.surface,
    borderRightWidth: StyleSheet.hairlineWidth,
    borderRightColor: theme.colors.border,
  },
  sidebarTablet: {
    width: 240, // Largeur réduite pour tablettes
  },
  sidebarMobile: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '85%',
    maxWidth: 300,
    backgroundColor: theme.colors.surface,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  mainContent: {
    flex: 1,
    backgroundColor: theme.colors.background,
        height: '100%',
        overflow: 'auto',
      },
    }),
  },

  // Bouton menu mobile
  menuButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
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
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      },
    }),
  },

  // Container de l'écran
  screenContainer: {
    flex: 1,
    ...Platform.select({
      web: {
        overflow: 'auto',
        height: '100%',
      },
    }),
  },
});

export default MainLayout;

