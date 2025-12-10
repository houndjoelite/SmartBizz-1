import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSettings } from '../../hooks/useSettings';
import { Ionicons } from '@expo/vector-icons';

const AccountStatsScreen = ({ navigation }) => {
  const { accountStats, settings, loading, refreshAll } = useSettings();
  const [initialLoading, setInitialLoading] = React.useState(true);

  useEffect(() => {
    console.log('📊 AccountStatsScreen monté');
    const loadData = async () => {
      if (refreshAll) {
        console.log('🔄 Chargement des stats...');
        await refreshAll();
      }
      setInitialLoading(false);
      console.log('✅ Stats chargées:', accountStats);
    };
    loadData();
  }, []);

  if (initialLoading || loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement des statistiques...</Text>
      </View>
    );
  }

  // Si pas de stats après chargement, afficher un message
  if (!accountStats) {
    return (
      <View style={styles.container}>
        {/* Ancien header - Commenté
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.backButton}>← Retour</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Statistiques du compte</Text>
          <View style={{ width: 80 }} />
        </View>
        */}

        {/* Nouveau header visible */}
        <View style={styles.newHeader}>
          <TouchableOpacity 
            onPress={() => navigation.navigate('Settings')}
            style={styles.newBackButton}
          >
            <Ionicons name="chevron-back" size={18} color="#ffffff" />
            <Text style={styles.newBackButtonText}>Retour</Text>
          </TouchableOpacity>
          <Text style={styles.newHeaderTitle}>Statistiques du compte</Text>
        </View>
        <View style={styles.centerContainer}>
          <Text style={styles.emptyIcon}>📊</Text>
          <Text style={styles.emptyTitle}>Pas encore de statistiques</Text>
          <Text style={styles.emptyText}>
            Commencez à utiliser l'application pour voir vos statistiques
          </Text>
        </View>
      </View>
    );
  }

  const stats = [
    {
      title: 'Produits',
      items: [
        { label: 'Total produits', value: accountStats.totalProducts, color: '#3b82f6' },
        { label: 'En stock', value: accountStats.productsInStock, color: '#10b981' },
        { label: 'Stock bas', value: accountStats.lowStockProducts, color: '#f59e0b' },
        { label: 'Rupture', value: accountStats.outOfStockProducts, color: '#ef4444' },
      ],
    },
    {
      title: 'Ventes',
      items: [
        { label: 'Total ventes', value: accountStats.totalSales, color: '#3b82f6' },
        { label: 'Revenu total', value: `${accountStats.totalRevenue.toLocaleString()} FCFA`, color: '#10b981' },
        { label: 'Bénéfice estimé', value: `${accountStats.totalProfit.toLocaleString()} FCFA`, color: '#8b5cf6' },
      ],
    },
    {
      title: 'Clients',
      items: [
        { label: 'Total clients', value: accountStats.totalClients, color: '#3b82f6' },
        { label: 'Clients actifs', value: accountStats.activeClients, color: '#10b981' },
      ],
    },
    {
      title: 'Compte',
      items: [
        { label: 'Plan', value: settings?.subscription?.plan || 'Gratuit', color: '#3b82f6' },
        { label: 'Statut', value: settings?.subscription?.status === 'active' ? 'Actif' : 'Inactif', color: '#10b981' },
        { label: 'Âge du compte', value: `${accountStats.accountAge} jour(s)`, color: '#6b7280' },
      ],
    },
  ];

  return (
    <View style={styles.container}>
      {/* Ancien header - Commenté
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Statistiques du compte</Text>
        <View style={{ width: 80 }} />
      </View>
      */}

      {/* Nouveau header visible */}
      <View style={styles.newHeader}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Settings')}
          style={styles.newBackButton}
        >
          <Ionicons name="chevron-back" size={18} color="#ffffff" />
          <Text style={styles.newBackButtonText}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.newHeaderTitle}>Statistiques du compte</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Vue d'ensemble</Text>
          <Text style={styles.summarySubtitle}>
            Résumé de votre activité depuis la création du compte
          </Text>
        </View>

        {stats.map((section, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.statsGrid}>
              {section.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.statCard}>
                  <Text style={styles.statLabel}>{item.label}</Text>
                  <Text style={[styles.statValue, { color: item.color }]}>
                    {item.value}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  // Anciens styles header - Commentés
  /*
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
  */

  // Nouveaux styles header - Plus visibles et simples
  newHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  newBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    marginRight: 15,
  },
  newBackButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 4,
  },
  newHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  summaryCard: {
    backgroundColor: '#3b82f6',
    padding: 24,
    borderRadius: 16,
    marginBottom: 24,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 8,
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#bfdbfe',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    maxWidth: 280,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  statLabel: {
    fontSize: 13,
    color: '#6b7280',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
  },
});

export default AccountStatsScreen;

