import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSales } from '../hooks/useSales';
import { useProducts } from '../hooks/useProducts';
import { RevenueChart } from '../components/RevenueChart';
import { TargetedSales } from '../components/TargetedSales';
import { ActiveUsers } from '../components/ActiveUsers';
import { TopProducts } from '../components/TopProducts';
import { PerformanceCard } from '../components/PerformanceCard';
import theme from '../styles/theme';

const isWeb = Platform.OS === 'web';

const SalesAnalyticsScreen = ({ navigation, route }) => {
  const { sales, stats } = useSales();
  const { stats: inventoryStats } = useProducts();

  // Calculer les statistiques pour les cartes
  const totalRevenue = stats?.totalRevenue || 0;
  const totalSales = stats?.totalSales || 0;
  const averageSale = totalSales > 0 ? totalRevenue / totalSales : 0;

  // Calculer les revenus RÉELS par mois depuis les ventes Firebase
  const calculateMonthlyRevenue = () => {
    if (!sales || sales.length === 0) {
      return {
        labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil'],
        datasets: [
          {
            data: [0, 0, 0, 0, 0, 0, 0],
            color: (opacity = 1) => `rgba(233, 30, 99, ${opacity})`,
            strokeWidth: 3,
          },
        ],
      };
    }

    const currentYear = new Date().getFullYear();
    const monthNames = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Aoû', 'Sep', 'Oct', 'Nov', 'Déc'];
    const monthlyData = new Array(12).fill(0);
    const monthlyCount = new Array(12).fill(0);

    // Calculer les revenus par mois
    sales.forEach(sale => {
      const saleDate = new Date(sale.createdAt);
      if (saleDate.getFullYear() === currentYear) {
        const month = saleDate.getMonth();
        monthlyData[month] += sale.totalAmount || 0;
        monthlyCount[month] += 1;
      }
    });

    // Prendre les 7 derniers mois
    const currentMonth = new Date().getMonth();
    const last7Months = [];
    const last7Labels = [];
    const last7Counts = [];

    for (let i = 6; i >= 0; i--) {
      const monthIndex = (currentMonth - i + 12) % 12;
      last7Months.push(monthlyData[monthIndex]);
      last7Labels.push(monthNames[monthIndex]);
      last7Counts.push(monthlyCount[monthIndex]);
    }

    return {
      labels: last7Labels,
      datasets: [
        {
          data: last7Months.length > 0 ? last7Months : [0, 0, 0, 0, 0, 0, 0],
          color: (opacity = 1) => `rgba(233, 30, 99, ${opacity})`, // Rose - Revenus
          strokeWidth: 3,
        },
        {
          data: last7Counts.map(count => count * 1000), // Nombre de ventes × 1000 pour visualisation
          color: (opacity = 1) => `rgba(244, 67, 54, ${opacity})`, // Rouge - Nombre de ventes
          strokeWidth: 3,
        },
      ],
    };
  };

  const chartData = calculateMonthlyRevenue();

  // Calculer les VRAIES ventes ciblées depuis les données Firebase
  const calculateTargetedSales = () => {
    // Objectifs mensuels (peuvent être configurés)
    const objectifVentes = 50; // Objectif: 50 ventes par mois
    const objectifClients = 30; // Objectif: 30 clients uniques par mois
    const objectifProduits = 100; // Objectif: 100 produits en stock

    // Calculer le nombre de ventes ce mois
    const currentMonth = new Date().getMonth();
    const salesThisMonth = sales?.filter(s => 
      new Date(s.createdAt).getMonth() === currentMonth
    ).length || 0;

    // Calculer le nombre de clients uniques ce mois
    const uniqueCustomers = new Set(
      sales?.filter(s => new Date(s.createdAt).getMonth() === currentMonth)
        .map(s => s.customerName)
        .filter(Boolean)
    ).size;

    // Nombre de produits en stock
    const productsInStock = inventoryStats?.totalProducts || 0;

    return [
      { 
        label: 'Ventes', 
        percentage: Math.min(Math.round((salesThisMonth / objectifVentes) * 100), 100),
        color: '#00BCD4',
        actual: salesThisMonth,
        target: objectifVentes,
      },
      { 
        label: 'Clients', 
        percentage: Math.min(Math.round((uniqueCustomers / objectifClients) * 100), 100),
        color: '#FFA726',
        actual: uniqueCustomers,
        target: objectifClients,
      },
      { 
        label: 'Produits', 
        percentage: Math.min(Math.round((productsInStock / objectifProduits) * 100), 100),
        color: '#4CAF50',
        actual: productsInStock,
        target: objectifProduits,
      },
    ];
  };

  const targetedSalesData = calculateTargetedSales();

  // Calculer les VRAIS clients actifs depuis les ventes Firebase
  const calculateActiveUsers = () => {
    if (!sales || sales.length === 0) return [];

    // Grouper les ventes par client
    const customerData = {};
    
    sales.forEach(sale => {
      const customerName = sale.customerName || 'Client Anonyme';
      if (!customerData[customerName]) {
        customerData[customerName] = {
          name: customerName,
          totalPurchases: 0,
          totalAmount: 0,
          itemsCount: 0,
          lastPurchase: sale.createdAt,
          purchases: [],
        };
      }
      
      customerData[customerName].totalPurchases += 1;
      customerData[customerName].totalAmount += sale.totalAmount || 0;
      customerData[customerName].itemsCount += sale.items?.length || 0;
      customerData[customerName].purchases.push(sale.totalAmount || 0);
      
      // Garder la dernière date d'achat
      if (new Date(sale.createdAt) > new Date(customerData[customerName].lastPurchase)) {
        customerData[customerName].lastPurchase = sale.createdAt;
      }
    });

    // Convertir en tableau et trier par montant total
    const customersArray = Object.values(customerData)
      .sort((a, b) => b.totalAmount - a.totalAmount)
      .slice(0, 10); // Top 10 clients

    // Formater pour l'affichage
    return customersArray.map((customer, index) => {
      // Calculer la tendance basée sur les 3 derniers achats
      const recentPurchases = customer.purchases.slice(-3);
      let trend = 'neutral';
      if (recentPurchases.length >= 2) {
        const isIncreasing = recentPurchases[recentPurchases.length - 1] > recentPurchases[0];
        const isDecreasing = recentPurchases[recentPurchases.length - 1] < recentPurchases[0];
        trend = isIncreasing ? 'up' : isDecreasing ? 'down' : 'neutral';
      }

      // Déterminer le statut selon le montant total
      let status = 'STANDARD';
      let statusColor = '#00BCD4';
      if (customer.totalAmount > 100000) {
        status = 'VIP';
        statusColor = '#FFA726';
      } else if (customer.totalAmount > 50000) {
        status = 'PREMIUM';
        statusColor = '#4CAF50';
      } else if (customer.totalAmount > 20000) {
        status = 'ACTIF';
        statusColor = '#2196F3';
      }

      // Calculer les jours depuis le dernier achat
      const daysSinceLastPurchase = Math.floor(
        (new Date() - new Date(customer.lastPurchase)) / (1000 * 60 * 60 * 24)
      );

      return {
        id: `#${(index + 1).toString().padStart(3, '0')}`,
        name: customer.name,
        description: `${customer.totalPurchases} achat${customer.totalPurchases > 1 ? 's' : ''} • ${customer.itemsCount} articles • ${daysSinceLastPurchase}j`,
        city: 'Cotonou',
        status,
        statusColor,
        avatar: null,
        trend,
        totalAmount: customer.totalAmount,
        totalPurchases: customer.totalPurchases,
      };
    });
  };

  const activeUsersData = calculateActiveUsers();

  // Calculer les produits les plus vendus depuis les vraies ventes
  const calculateTopProducts = () => {
    if (!sales || sales.length === 0) return [];

    // Comptabiliser les ventes par produit
    const productSales = {};
    
    sales.forEach(sale => {
      if (sale.items && Array.isArray(sale.items)) {
        sale.items.forEach(item => {
          const productId = item.productId || item.productName;
          if (productId) {
            if (!productSales[productId]) {
              productSales[productId] = {
                name: item.productName || 'Produit',
                category: item.category || 'Général',
                price: item.price || 0,
                image: item.image || null,
                totalSold: 0,
                revenue: 0,
                stock: item.stock || 0,
              };
            }
            productSales[productId].totalSold += item.quantity || 1;
            productSales[productId].revenue += (item.price || 0) * (item.quantity || 1);
          }
        });
      }
    });

    // Convertir en tableau et trier par quantité vendue
    const productsArray = Object.values(productSales)
      .sort((a, b) => b.totalSold - a.totalSold)
      .slice(0, 5) // Top 5
      .map(product => ({
        ...product,
        // Calculer la popularité (1-5 étoiles) basée sur les ventes
        popularity: Math.min(Math.ceil(product.totalSold / 10), 5),
      }));

    return productsArray;
  };

  const topProducts = calculateTopProducts();

  return (
    <ScrollView style={styles.container}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Ionicons name="bar-chart" size={24} color={theme.colors.primary} style={styles.headerIcon} />
          <View>
            <Text style={styles.headerTitle}>Tableau de bord du commerce</Text>
          </View>
        </View>
      </View>

      {/* Graphique de revenus */}
      <View style={styles.section}>
        <RevenueChart data={chartData} />
        <TargetedSales sales={targetedSalesData} />
      </View>

      {/* Cartes de statistiques - VRAIES DONNÉES */}
      <View style={styles.statsCards}>
        <View style={styles.statCard}>
          <PerformanceCard
            icon="people"
            iconBg="#E3F2FD"
            iconColor="#2196F3"
            title="Clients Uniques"
            value={activeUsersData.length > 0 ? activeUsersData.length.toString() : '0'}
            subtitle={`${totalSales} ventes au total`}
            subtitleColor={theme.colors.primary}
            trend="up"
          />
        </View>

        <View style={styles.statCard}>
          <PerformanceCard
            icon="cart"
            iconBg="#E8F5E9"
            iconColor="#4CAF50"
            title="Transactions"
            value={totalSales.toString()}
            subtitle={`${(totalRevenue / 1000).toFixed(1)} K FCFA`}
            subtitleColor={theme.colors.success}
            trend="up"
          />
        </View>

        <View style={styles.statCard}>
          <PerformanceCard
            icon="receipt"
            iconBg="#FCE4EC"
            iconColor="#E91E63"
            title="Revenu Moyen"
            value={`${(averageSale / 1000).toFixed(1)} K`}
            subtitle="Par vente"
            subtitleColor={theme.colors.danger}
            trend="up"
          />
        </View>

        <View style={styles.statCard}>
          <PerformanceCard
            icon="cash"
            iconBg="#FFF3E0"
            iconColor="#FF9800"
            title="Revenus Totaux"
            value={`${(totalRevenue / 1000).toFixed(1)} K`}
            subtitle="FCFA"
            subtitleColor={theme.colors.warning}
            trend="up"
          />
        </View>
      </View>

      {/* Utilisateurs actifs */}
      <View style={styles.section}>
        <ActiveUsers users={activeUsersData} />
      </View>

      {/* Produits les plus populaires */}
      <View style={styles.section}>
        <TopProducts products={topProducts} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  // En-tête
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  headerLeft: {
    flex: 1,
    flexDirection: 'row',
  },

  headerIcon: {
    marginRight: 12,
    marginTop: 2,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },

  // Sections
  section: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },

  // Cartes de statistiques
  statsCards: {
    flexDirection: isWeb ? 'row' : 'column',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 16,
  },

  statCard: {
    flex: isWeb ? 1 : undefined,
    minWidth: isWeb ? 220 : undefined,
  },
});

export default SalesAnalyticsScreen;

