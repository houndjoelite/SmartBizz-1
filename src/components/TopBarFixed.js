import React, { useState, useEffect, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Platform,
  Image,
  ImageBackground,
  Modal,
  ScrollView,
  ActivityIndicator,
  Alert,
  Dimensions,
  Keyboard,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../styles/theme';
import { useSettings } from '../hooks/useSettings';
import SearchService from '../services/searchService';

/**
 * TopBar SmartBizz - Version fonctionnelle avec vraies données
 * @param {Object} props - Les propriétés du composant
 * @param {Object} props.navigation - L'objet de navigation
 * @param {Object} [props.user] - Les informations de l'utilisateur connecté
 * @param {Function} [props.onMenuPress] - Fonction à appeler lors du clic sur le bouton menu (mobile)
 * @param {boolean} [props.isMobile] - Si l'écran est en mode mobile
 */
export // Chargement du drapeau
const TopBarFixed = ({ navigation, user, onMenuPress, isMobile }) => {
  const { width } = Dimensions.get('window');
  const isTablet = width >= 768 && width < 1024;
  const [searchFocused, setSearchFocused] = useState(false);
  const searchWidth = useMemo(() => {
    if (isMobile) return searchFocused ? '80%' : '70%';
    if (isTablet) return searchFocused ? '60%' : '50%';
    return searchFocused ? '40%' : '30%';
  }, [isMobile, isTablet, searchFocused]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searching, setSearching] = useState(false);
  
  // Charger les vraies notifications
  const { notifications: realNotifications, markNotificationAsRead } = useSettings();
  
  // Compter les notifications non lues
  const unreadCount = realNotifications?.filter(n => !n.read).length || 0;

  // Fonction de recherche réelle
  const handleSearch = async () => {
    if (searchQuery.trim().length < 2) {
      Alert.alert('Recherche', 'Entrez au moins 2 caractères');
      return;
    }

    setSearching(true);
    setShowSearchResults(true);
    
    const result = await SearchService.globalSearch(searchQuery);
    
    if (result.success) {
      setSearchResults(result);
    } else {
      Alert.alert('Erreur', result.error || 'Erreur lors de la recherche');
    }
    
    setSearching(false);
  };

  // Gérer le clic sur une notification
  const handleNotificationPress = async (notification) => {
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
    }
    setShowNotifications(false);
    
    // Navigation vers l'écran approprié si actionUrl existe
    if (notification.actionUrl && navigation) {
      navigation.navigate(notification.actionUrl);
    }
  };

  // Gérer le clic sur un résultat de recherche
  const handleSearchResultPress = (result) => {
    setShowSearchResults(false);
    setSearchQuery('');
    
    if (result.screen && navigation) {
      navigation.navigate(result.screen, { data: result.data });
    }
  };

  // Formater le temps depuis la création de la notification
  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 1) return 'À l\'instant';
    if (diffMins < 60) return `Il y a ${diffMins} min`;
    if (diffHours < 24) return `Il y a ${diffHours}h`;
    if (diffDays < 7) return `Il y a ${diffDays}j`;
    return date.toLocaleDateString('fr-FR');
  };

  // Obtenir l'icône et la couleur selon le type de notification
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success': return { icon: 'checkmark-circle', color: theme.colors.success };
      case 'warning': return { icon: 'warning', color: theme.colors.warning };
      case 'error': return { icon: 'close-circle', color: theme.colors.danger };
      default: return { icon: 'information-circle', color: theme.colors.primary };
    }
  };

  // Animation de la barre de recherche
  const searchAnim = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.timing(searchAnim, {
      toValue: searchFocused ? 1 : 0,
      duration: 200,
      easing: Easing.inOut(Easing.ease),
      useNativeDriver: false,
    }).start();
  }, [searchFocused, searchAnim]);

  const searchContainerStyle = {
    width: searchAnim.interpolate({
      inputRange: [0, 1],
      outputRange: [
        isMobile ? '70%' : isTablet ? '50%' : '30%',
        isMobile ? '85%' : isTablet ? '70%' : '50%',
      ],
    }),
  };

  return (
    <View style={[styles.topBar, isMobile && styles.topBarMobile]}>
      {/* Section Gauche - Logo + Recherche */}
      <View style={styles.leftSection}>
        {/* Bouton menu sur mobile */}
        {isMobile && (
          <TouchableOpacity 
            style={styles.menuButton}
            onPress={onMenuPress}
          >
            <Ionicons name="menu" size={24} color={theme.colors.textPrimary} />
          </TouchableOpacity>
        )}

        {/* Logo supprimé selon la demande */}

        {/* Barre de recherche */}
        <Animated.View 
          style={[
            styles.searchContainer,
            searchContainerStyle,
            isMobile && styles.searchContainerMobile,
          ]}
        >
          <Ionicons 
            name="search" 
            size={18} 
            color={theme.colors.textSecondary} 
            style={styles.searchIcon} 
          />
          <TextInput
            style={styles.searchInput}
            placeholder={isMobile ? "Rechercher..." : "Rechercher des produits, commandes..."}
            placeholderTextColor={theme.colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {searchFocused && (
            <TouchableOpacity 
              style={styles.searchCancel}
              onPress={() => {
                setSearchQuery('');
                setSearchFocused(false);
                Keyboard.dismiss();
              }}
            >
              <Ionicons 
                name="close-circle" 
                size={18} 
                color={theme.colors.textTertiary} 
              />
            </TouchableOpacity>
          )}
        </Animated.View>
      </View>

      {/* Section Centre - Menu Items (caché sur mobile) */}
      {!isMobile && (
        <View style={styles.centerSection}>
          <TouchableOpacity 
            style={styles.menuItem}
            onPress={() => navigation?.navigate('Settings')}
          >
            <Ionicons 
              name="settings-outline" 
              size={18} 
              color={theme.colors.textSecondary} 
              style={{ marginRight: 6 }} 
            />
            <Text style={styles.menuText}>Paramètres</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Section Droite - Icons + Profile */}
      <View style={[styles.rightSection, isMobile && styles.rightSectionMobile]}>
        {/* Icons - Cachés sur mobile quand la recherche est active */}
        {(!isMobile || !searchFocused) && (
          <>
            {/* Applications - Caché sur mobile */}
            {!isMobile && (
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => navigation?.navigate('Dashboard')}
              >
                <Ionicons 
                  name="apps" 
                  size={20} 
                  color={theme.colors.textSecondary} 
                />
              </TouchableOpacity>
            )}

            {/* Messages - Caché sur mobile */}
            {!isMobile && (
              <TouchableOpacity 
                style={styles.iconButton}
                onPress={() => navigation?.navigate('Messages')}
              >
                <Ionicons 
                  name="chatbubble-ellipses-outline" 
                  size={20} 
                  color={theme.colors.textSecondary} 
                />
              </TouchableOpacity>
            )}

            {/* Notifications */}
            <TouchableOpacity 
              style={styles.iconButton}
              onPress={() => setShowNotifications(true)}
            >
              <View>
                <Ionicons 
                  name="notifications-outline" 
                  size={20} 
                  color={theme.colors.textSecondary} 
                />
                {unreadCount > 0 && (
                  <View style={styles.notificationBadge}>
                    <Text style={styles.notificationBadgeText}>
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>

{/* Calendrier - Caché sur mobile */}
            {!isMobile && (
              <TouchableOpacity style={styles.iconButton}>
                <Ionicons 
                  name="calendar-outline" 
                  size={20} 
                  color={theme.colors.textSecondary} 
                />
              </TouchableOpacity>
            )}

            {/* Séparateur - Caché sur mobile */}
            {!isMobile && <View style={styles.separator} />}

            {/* Profil utilisateur */}
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => navigation?.navigate('ProfileSettings')}
            >
              {user?.photoURL ? (
                <Image 
                  source={{ uri: user.photoURL }} 
                  style={styles.avatar} 
                />
              ) : (
                <View style={styles.avatarPlaceholder}>
                  <Ionicons 
                    name="person" 
                    size={20} 
                    color={theme.colors.textSecondary} 
                  />
                </View>
              )}
              {!isMobile && (
                <View style={styles.profileInfo}>
                  <Text 
                    style={styles.profileName} 
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {user?.displayName || user?.email?.split('@')[0] || 'Utilisateur'}
                  </Text>
                  <Text style={styles.profileRole} numberOfLines={1}>
                    {user?.role || 'Utilisateur'}
                  </Text>
                </View>
              )}
              <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </>
        )}
      </View>

      {/* Modal Notifications */}
      <Modal
        visible={showNotifications}
        transparent
        animationType="slide"
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
              <TouchableOpacity 
                style={styles.markAllReadButton}
                onPress={() => {
                  // Marquer toutes les notifications comme lues
                  realNotifications?.forEach(notif => {
                    if (!notif.read) markNotificationAsRead(notif.id);
                  });
                }}
              >
                <Text style={styles.markAllReadText}>Tout marquer comme lu</Text>
              </TouchableOpacity>
            </View>

            {!realNotifications || realNotifications.length === 0 ? (
              <View style={styles.emptyNotifications}>
                <Ionicons 
                  name="notifications-off-outline" 
                  size={48} 
                  color={theme.colors.textTertiary} 
                  style={styles.emptyIcon}
                />
                <Text style={styles.emptyText}>Aucune notification</Text>
              </View>
            ) : (
              <ScrollView style={styles.notificationsList}>
                {realNotifications.map((notification) => (
                  <TouchableOpacity
                    key={notification.id}
                    style={[
                      styles.notificationItem,
                      !notification.read && styles.unreadNotification,
                    ]}
                    onPress={() => handleNotificationPress(notification)}
                  >
                    <View style={styles.notificationIconContainer}>
                      <Ionicons
                        name={getNotificationIcon(notification.type).icon}
                        size={20}
                        color={getNotificationIcon(notification.type).color}
                      />
                    </View>
                    <View style={styles.notificationContent}>
                      <Text style={styles.notificationText}>
                        {notification.message}
                      </Text>
                      <Text style={styles.notificationTime}>
                        {getTimeAgo(notification.timestamp)}
                      </Text>
                    </View>
                    {!notification.read && (
                      <View style={styles.unreadDot} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Résultats de recherche */}
      <Modal
        visible={showSearchResults}
        transparent
        animationType="slide"
        onRequestClose={() => setShowSearchResults(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowSearchResults(false)}
        >
          <View style={styles.searchPanel}>
            <View style={styles.searchHeader}>
              <Text style={styles.searchTitle}>
                Résultats de recherche {searchResults?.totalResults > 0 && `(${searchResults.totalResults})`}
              </Text>
              <TouchableOpacity 
                style={styles.closeButton}
                onPress={() => setShowSearchResults(false)}
              >
                <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {searching ? (
              <View style={styles.searchLoading}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.searchLoadingText}>Recherche en cours...</Text>
              </View>
            ) : (
              <ScrollView style={styles.searchList}>
                {searchResults?.results ? (
                  <>
                    {searchResults.results.products?.length > 0 && (
                      <View style={styles.searchSection}>
                        <Text style={styles.searchSectionTitle}>Produits</Text>
                        {searchResults.results.products.map((product) => (
                          <TouchableOpacity
                            key={`product-${product.id}`}
                            style={styles.searchItem}
                            onPress={() => handleSearchResultPress({
                              screen: 'ProductDetail',
                              data: { productId: product.id }
                            })}
                          >
                            <Ionicons 
                              name="cube-outline" 
                              size={20} 
                              color={theme.colors.textSecondary} 
                              style={styles.searchItemIcon}
                            />
                            <View style={styles.searchItemTextContainer}>
                              <Text style={styles.searchItemTitle} numberOfLines={1}>
                                {product.name}
                              </Text>
                              <Text style={styles.searchItemSubtitle} numberOfLines={1}>
                                Référence: {product.reference}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {searchResults.results.customers?.length > 0 && (
                      <View style={styles.searchSection}>
                        <Text style={styles.searchSectionTitle}>Clients</Text>
                        {searchResults.results.customers.map((customer) => (
                          <TouchableOpacity
                            key={`customer-${customer.id}`}
                            style={styles.searchItem}
                            onPress={() => handleSearchResultPress({
                              screen: 'CustomerDetail',
                              data: { customerId: customer.id }
                            })}
                          >
                            <Ionicons 
                              name="person-outline" 
                              size={20} 
                              color={theme.colors.textSecondary} 
                              style={styles.searchItemIcon}
                            />
                            <View style={styles.searchItemTextContainer}>
                              <Text style={styles.searchItemTitle} numberOfLines={1}>
                                {customer.name}
                              </Text>
                              <Text style={styles.searchItemSubtitle} numberOfLines={1}>
                                {customer.email}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}

                    {searchResults.results.orders?.length > 0 && (
                      <View style={styles.searchSection}>
                        <Text style={styles.searchSectionTitle}>Commandes</Text>
                        {searchResults.results.orders.map((order) => (
                          <TouchableOpacity
                            key={`order-${order.id}`}
                            style={styles.searchItem}
                            onPress={() => handleSearchResultPress({
                              screen: 'OrderDetail',
                              data: { orderId: order.id }
                            })}
                          >
                            <Ionicons 
                              name="document-text-outline" 
                              size={20} 
                              color={theme.colors.textSecondary} 
                              style={styles.searchItemIcon}
                            />
                            <View style={styles.searchItemTextContainer}>
                              <Text style={styles.searchItemTitle} numberOfLines={1}>
                                Commande #{order.reference}
                              </Text>
                              <Text style={styles.searchItemSubtitle} numberOfLines={1}>
                                {order.customerName} • {order.date}
                              </Text>
                            </View>
                            <Text style={[
                              styles.orderStatus,
                              order.status === 'completed' && styles.orderStatusCompleted,
                              order.status === 'pending' && styles.orderStatusPending,
                              order.status === 'cancelled' && styles.orderStatusCancelled,
                            ]}>
                              {order.status === 'completed' ? 'Terminée' : 
                               order.status === 'pending' ? 'En attente' : 'Annulée'}
                            </Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </>
                ) : (
                  <View style={styles.noResults}>
                    <Ionicons 
                      name="search-outline" 
                      size={48} 
                      color={theme.colors.textTertiary} 
                      style={styles.noResultsIcon}
                    />
                    <Text style={styles.noResultsText}>
                      Aucun résultat trouvé pour "{searchQuery}"
                    </Text>
                    <Text style={styles.noResultsSubtext}>
                      Essayez avec d'autres termes de recherche
                    </Text>
                  </View>
                )}
              </ScrollView>
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: theme.colors.border,
    ...Platform.select({
      web: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 64,
      },
      default: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        height: 60,
      },
    }),
  },
  topBarMobile: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  // Section Gauche
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  iconButton: {
    padding: 8,
    marginLeft: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  flagButton: {
    padding: 8,
    marginLeft: 4,
    borderRadius: 20,
    overflow: 'hidden',
  },
  flagContainer: {
    width: 24,
    height: 16,
    borderRadius: 2,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  flagStripe: {
    flex: 1,
  },
  flagContainer: {
    width: 20,
    height: 16,
    borderRadius: 1,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.1)',
    position: 'relative',
  },
  flagStripe: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: '33.33%',
  },

  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    minWidth: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchContainerMobile: {
    height: 40,
    borderRadius: 20,
  },

  searchIcon: {
    marginRight: 8,
  },

  searchInput: {
    flex: 1,
    height: '100%',
    marginLeft: 8,
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: '500',
    padding: 0,
    margin: 0,
  },
  searchCancel: {
    marginLeft: 8,
    padding: 4,
  },

  // Section Centre
  centerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    ...Platform.select({
      web: {
        display: 'flex',
      },
      default: {
        display: 'none',
      },
    }),
  },

  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    marginHorizontal: 4,
  },

  menuText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary,
    marginRight: 4,
  },

  badge: {
    backgroundColor: theme.colors.danger,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 6,
  },

  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  // Section Droite
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 'auto',
  },
  rightSectionMobile: {
    marginLeft: 8,
  },

  iconButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
    borderRadius: 6,
    position: 'relative',
  },

  notificationBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: theme.colors.danger,
    borderRadius: 10,
    minWidth: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: theme.colors.surface,
  },

  notificationBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
  },

  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    padding: 4,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  avatarPlaceholder: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },

  profileInfo: {
    marginRight: 8,
    maxWidth: 120,
  },

  profileName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },

  profileRole: {
    fontSize: 11,
    color: theme.colors.textSecondary,
  },

  // Styles pour les modals
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    paddingTop: 64, // Hauteur de la TopBar
    paddingRight: 20,
  },

  // Styles Notifications Panel
  notificationsPanel: {
    width: 380,
    maxHeight: 500,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    }),
  },

  notificationsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  notificationsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },

  notificationsList: {
    maxHeight: 400,
  },

  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  notificationUnread: {
    backgroundColor: theme.colors.primary + '08',
  },

  notifIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },

  notifContent: {
    flex: 1,
  },

  notifTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },

  notifMessage: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },

  notifTime: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginTop: 6,
  },

  // Styles Search Panel
  searchPanel: {
    width: 500,
    maxHeight: 600,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      },
    }),
  },

  searchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  searchTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },

  searchLoading: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  searchLoadingText: {
    marginTop: 12,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },

  searchList: {
    maxHeight: 500,
  },

  searchSection: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  searchSectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 12,
  },

  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: theme.colors.background,
  },

  searchItemContent: {
    flex: 1,
    marginLeft: 12,
  },

  searchItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },

  searchItemSubtitle: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },

  // Empty states
  emptyState: {
    padding: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },

  emptyText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },

  emptySubtext: {
    marginTop: 4,
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
});

export default TopBarFixed;

