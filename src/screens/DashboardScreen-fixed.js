import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AuthService from '../services/authService';
import { useSales } from '../hooks/useSales';
import { useProducts } from '../hooks/useProducts';
import { PerformanceCard } from '../components/PerformanceCard';
import { Timeline } from '../components/Timeline';
import theme from '../styles/theme';

const isWeb = Platform.OS === 'web';
const isMobile = () => {
  const { width } = Dimensions.get('window');
  return width < 768;
};

const DashboardScreen = ({ navigation, route }) => {
  const [user, setUser] = useState(null);
  const { stats, sales } = useSales();
  const { stats: inventoryStats, products } = useProducts();
  
  // Données de démonstration pour les tâches
  const [tasksList, setTasksList] = useState([
    { id: 1, title: 'Vérifier le stock', completed: false },
    { id: 2, title: 'Mettre à jour les prix', completed: true },
    { id: 3, title: 'Préparer le rapport mensuel', completed: false },
  ]);
  
  // Données de démonstration pour la timeline
  const [timelineItems, setTimelineItems] = useState([
    { id: 1, time: '09:30', title: 'Nouvelle vente', description: 'Vente #1234 - 150,00 €', color: theme.colors.success, icon: 'cash' },
    { id: 2, time: '11:45', title: 'Stock bas', description: 'Produit #5678 - Seulement 2 restants', color: theme.colors.warning, icon: 'warning' },
    { id: 3, time: '14:20', title: 'Mise à jour', description: 'Nouvelle version de l\'application disponible', color: theme.colors.primary, icon: 'refresh' },
  ]);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // Calculer les statistiques réelles de l'application
  const totalRevenue = stats?.totalRevenue || 0;
  const totalSales = stats?.totalSales || 0;
  const totalProducts = inventoryStats?.totalProducts || 0;
  const lowStockCount = inventoryStats?.lowStockCount || 0;
  const totalValue = inventoryStats?.totalValue || 0;

  // Calculer le taux de croissance des ventes (comparer ce mois vs mois dernier)
  const currentMonth = new Date().getMonth();
  const salesThisMonth = sales?.filter(s => new Date(s.createdAt).getMonth() === currentMonth).length || 0;
  const salesLastMonth = sales?.filter(s => new Date(s.createdAt).getMonth() === currentMonth - 1).length || 0;
  const growthRate = salesLastMonth > 0 ? (((salesThisMonth - salesLastMonth) / salesLastMonth) * 100).toFixed(1) : 0;

  return (
    <ScrollView style={styles.wrapper}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* En-tête */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bonjour, {user?.displayName || 'Utilisateur'}</Text>
          <Text style={styles.date}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</Text>
        </View>
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications-outline" size={24} color={theme.colors.textPrimary} />
        </TouchableOpacity>
      </View>

      {/* Cartes de performance */}
      <View style={styles.performanceHeader}>
        <Text style={styles.performanceTitle}>Performance de l'Entreprise</Text>
        <View style={[styles.dropdown, isMobile() && styles.dropdownMobile]}>
          <Text style={styles.dropdownText}>Ce mois-ci</Text>
          <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
        </View>
      </View>

      <View style={[styles.performanceCards, isMobile() && styles.performanceCardsMobile]}>
        <View style={[styles.performanceCardWrapper, isMobile() && styles.performanceCardWrapperMobile]}>
          <PerformanceCard
            icon="cash"
            iconBg="#FFF3E0"
            iconColor="#FF9800"
            title="Revenus totaux"
            value={`${(totalRevenue / 1000).toFixed(1)} K`}
            subtitle={`${growthRate}% ce mois`}
            subtitleColor={growthRate >= 0 ? theme.colors.success : theme.colors.danger}
            trend={growthRate >= 0 ? 'up' : 'down'}
          />
        </View>
        
        <View style={[styles.performanceCardWrapper, isMobile() && styles.performanceCardWrapperMobile]}>
          <PerformanceCard
            icon="cart"
            iconBg="#E3F2FD"
            iconColor="#2196F3"
            title="Ventes réalisées"
            value={totalSales.toString()}
            subtitle="+12% ce mois"
            subtitleColor={theme.colors.success}
            trend="up"
          />
        </View>
        
        <View style={[styles.performanceCardWrapper, isMobile() && styles.performanceCardWrapperMobile]}>
          <PerformanceCard
            icon="cube"
            iconBg="#E8F5E9"
            iconColor="#4CAF50"
            title="Valeur de l'inventaire"
            value={`${(totalValue / 1000).toFixed(1)} K`}
            subtitle={`${totalProducts} produits`}
            subtitleColor={theme.colors.primary}
            trend="up"
          />
        </View>
      </View>

      {/* Bouton Voir le rapport complet */}
      <TouchableOpacity 
        style={[styles.reportButton, isMobile() && styles.reportButtonMobile]}
        onPress={() => navigation.navigate('Sales')}
      >
        <Ionicons name="eye-outline" size={20} color="#FFFFFF" style={styles.reportIcon} />
        <Text style={styles.reportButtonText}>Voir le rapport complet</Text>
      </TouchableOpacity>

      {/* Section inférieure - Tâches & Activités */}
      <View style={[
        styles.bottomSection, 
        isMobile() && styles.bottomSectionMobile
      ]}>
        {/* Liste des Tâches */}
        <View style={[
          styles.supportCard, 
          isMobile() && styles.supportCardMobile,
          { flex: isMobile() ? undefined : 1 }
        ]}>
          <View style={styles.cardHeader}>
            <Ionicons name="list" size={20} color={theme.colors.primary} />
            <Text style={styles.cardTitle}>Liste Des Tâches</Text>
            <View style={styles.cardHeaderRight}>
              <TouchableOpacity onPress={() => navigation.navigate('Inventory')}>
                <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.tasksContent}>
            {tasksList.map((task) => (
              <View key={task.id} style={styles.taskItem}>
                <TouchableOpacity style={styles.taskCheckbox}>
                  {task.completed ? (
                    <Ionicons name="checkmark-circle" size={20} color={theme.colors.success} />
                  ) : (
                    <View style={styles.taskCheckboxEmpty} />
                  )}
                </TouchableOpacity>
                <View style={styles.taskContent}>
                  <Text style={[styles.taskTitle, task.completed && styles.taskTitleCompleted]}>
                    {task.title}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Activités Récentes */}
        <View style={[
          styles.timelineCard, 
          isMobile() && styles.timelineCardMobile,
          { flex: isMobile() ? undefined : 1 }
        ]}>
          <View style={styles.timelineHeader}>
            <Ionicons 
              name="pulse" 
              size={isMobile() ? 18 : 20} 
              color={theme.colors.success} 
            />
            <Text style={styles.timelineTitle}>Activités Récentes</Text>
            <View style={{ marginLeft: 'auto' }}>
              <TouchableOpacity 
                onPress={() => navigation.navigate('SalesHistory')}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Ionicons 
                  name="ellipsis-horizontal" 
                  size={isMobile() ? 18 : 20} 
                  color={theme.colors.textSecondary} 
                />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.timelineContent}>
            {timelineItems.length > 0 ? (
              <Timeline items={timelineItems} />
            ) : (
              <View style={styles.emptyTimeline}>
                <Ionicons 
                  name="time-outline" 
                  size={isMobile() ? 40 : 48} 
                  color={theme.colors.textSecondary} 
                />
                <Text style={styles.emptyTimelineText}>Aucune activité récente</Text>
                <Text style={styles.emptyTimelineSubtext}>
                  Les ventes et activités apparaîtront ici
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  // Wrapper principal
  wrapper: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  // En-tête
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    ...(isWeb ? {
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    } : {}),
  },
  
  greeting: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  
  date: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Performance
  performanceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  
  performanceTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  dropdownText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginRight: 8,
  },
  
  // Cartes de performance
  performanceCards: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  
  performanceCardsMobile: {
    flexDirection: 'column',
    paddingHorizontal: 12,
  },
  
  performanceCardWrapper: {
    width: '32%',
    marginBottom: 12,
  },
  
  performanceCardWrapperMobile: {
    width: '100%',
    marginBottom: 8,
  },
  
  // Bouton de rapport
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.primary,
    padding: 12,
    marginHorizontal: 16,
    borderRadius: 8,
    marginBottom: 16,
    ...theme.shadows.small,
  },
  
  reportButtonMobile: {
    marginHorizontal: 12,
  },
  
  reportIcon: {
    marginRight: 8,
  },
  
  reportButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // Section inférieure
  bottomSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    paddingHorizontal: 12,
    width: '100%',
  },
  
  bottomSectionMobile: {
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  
  // Carte de support
  supportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginRight: 8,
    marginBottom: 16,
    ...theme.shadows.small,
  },
  
  supportCardMobile: {
    width: '100%',
    marginRight: 0,
  },
  
  // Carte de timeline
  timelineCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: isMobile() ? 12 : 16,
    marginLeft: isMobile() ? 0 : 8,
    ...theme.shadows.small,
  },
  
  timelineCardMobile: {
    width: '100%',
    marginLeft: 0,
    marginTop: 12,
  },
  
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: isMobile() ? 12 : 16,
  },
  
  timelineTitle: {
    fontSize: isMobile() ? 15 : 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginLeft: 8,
  },
  
  timelineContent: {
    flex: 1,
    maxHeight: isMobile() ? 300 : 400,
  },
  
  // En-tête de carte
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginLeft: 8,
    flex: 1,
  },
  
  cardHeaderRight: {
    marginLeft: 'auto',
  },
  
  // Contenu des tâches
  tasksContent: {
    paddingVertical: 8,
  },
  
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  taskCheckbox: {
    marginRight: 12,
  },
  
  taskCheckboxEmpty: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  
  taskContent: {
    flex: 1,
  },
  
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.textPrimary,
  },
  
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: theme.colors.textSecondary,
  },
  
  // Timeline vide
  emptyTimeline: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  
  emptyTimelineText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginTop: 16,
    textAlign: 'center',
  },
  
  emptyTimelineSubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    opacity: 0.8,
  },
});

export default DashboardScreen;
