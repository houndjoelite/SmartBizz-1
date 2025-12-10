import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';

const { width } = Dimensions.get('window');

/**
 * Sidebar SmartBizz - Barre latérale moderne et élégante
 * Navigation principale de l'application
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.navigation - L'objet de navigation
 * @param {string} props.currentRoute - La route actuelle
 * @param {boolean} [props.isMobile=false] - Si l'écran est en mode mobile
 * @param {boolean} [props.isTablet=false] - Si l'écran est en mode tablette
 * @param {Function} [props.onClose] - Fonction à appeler pour fermer le sidebar (mobile)
 */
export const Sidebar = ({ 
  navigation, 
  currentRoute, 
  isMobile = false, 
  isTablet = false,
  onClose 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    dashboard: true,
    ventes: true,
    gestion: true,
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Définition des sections et menus
  const menuSections = [
    {
      id: 'dashboard',
      title: 'TABLEAU DE BORD',
      items: [
        {
          icon: 'home-outline',
          label: 'Accueil',
          route: 'Dashboard',
          badge: null,
        },
        {
          icon: 'bar-chart-outline',
          label: 'Statistiques',
          route: 'AccountStats',
          badge: null,
        },
      ],
    },
    {
      id: 'ventes',
      title: 'VENTES',
      items: [
        {
          icon: 'flash-outline',
          label: 'Vente Rapide',
          route: 'QuickSale',
          badge: null,
        },
        {
          icon: 'cart-outline',
          label: 'Ventes',
          route: 'Sales',
          badge: null,
        },
        {
          icon: 'document-text-outline',
          label: 'Factures',
          route: 'Invoices',
          badge: null,
        },
      ],
    },
    {
      id: 'gestion',
      title: 'GESTION',
      items: [
        {
          icon: 'cube-outline',
          label: 'Inventaire',
          route: 'Inventory',
          badge: null,
        },
      ],
    },
    {
      id: 'ecommerce',
      title: 'BOUTIQUE EN LIGNE',
      items: [
        {
          icon: 'bag-outline',
          label: 'Créer ma boutique',
          route: 'OnlineStore',
          badge: 'NEW',
        },
      ],
    },
    {
      id: 'parametres',
      title: 'PARAMÈTRES',
      items: [
        {
          icon: 'person-outline',
          label: 'Profil',
          route: 'ProfileSettings',
          badge: null,
        },
        {
          icon: 'notifications-outline',
          label: 'Notifications',
          route: 'Notifications',
          badge: '4',
        },
        {
          icon: 'card-outline',
          label: 'Paiement',
          route: 'PaymentSettings',
          badge: null,
        },
        {
          icon: 'shield-checkmark-outline',
          label: 'Sécurité',
          route: 'SecuritySettings',
          badge: null,
        },
        {
          icon: 'settings-outline',
          label: 'Général',
          route: 'Settings',
          badge: null,
        },
      ],
    },
  ];

  const renderMenuItem = (item) => {
    const isActive = currentRoute === item.route;
    const iconSize = isMobile ? 22 : 20;
    const itemPadding = isMobile ? 16 : 12;

    const handlePress = () => {
      navigation.navigate(item.route);
      if (isMobile && onClose) {
        onClose();
      }
    };

    return (
      <TouchableOpacity
        key={item.route}
        style={[
          styles.menuItem,
          isActive && styles.menuItemActive,
          { paddingVertical: itemPadding }
        ]}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.menuItemLeft}>
          <Ionicons
            name={item.icon}
            size={20}
            color={isActive ? '#1a73e8' : '#5f6368'}
            style={[
              styles.menuItemIcon,
              isActive && styles.menuItemActiveIcon
            ]}
          />
          <Text 
            style={[
              styles.menuItemText,
              isActive && styles.menuItemActiveText,
              isTablet && styles.menuItemTextTablet,
              isMobile && styles.menuItemTextMobile,
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {item.label}
          </Text>
        </View>

        {item.badge && (
          <View style={[
            styles.badge,
            isTablet && styles.badgeTablet,
            item.badge === 'NEW' && styles.badgeNew,
          ]}>
            <Text style={[
              styles.badgeText,
              item.badge === 'NEW' && styles.badgeNewText
            ]}>
              {item.badge}
            </Text>
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSection = (section) => {
    const isExpanded = expandedSections[section.id];

    return (
      <View key={section.id} style={styles.section}>
        {/* Header de section */}
        <TouchableOpacity
          style={styles.sectionHeader}
          onPress={() => toggleSection(section.id)}
        >
          <Text style={styles.sectionTitle}>{section.title}</Text>
          <Ionicons
            name={isExpanded ? 'chevron-down' : 'chevron-forward'}
            size={18}
            color="#5f6368"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>

        {/* Items de menu */}
        {isExpanded && (
          <View style={styles.menuItems}>
            {section.items.map(item => renderMenuItem(item))}
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header / Logo */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        {isMobile && onClose && (
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={onClose}
          >
            <Ionicons 
              name="close" 
              size={22} 
              color="#5f6368"
            />
          </TouchableOpacity>
        )}
      </View>

      {/* Contenu défilable */}
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        {menuSections.map(section => renderSection(section))}
      </ScrollView>

      {/* Pied de page */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          SmartBizz v1.0.0
        </Text>
        {!isMobile && (
          <Text style={styles.footerSubText}>
            {new Date().getFullYear()} Tous droits réservés
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    width: 280,
    height: '100%',
    paddingTop: Platform.OS === 'ios' ? 40 : 20,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    borderRightWidth: 1,
    borderRightColor: 'rgba(0, 0, 0, 0.08)',
    overflow: 'visible',
  },
  containerMobile: {
    width: '100%',
    paddingTop: Platform.OS === 'ios' ? 50 : 30,
  },
  containerTablet: {
    width: 280,
  },

  header: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.08)',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 64,
    backgroundColor: '#f8f9fa',
  },
  closeButton: {
    padding: 8,
    marginRight: -8,
    borderRadius: 20,
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#202124',
    marginLeft: 8,
  },

  scrollView: {
    flex: 1,
    width: '100%',
    overflow: 'visible',
  },
  scrollViewContent: {
    paddingBottom: 20,
    paddingTop: 8,
    paddingHorizontal: 4,
    width: '100%',
  },

  section: {
    marginBottom: 12,
    width: '100%',
  },

  sectionHeader: {
    paddingHorizontal: 24,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#5f6368',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 4,
    paddingHorizontal: 32,
    paddingVertical: 12,
    marginTop: 4,
  },

  menuItems: {
    gap: 4,
    width: '100%',
    paddingHorizontal: 8,
    paddingBottom: 8,
    overflow: 'visible',
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingRight: 24,
    paddingLeft: 12,
    marginRight: 12,
    marginLeft: 4,
    marginVertical: 2,
    borderRadius: 8,
    minHeight: 44,
    width: 'calc(100% - 16px)',
  },

  menuItemActive: {
    backgroundColor: 'rgba(26, 115, 232, 0.08)',
  },
  
  menuItemActiveText: {
    color: '#1a73e8',
    fontWeight: '600',
  },
  
  menuItemActiveIcon: {
    color: '#1a73e8',
  },

  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minWidth: 0, // Permet au texte de s'ajuster correctement
  },

  menuItemIcon: {
    width: 20,
    height: 20,
    textAlign: 'center',
    color: '#5f6368',
    marginLeft: 4,
    flexShrink: 0,
  },

  menuItemText: {
    fontSize: 15,
    color: '#202124',
    fontWeight: '500',
    flex: 1,
    marginLeft: 12,
    letterSpacing: 0.2,
    lineHeight: 20,
  },
  menuItemTextActive: {
    color: '#1a73e8',
    fontWeight: '600',
  },
  menuItemTextTablet: {
    fontSize: 15,
  },
  menuItemTextMobile: {
    fontSize: 16,
    fontWeight: '500',
  },

  badge: {
    backgroundColor: '#e8f0fe',
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 24,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  badgeText: {
    color: '#1a73e8',
    fontSize: 12,
    fontWeight: '600',
  },
  badgeNew: {
    backgroundColor: '#e6f4ea',
  },
  badgeNewText: {
    color: '#137333',
    fontSize: 12,
    fontWeight: '600',
  },

  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(0, 0, 0, 0.08)',
    backgroundColor: '#f8f9fa',
  },
  footerText: {
    fontSize: 12,
    color: '#5f6368',
    fontWeight: '500',
  },
  footerSubText: {
    fontSize: 11,
    color: '#5f6368',
    marginTop: 4,
    opacity: 0.8,
  },
});

export default Sidebar;
