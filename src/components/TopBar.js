import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  Modal,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { ProfilePhotoUploader } from './ProfilePhotoUploader';

/**
 * TopBar ArchitectUI - Barre supérieure moderne et fonctionnelle
 * Tous les éléments sont cliquables et fonctionnels
 */
export const TopBar = ({ navigation, user }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  const [showMegaMenu, setShowMegaMenu] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState('bj'); // Bénin par défaut
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [userPhoto, setUserPhoto] = useState(user?.photoURL || null);
  
  // Notifications fictives
  const notifications = [
    {
      id: 1,
      title: 'Nouvelle vente',
      message: 'Vente de 1 250 € effectuée',
      time: 'Il y a 5 min',
      read: false,
      icon: 'cart',
      color: theme.colors.success,
    },
    {
      id: 2,
      title: 'Stock faible',
      message: 'Produit X: 3 unités restantes',
      time: 'Il y a 1h',
      read: false,
      icon: 'warning',
      color: theme.colors.warning,
    },
    {
      id: 3,
      title: 'Facture payée',
      message: 'Facture #1234 réglée',
      time: 'Il y a 2h',
      read: true,
      icon: 'checkmark-circle',
      color: theme.colors.success,
    },
    {
      id: 4,
      title: 'Nouveau client',
      message: 'Jean Dupont s\'est inscrit',
      time: 'Hier',
      read: true,
      icon: 'person-add',
      color: theme.colors.primary,
    },
  ];

  const languages = [
    { code: 'bj', name: 'Bénin - Français', flag: '🇧🇯' },
    { code: 'fr', name: 'France - Français', flag: '🇫🇷' },
    { code: 'en', name: 'English', flag: '🇬🇧' },
    { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
    { code: 'es', name: 'Español', flag: '🇪🇸' },
  ];

  // Mettre à jour la photo quand user change
  useEffect(() => {
    if (user?.photoURL) {
      setUserPhoto(user.photoURL);
    }
  }, [user]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Alert.alert('Recherche', `Recherche de: "${searchQuery}"`);
    }
  };

  const handleNotificationPress = (notification) => {
    setShowNotifications(false);
    Alert.alert(notification.title, notification.message);
  };

  const handleLanguageChange = (lang) => {
    setCurrentLanguage(lang.code);
    setShowLanguages(false);
    Alert.alert('Langue changée', `Langue: ${lang.name}`);
  };

  return (
    <View style={styles.container}>
      {/* Left Section - Logo + Search */}
      <View style={styles.leftSection}>
        {/* Logo */}
        <TouchableOpacity 
          style={styles.logoContainer}
          onPress={() => navigation.navigate('Dashboard')}
        >
          <View style={styles.logoIcon}>
            <Ionicons name="business" size={20} color={theme.colors.primary} />
          </View>
          <Text style={styles.logoText}>Architect</Text>
        </TouchableOpacity>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons 
            name="search" 
            size={20} 
            color={theme.colors.textTertiary} 
            style={styles.searchIcon}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher..."
            placeholderTextColor={theme.colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
        </View>
      </View>

      {/* Center Section - Menu Items */}
      <View style={styles.centerSection}>
        {/* Mega Menu */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            setShowMegaMenu(!showMegaMenu);
            Alert.alert('Méga Menu', 'Menu principal de l\'application');
          }}
        >
          <Ionicons name="grid-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.menuText}>Méga Menu</Text>
          <Ionicons name="chevron-down" size={16} color={theme.colors.textTertiary} />
        </TouchableOpacity>

        {/* Projets */}
        <TouchableOpacity 
          style={styles.menuItem}
          onPress={() => {
            setShowProjects(!showProjects);
            Alert.alert('Projets', 'Gérer vos projets');
          }}
        >
          <Ionicons name="folder-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.menuText}>Projets</Text>
          <Ionicons name="chevron-down" size={16} color={theme.colors.textTertiary} />
        </TouchableOpacity>

        {/* Paramètres */}
        <TouchableOpacity 
          style={styles.menuItemBadge}
          onPress={() => navigation.navigate('Settings')}
        >
          <Ionicons name="settings-outline" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.menuText}>Paramètres</Text>
          <View style={styles.redBadge}>
            <Text style={styles.badgeText}>{unreadCount}</Text>
          </View>
          <Ionicons name="chevron-down" size={16} color={theme.colors.textTertiary} />
        </TouchableOpacity>
      </View>

      {/* Right Section - Icons + User */}
      <View style={styles.rightSection}>
        {/* Grid Icon - Applications */}
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => Alert.alert('Applications', 'Toutes les applications')}
        >
          <Ionicons name="apps" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        {/* Messages */}
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => Alert.alert('Messages', 'Aucun nouveau message')}
        >
          <Ionicons name="chatbubble-outline" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        {/* Notifications - FONCTIONNEL */}
        <TouchableOpacity 
          style={styles.iconButtonWithBadge}
          onPress={() => setShowNotifications(true)}
        >
          <Ionicons name="notifications" size={20} color={theme.colors.textSecondary} />
          {unreadCount > 0 && (
            <View style={styles.redDot}>
              <Text style={styles.dotText}>{unreadCount}</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Language Selector - FRANÇAIS */}
        <TouchableOpacity 
          style={styles.flagButton}
          onPress={() => setShowLanguages(true)}
        >
          <Text style={styles.flagEmoji}>
            {languages.find(l => l.code === currentLanguage)?.flag || '🇫🇷'}
          </Text>
        </TouchableOpacity>

        {/* Calendrier */}
        <TouchableOpacity 
          style={styles.iconButton}
          onPress={() => Alert.alert('Calendrier', 'Ouvrir le calendrier')}
        >
          <Ionicons name="calendar-outline" size={20} color={theme.colors.textSecondary} />
        </TouchableOpacity>

        {/* Divider */}
        <View style={styles.divider} />

        {/* User Profile */}
        <TouchableOpacity 
          style={styles.userProfile}
          onPress={() => setShowProfileMenu(!showProfileMenu)}
        >
          {/* Photo de profil ou avatar par défaut */}
          {userPhoto ? (
            <Image 
              source={{ uri: userPhoto }} 
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatarPlaceholder}>
              <Ionicons name="person" size={20} color={theme.colors.primary} />
            </View>
          )}
          <View style={styles.userInfo}>
            <Text style={styles.userName}>
              {user?.displayName || user?.email?.split('@')[0] || 'Utilisateur'}
            </Text>
            <Text style={styles.userRole}>Entrepreneur</Text>
          </View>
          <Ionicons name="chevron-down" size={16} color={theme.colors.textTertiary} />
        </TouchableOpacity>

        {/* Menu Hamburger (mobile) */}
        <TouchableOpacity style={styles.menuButton}>
          <Ionicons name="menu" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Modal Notifications */}
      <Modal
        visible={showNotifications}
        transparent
        animationType="fade"
        onRequestClose={() => setShowNotifications(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowNotifications(false)}
        >
          <View style={styles.notificationsPanel}>
            <View style={styles.notificationsHeader}>
              <Text style={styles.notificationsTitle}>Notifications</Text>
              <TouchableOpacity onPress={() => setShowNotifications(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.notificationsList}>
              {notifications.map((notif) => (
                <TouchableOpacity
                  key={notif.id}
                  style={[
                    styles.notificationItem,
                    !notif.read && styles.notificationUnread
                  ]}
                  onPress={() => handleNotificationPress(notif)}
                >
                  <View style={[styles.notifIcon, { backgroundColor: notif.color + '20' }]}>
                    <Ionicons name={notif.icon} size={20} color={notif.color} />
                  </View>
                  <View style={styles.notifContent}>
                    <Text style={styles.notifTitle}>{notif.title}</Text>
                    <Text style={styles.notifMessage}>{notif.message}</Text>
                    <Text style={styles.notifTime}>{notif.time}</Text>
                  </View>
                  {!notif.read && <View style={styles.unreadDot} />}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity 
              style={styles.notificationsFooter}
              onPress={() => {
                setShowNotifications(false);
                navigation.navigate('Notifications');
              }}
            >
              <Text style={styles.notificationsFooterText}>Voir toutes les notifications</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Langues */}
      <Modal
        visible={showLanguages}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLanguages(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLanguages(false)}
        >
          <View style={styles.languagesPanel}>
            <View style={styles.languagesHeader}>
              <Text style={styles.languagesTitle}>Choisir une langue</Text>
              <TouchableOpacity onPress={() => setShowLanguages(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {languages.map((lang) => (
              <TouchableOpacity
                key={lang.code}
                style={[
                  styles.languageItem,
                  currentLanguage === lang.code && styles.languageItemActive
                ]}
                onPress={() => handleLanguageChange(lang)}
              >
                <Text style={styles.languageFlag}>{lang.flag}</Text>
                <Text style={styles.languageName}>{lang.name}</Text>
                {currentLanguage === lang.code && (
                  <Ionicons name="checkmark" size={20} color={theme.colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Menu Profil */}
      <Modal
        visible={showProfileMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowProfileMenu(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowProfileMenu(false)}
        >
          <View style={styles.profilePanel}>
            <View style={styles.profileHeader}>
              <Text style={styles.profileTitle}>Mon Profil</Text>
              <TouchableOpacity onPress={() => setShowProfileMenu(false)}>
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Photo de profil avec uploader */}
            <View style={styles.profilePhotoSection}>
              <ProfilePhotoUploader
                userId={user?.uid}
                currentPhotoURL={userPhoto}
                onPhotoUpdated={(newPhotoURL) => {
                  setUserPhoto(newPhotoURL);
                  Alert.alert('Succès', 'Photo de profil mise à jour !');
                }}
                size={100}
              />
              <Text style={styles.profileName}>
                {user?.displayName || user?.email?.split('@')[0] || 'Utilisateur'}
              </Text>
              <Text style={styles.profileEmail}>{user?.email}</Text>
            </View>

            {/* Menu Options */}
            <View style={styles.profileMenuList}>
              <TouchableOpacity
                style={styles.profileMenuItem}
                onPress={() => {
                  setShowProfileMenu(false);
                  navigation.navigate('ProfileSettings');
                }}
              >
                <Ionicons name="person-outline" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.profileMenuText}>Modifier le profil</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileMenuItem}
                onPress={() => {
                  setShowProfileMenu(false);
                  navigation.navigate('Settings');
                }}
              >
                <Ionicons name="settings-outline" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.profileMenuText}>Paramètres</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.profileMenuItem}
                onPress={() => {
                  setShowProfileMenu(false);
                  navigation.navigate('AccountStats');
                }}
              >
                <Ionicons name="stats-chart-outline" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.profileMenuText}>Statistiques</Text>
                <Ionicons name="chevron-forward" size={20} color={theme.colors.textTertiary} />
              </TouchableOpacity>

              <View style={styles.profileDivider} />

              <TouchableOpacity
                style={[styles.profileMenuItem, styles.profileMenuItemDanger]}
                onPress={() => {
                  setShowProfileMenu(false);
                  Alert.alert(
                    'Déconnexion',
                    'Voulez-vous vraiment vous déconnecter ?',
                    [
                      { text: 'Annuler', style: 'cancel' },
                      {
                        text: 'Déconnexion',
                        style: 'destructive',
                        onPress: () => {
                          // Déconnexion gérer par votre service
                        },
                      },
                    ]
                  );
                }}
              >
                <Ionicons name="log-out-outline" size={20} color={theme.colors.danger} />
                <Text style={[styles.profileMenuText, { color: theme.colors.danger }]}>
                  Déconnexion
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
        zIndex: 100,
      },
    }),
  },

  // Left Section
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.lg,
    ...Platform.select({
      web: {
        flex: 0,
        minWidth: 500,
      },
      default: {
        flex: 1,
      },
    }),
  },

  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },

  logoIcon: {
    width: 32,
    height: 32,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  logoText: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.backgroundDark,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    height: 40,
    flex: 1,
    maxWidth: 300,
  },

  searchIcon: {
    marginRight: theme.spacing.sm,
  },

  searchInput: {
    flex: 1,
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textPrimary,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
  },

  // Center Section
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.md,
    flex: 1,
    justifyContent: 'center',
    ...Platform.select({
      web: {
        display: 'flex',
      },
      default: {
        display: 'none', // Caché sur mobile
      },
    }),
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        ':hover': {
          backgroundColor: theme.colors.backgroundDark,
        },
      },
    }),
  },

  menuItemBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    position: 'relative',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },

  menuText: {
    fontSize: theme.fonts.sizes.base,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.textSecondary,
  },

  redBadge: {
    backgroundColor: theme.colors.danger,
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: 6,
    paddingVertical: 2,
    minWidth: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  badgeText: {
    fontSize: theme.fonts.sizes.xs,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textInverse,
  },

  // Right Section
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    ...Platform.select({
      web: {
        flex: 0,
      },
      default: {
        flex: 0,
      },
    }),
  },

  iconButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
        ':hover': {
          backgroundColor: theme.colors.backgroundDark,
        },
      },
    }),
  },

  iconButtonWithBadge: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },

  redDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: theme.colors.danger,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dotText: {
    fontSize: 10,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textInverse,
  },

  flagButton: {
    width: 36,
    height: 36,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
    }),
  },

  flagEmoji: {
    fontSize: 20,
  },

  divider: {
    width: 1,
    height: 32,
    backgroundColor: theme.colors.border,
    marginHorizontal: theme.spacing.sm,
  },

  userProfile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.md,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        display: 'flex',
        ':hover': {
          backgroundColor: theme.colors.backgroundDark,
        },
      },
      default: {
        display: 'none', // Caché sur mobile
      },
    }),
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
  },

  userInfo: {
    ...Platform.select({
      web: {
        display: 'flex',
      },
      default: {
        display: 'none',
      },
    }),
  },

  userName: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.textPrimary,
  },

  userRole: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textTertiary,
  },

  menuButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      web: {
        display: 'none', // Caché sur desktop
      },
    }),
  },

  // Styles Modales
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 64, // Hauteur de la TopBar
    paddingRight: theme.spacing.lg,
  },

  // Panel Notifications
  notificationsPanel: {
    width: 380,
    maxHeight: 500,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 10,
      },
    }),
  },

  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  notificationsTitle: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
  },

  notificationsList: {
    maxHeight: 350,
  },

  notificationItem: {
    flexDirection: 'row',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.borderLight,
    alignItems: 'flex-start',
    gap: theme.spacing.md,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        ':hover': {
          backgroundColor: theme.colors.backgroundDark,
        },
      },
    }),
  },

  notificationUnread: {
    backgroundColor: theme.colors.primary + '05',
  },

  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },

  notifContent: {
    flex: 1,
  },

  notifTitle: {
    fontSize: theme.fonts.sizes.base,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },

  notifMessage: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },

  notifTime: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textTertiary,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
  },

  notificationsFooter: {
    padding: theme.spacing.lg,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    alignItems: 'center',
  },

  notificationsFooterText: {
    fontSize: theme.fonts.sizes.sm,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.primary,
  },

  // Panel Langues
  languagesPanel: {
    width: 280,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 10,
      },
    }),
  },

  languagesHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  languagesTitle: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
  },

  languageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        ':hover': {
          backgroundColor: theme.colors.backgroundDark,
        },
      },
    }),
  },

  languageItemActive: {
    backgroundColor: theme.colors.primary + '10',
  },

  languageFlag: {
    fontSize: 24,
  },

  languageName: {
    flex: 1,
    fontSize: theme.fonts.sizes.base,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.textPrimary,
  },

  // Panel Profil
  profilePanel: {
    width: 320,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 24,
        elevation: 10,
      },
    }),
  },

  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: theme.spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  profileTitle: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
  },

  profilePhotoSection: {
    alignItems: 'center',
    padding: theme.spacing['2xl'],
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  profileName: {
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    marginTop: theme.spacing.md,
  },

  profileEmail: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textTertiary,
    marginTop: theme.spacing.xs,
  },

  profileMenuList: {
    padding: theme.spacing.sm,
  },

  profileMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        ':hover': {
          backgroundColor: theme.colors.backgroundDark,
        },
      },
    }),
  },

  profileMenuItemDanger: {
    ...Platform.select({
      web: {
        ':hover': {
          backgroundColor: theme.colors.danger + '10',
        },
      },
    }),
  },

  profileMenuText: {
    flex: 1,
    fontSize: theme.fonts.sizes.base,
    fontWeight: theme.fonts.weights.medium,
    color: theme.colors.textPrimary,
  },

  profileDivider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.sm,
  },
});

export default TopBar;

