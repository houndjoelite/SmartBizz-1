import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
  Image,
  Alert,
} from 'react-native';
import { useSettings } from '../hooks/useSettings';
import { auth } from '../services/firebase';

const SettingsScreen = ({ navigation }) => {
  const { settings, accountStats, notifications, loading } = useSettings();

  const user = auth.currentUser;
  const unreadNotifications = notifications?.filter(n => !n.read).length || 0;

  const menuSections = [
    {
      title: 'Compte',
      items: [
        {
          icon: '👤',
          title: 'Informations professionnelles',
          subtitle: 'Type d\'activité, adresse, contact',
          screen: 'ProfileSettings',
          badge: null,
        },
        {
          icon: '📊',
          title: 'Statistiques du compte',
          subtitle: 'Vue d\'ensemble de votre activité',
          screen: 'AccountStats',
          badge: null,
        },
        {
          icon: '🔔',
          title: 'Notifications',
          subtitle: 'Centre de notifications',
          screen: 'Notifications',
          badge: unreadNotifications > 0 ? unreadNotifications : null,
        },
      ],
    },
    {
      title: 'Paiement & Abonnement',
      items: [
        {
          icon: '💳',
          title: 'Modes de paiement',
          subtitle: 'Gérer vos méthodes de paiement',
          screen: 'PaymentSettings',
          badge: null,
        },
        {
          icon: '👑',
          title: 'Abonnement',
          subtitle: `Plan ${settings?.subscription?.plan || 'Gratuit'}`,
          screen: 'Subscription',
          badge: settings?.subscription?.plan === 'free' ? 'Gratuit' : null,
        },
      ],
    },
    {
      title: 'Personnalisation',
      items: [
        {
          icon: '🎨',
          title: 'Apparence',
          subtitle: 'Thème, couleurs, langue',
          screen: 'AppearanceSettings',
          badge: null,
        },
        {
          icon: '🏪',
          title: 'Multi-boutiques',
          subtitle: 'Gérer plusieurs points de vente',
          screen: 'StoresManagement',
          badge: settings?.stores?.length || 0,
        },
      ],
    },
    {
      title: 'Sécurité & Confidentialité',
      items: [
        {
          icon: '🔒',
          title: 'Sécurité',
          subtitle: 'Mot de passe, authentification',
          screen: 'SecuritySettings',
          badge: null,
        },
        {
          icon: '📱',
          title: 'Appareils connectés',
          subtitle: 'Gérer vos appareils',
          screen: 'ConnectedDevices',
          badge: null,
        },
        {
          icon: '☁️',
          title: 'Sauvegarde & Restauration',
          subtitle: 'Sauvegarder vos données',
          screen: 'BackupSettings',
          badge: null,
        },
      ],
    },
    {
      title: 'Avancé',
      items: [
        {
          icon: '👥',
          title: 'Gestion des employés',
          subtitle: 'Ajouter des utilisateurs, rôles',
          screen: 'EmployeesManagement',
          badge: 'Bientôt',
        },
        {
          icon: '🔌',
          title: 'Intégrations',
          subtitle: 'WhatsApp, Mobile Money, etc.',
          screen: 'Integrations',
          badge: 'Bientôt',
        },
      ],
    },
    {
      title: 'Support',
      items: [
        {
          icon: '📖',
          title: 'Aide & Documentation',
          subtitle: 'Guides et tutoriels',
          action: 'help',
          badge: null,
        },
        {
          icon: '📧',
          title: 'Contacter le support',
          subtitle: 'support@votreapp.com',
          action: 'contact',
          badge: null,
        },
        {
          icon: '⭐',
          title: 'Noter l\'application',
          subtitle: 'Donnez votre avis',
          action: 'rate',
          badge: null,
        },
      ],
    },
  ];

  const handleMenuPress = (item) => {
    if (item.screen) {
      // Vérifier si l'écran existe
      const availableScreens = [
        'ProfileSettings', 
        'AccountStats', 
        'Notifications', 
        'PaymentSettings', 
        'AppearanceSettings', 
        'BackupSettings', 
        'ConnectedDevices',
        'SecuritySettings',
        'Subscription'
      ];
      
      if (availableScreens.includes(item.screen)) {
        navigation.navigate(item.screen);
      } else {
        Alert.alert('Bientôt disponible', `${item.title} sera bientôt disponible`);
      }
    } else if (item.action) {
      handleAction(item.action);
    }
  };

  const handleAction = (action) => {
    switch (action) {
      case 'help':
        Alert.alert('Aide', 'Consultez notre documentation en ligne pour obtenir de l\'aide');
        break;
      case 'contact':
        Alert.alert('Support', 'Contactez-nous à support@votreapp.com');
        break;
      case 'rate':
        Alert.alert('Merci !', 'Votre avis nous aide à améliorer l\'application');
        break;
      default:
        break;
    }
  };

  const handleLogout = async () => {
    if (Platform.OS === 'web') {
      // Sur Web, les Alert avec boutons ne sont pas interactifs → déconnexion directe
      try {
        await auth.signOut();
      } catch (e) {
        console.error('Erreur de déconnexion:', e);
      }
      return;
    }

    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnexion',
          style: 'destructive',
          onPress: async () => {
            try { await auth.signOut(); } catch (e) { console.error('Erreur de déconnexion:', e); }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Paramètres</Text>
        <View style={{ width: 80 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* User Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.profileImageContainer}>
            {settings?.businessInfo?.logo ? (
              <Image 
                source={{ uri: settings.businessInfo.logo }} 
                style={styles.profileImage}
              />
            ) : (
              <View style={styles.profileImagePlaceholder}>
                <Text style={styles.profileImageText}>
                  {user?.displayName?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase() || '?'}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              {settings?.businessInfo?.businessName || user?.displayName || 'Mon Entreprise'}
            </Text>
            <Text style={styles.profileEmail}>{user?.email}</Text>
            {settings?.businessInfo?.businessType && (
              <View style={styles.businessTypeBadge}>
                <Text style={styles.businessTypeText}>{settings.businessInfo.businessType}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Quick Stats */}
        {accountStats && (
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{accountStats.totalProducts || 0}</Text>
              <Text style={styles.statLabel}>Produits</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{accountStats.totalSales || 0}</Text>
              <Text style={styles.statLabel}>Ventes</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{accountStats.totalClients || 0}</Text>
              <Text style={styles.statLabel}>Clients</Text>
            </View>
          </View>
        )}

        {/* Menu Sections */}
        {menuSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuItems}>
              {section.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={[
                    styles.menuItem,
                    itemIndex === section.items.length - 1 && styles.menuItemLast,
                  ]}
                  onPress={() => handleMenuPress(item)}
                >
                  <View style={styles.menuItemLeft}>
                    <View style={styles.menuIcon}>
                      <Text style={styles.menuIconText}>{item.icon}</Text>
                    </View>
                    <View style={styles.menuItemContent}>
                      <Text style={styles.menuItemTitle}>{item.title}</Text>
                      <Text style={styles.menuItemSubtitle}>{item.subtitle}</Text>
                    </View>
                  </View>
                  <View style={styles.menuItemRight}>
                    {item.badge && (
                      <View style={[
                        styles.badge,
                        typeof item.badge === 'string' && item.badge === 'Bientôt' && styles.badgeWarning
                      ]}>
                        <Text style={styles.badgeText}>{item.badge}</Text>
                      </View>
                    )}
                    <Text style={styles.menuItemArrow}>›</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Déconnexion</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.appVersion}>Version 1.0.0</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
  },
  profileCard: {
    backgroundColor: '#fff',
    padding: 20,
    width: '100%',
    marginTop: 20,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  profileImageContainer: {
    marginRight: 16,
  },
  profileImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  profileImagePlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#3b82f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImageText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  businessTypeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  businessTypeText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },
  quickStats: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
    marginTop: 12,
    padding: 20,
    borderRadius: 16,
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 12,
  },
  menuSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    marginBottom: 12,
    marginHorizontal: 20,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  menuItems: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 16,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    width: '100%',
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
    flexShrink: 1,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuIconText: {
    fontSize: 20,
  },
  menuItemContent: {
    flex: 1,
    marginLeft: 12,
    flexShrink: 1,
    marginRight: 8,
  },
  menuItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  menuItemSubtitle: {
    fontSize: 13,
    color: '#6b7280',
  },
  menuItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badge: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  badgeWarning: {
    backgroundColor: '#f59e0b',
  },
  badgeText: {
    fontSize: 11,
    color: '#fff',
    fontWeight: '600',
  },
  menuItemArrow: {
    fontSize: 24,
    color: '#d1d5db',
    marginLeft: 4,
  },
  logoutButton: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 24,
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fecaca',
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px rgba(239,68,68,0.1)',
      },
      default: {
        shadowColor: '#ef4444',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ef4444',
  },
  appVersion: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 20,
    marginBottom: 40,
  },
});

export default SettingsScreen;

