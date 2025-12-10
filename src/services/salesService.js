import { 
  collection, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  runTransaction
} from 'firebase/firestore';
import { db, auth } from './firebase';
import InventoryService from './inventoryService';

/**
 * Service de gestion des ventes
 * Gère les ventes, statistiques et performances
 */
export class SalesService {
  
  /**
   * Enregistrer une vente
   */
  static async recordSale(saleData) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      // Validation
      if (!saleData.productId) {
        return { success: false, error: 'Produit requis' };
      }
      if (!saleData.quantity || saleData.quantity <= 0) {
        return { success: false, error: 'Quantité invalide' };
      }

      // Utiliser une transaction pour garantir la cohérence
      const result = await runTransaction(db, async (transaction) => {
        // Récupérer le produit
        const productRef = doc(db, `inventory/${user.uid}/products`, saleData.productId);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists()) {
          throw new Error('Produit non trouvé');
        }

        const product = productDoc.data();

        // Vérifier le stock
        if (product.quantity < saleData.quantity) {
          throw new Error(`Stock insuffisant. Disponible: ${product.quantity}`);
        }

        // Calculer le total
        const unitPrice = saleData.unitPrice || product.sellingPrice;
        const total = unitPrice * saleData.quantity;
        const cost = (product.purchasePrice || 0) * saleData.quantity;
        const profit = total - cost;

        // Créer la vente
        const saleId = doc(collection(db, `sales/${user.uid}/transactions`)).id;
        const sale = {
          productId: saleData.productId,
          productName: product.name,
          category: product.category,
          quantity: saleData.quantity,
          unitPrice: unitPrice,
          totalPrice: total,
          cost: cost,
          profit: profit,
          date: saleData.date || serverTimestamp(),
          createdAt: serverTimestamp(),
        };

        const saleRef = doc(db, `sales/${user.uid}/transactions`, saleId);
        transaction.set(saleRef, sale);

        // Mettre à jour le stock
        const newQuantity = product.quantity - saleData.quantity;
        const newStatus = InventoryService.getStockStatus(newQuantity);
        
        transaction.update(productRef, {
          quantity: newQuantity,
          status: newStatus,
          updatedAt: serverTimestamp(),
        });

        return { saleId, sale, newQuantity };
      });

      console.log('✅ Vente enregistrée:', result.saleId);
      return { success: true, ...result };
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement de la vente:', error);
      return { success: false, error: error.message || 'Erreur lors de l\'enregistrement' };
    }
  }

  /**
   * Récupérer toutes les ventes de l'utilisateur
   */
  static async getUserSales(startDate = null, endDate = null) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const salesRef = collection(db, `sales/${user.uid}/transactions`);
      let q = query(salesRef, orderBy('date', 'desc'));

      const querySnapshot = await getDocs(q);
      const sales = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        sales.push({
          id: doc.id,
          ...data,
          date: data.date?.toDate(),
          createdAt: data.createdAt?.toDate(),
        });
      });

      // Filtrer par date si nécessaire
      let filteredSales = sales;
      if (startDate || endDate) {
        filteredSales = sales.filter(sale => {
          const saleDate = sale.date;
          if (startDate && saleDate < startDate) return false;
          if (endDate && saleDate > endDate) return false;
          return true;
        });
      }

      return { success: true, sales: filteredSales };
    } catch (error) {
      console.error('❌ Erreur récupération ventes:', error);
      return { success: false, error: 'Erreur lors de la récupération des ventes' };
    }
  }

  /**
   * Enregistrer une perte
   */
  static async recordLoss(lossData) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      // Validation
      if (!lossData.productId) {
        return { success: false, error: 'Produit requis' };
      }
      if (!lossData.quantity || lossData.quantity <= 0) {
        return { success: false, error: 'Quantité invalide' };
      }
      if (!lossData.reason) {
        return { success: false, error: 'Raison requise' };
      }

      // Transaction pour garantir la cohérence
      const result = await runTransaction(db, async (transaction) => {
        // Récupérer le produit
        const productRef = doc(db, `inventory/${user.uid}/products`, lossData.productId);
        const productDoc = await transaction.get(productRef);

        if (!productDoc.exists()) {
          throw new Error('Produit non trouvé');
        }

        const product = productDoc.data();

        // Vérifier le stock
        if (product.quantity < lossData.quantity) {
          throw new Error(`Stock insuffisant. Disponible: ${product.quantity}`);
        }

        // Créer la perte
        const lossId = doc(collection(db, `losses/${user.uid}/records`)).id;
        const loss = {
          productId: lossData.productId,
          productName: product.name,
          category: product.category,
          quantity: lossData.quantity,
          reason: lossData.reason,
          cost: (product.purchasePrice || 0) * lossData.quantity,
          date: lossData.date || serverTimestamp(),
          createdAt: serverTimestamp(),
        };

        const lossRef = doc(db, `losses/${user.uid}/records`, lossId);
        transaction.set(lossRef, loss);

        // Mettre à jour le stock
        const newQuantity = product.quantity - lossData.quantity;
        const newStatus = InventoryService.getStockStatus(newQuantity);
        
        transaction.update(productRef, {
          quantity: newQuantity,
          status: newStatus,
          updatedAt: serverTimestamp(),
        });

        return { lossId, loss, newQuantity };
      });

      console.log('✅ Perte enregistrée:', result.lossId);
      return { success: true, ...result };
    } catch (error) {
      console.error('❌ Erreur lors de l\'enregistrement de la perte:', error);
      return { success: false, error: error.message || 'Erreur lors de l\'enregistrement' };
    }
  }

  /**
   * Récupérer les pertes
   */
  static async getUserLosses(startDate = null, endDate = null) {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Utilisateur non connecté' };
      }

      const lossesRef = collection(db, `losses/${user.uid}/records`);
      const q = query(lossesRef, orderBy('date', 'desc'));

      const querySnapshot = await getDocs(q);
      const losses = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        losses.push({
          id: doc.id,
          ...data,
          date: data.date?.toDate(),
          createdAt: data.createdAt?.toDate(),
        });
      });

      return { success: true, losses };
    } catch (error) {
      console.error('❌ Erreur récupération pertes:', error);
      return { success: false, error: 'Erreur lors de la récupération des pertes' };
    }
  }

  /**
   * Calculer les statistiques de ventes (VERSION AVANCÉE)
   */
  static calculateSalesStats(sales, losses = [], invoices = []) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const stats = {
      // Totaux
      totalRevenue: 0,
      totalProfit: 0,
      totalSales: sales.length,
      totalProductsSold: 0,
      totalLosses: losses.length,
      totalLossesCost: 0,
      totalInvoices: invoices.length,
      
      // Aujourd'hui
      todayRevenue: 0,
      todaySales: 0,
      todayProductsSold: 0,
      
      // Ce mois
      monthRevenue: 0,
      monthSales: 0,
      monthProfit: 0,
      monthProductsSold: 0,
      
      // Mois précédent
      lastMonthRevenue: 0,
      lastMonthSales: 0,
      lastMonthProfit: 0,
      
      // Comparaison
      revenueGrowth: 0,
      
      // Moyennes
      averageSale: 0,
      averageDailyRevenue: 0,
      
      // Détails
      topProducts: {},
      salesByDay: {},
      salesByMonth: {},
      salesByCategory: {},
      recentEvents: [],
    };

    // Calculer les statistiques de ventes
    sales.forEach(sale => {
      const saleDate = sale.date;
      const totalPrice = sale.totalPrice || 0;
      const profit = sale.profit || 0;
      const quantity = sale.quantity || 0;
      
      // Total
      stats.totalRevenue += totalPrice;
      stats.totalProfit += profit;
      stats.totalProductsSold += quantity;

      // Aujourd'hui
      if (saleDate >= today) {
        stats.todayRevenue += totalPrice;
        stats.todaySales++;
        stats.todayProductsSold += quantity;
      }

      // Ce mois
      if (saleDate >= thisMonth) {
        stats.monthRevenue += totalPrice;
        stats.monthSales++;
        stats.monthProfit += profit;
        stats.monthProductsSold += quantity;
      }

      // Mois précédent
      if (saleDate >= lastMonth && saleDate <= endOfLastMonth) {
        stats.lastMonthRevenue += totalPrice;
        stats.lastMonthSales++;
        stats.lastMonthProfit += profit;
      }

      // Produits les plus vendus
      if (!stats.topProducts[sale.productId]) {
        stats.topProducts[sale.productId] = {
          name: sale.productName,
          quantity: 0,
          revenue: 0,
        };
      }
      stats.topProducts[sale.productId].quantity += quantity;
      stats.topProducts[sale.productId].revenue += totalPrice;

      // Ventes par jour
      const dayKey = saleDate.toISOString().split('T')[0];
      if (!stats.salesByDay[dayKey]) {
        stats.salesByDay[dayKey] = { revenue: 0, quantity: 0, count: 0 };
      }
      stats.salesByDay[dayKey].revenue += totalPrice;
      stats.salesByDay[dayKey].quantity += quantity;
      stats.salesByDay[dayKey].count++;

      // Ventes par mois
      const monthKey = `${saleDate.getFullYear()}-${String(saleDate.getMonth() + 1).padStart(2, '0')}`;
      if (!stats.salesByMonth[monthKey]) {
        stats.salesByMonth[monthKey] = { revenue: 0, quantity: 0, count: 0 };
      }
      stats.salesByMonth[monthKey].revenue += totalPrice;
      stats.salesByMonth[monthKey].quantity += quantity;
      stats.salesByMonth[monthKey].count++;

      // Ventes par catégorie
      if (!stats.salesByCategory[sale.category]) {
        stats.salesByCategory[sale.category] = { revenue: 0, quantity: 0, count: 0 };
      }
      stats.salesByCategory[sale.category].revenue += totalPrice;
      stats.salesByCategory[sale.category].quantity += quantity;
      stats.salesByCategory[sale.category].count++;

      // Événements récents
      stats.recentEvents.push({
        type: 'sale',
        description: `Vente: ${sale.productName}`,
        amount: totalPrice,
        date: saleDate,
      });
    });

    // Calculer les pertes
    losses.forEach(loss => {
      stats.totalLossesCost += loss.cost || 0;
      stats.recentEvents.push({
        type: 'loss',
        description: `Perte: ${loss.productName} (${loss.reason})`,
        amount: -(loss.cost || 0),
        date: loss.date,
      });
    });

    // Ajouter les factures
    stats.recentEvents = stats.recentEvents.concat(
      invoices.map(invoice => ({
        type: 'invoice',
        description: `Facture #${invoice.id}`,
        amount: invoice.total || 0,
        date: invoice.date || invoice.createdAt,
      }))
    );

    // Trier les événements par date (plus récent en premier)
    stats.recentEvents.sort((a, b) => b.date - a.date);
    stats.recentEvents = stats.recentEvents.slice(0, 10); // Garder les 10 plus récents

    // Moyennes
    stats.averageSale = sales.length > 0 ? stats.totalRevenue / sales.length : 0;
    
    // Calcul du revenu quotidien moyen sur les 30 derniers jours
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const recentSales = sales.filter(s => s.date >= thirtyDaysAgo);
    const recentRevenue = recentSales.reduce((sum, s) => sum + (s.totalPrice || 0), 0);
    stats.averageDailyRevenue = recentRevenue / 30;

    // Comparaison avec le mois précédent
    if (stats.lastMonthRevenue > 0) {
      stats.revenueGrowth = ((stats.monthRevenue - stats.lastMonthRevenue) / stats.lastMonthRevenue) * 100;
    }

    // Trier les produits les plus vendus
    stats.topProductsArray = Object.entries(stats.topProducts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);

    // Préparer les données pour les graphiques
    stats.monthlySalesData = this.prepareMonthlyData(stats.salesByMonth, 6);
    stats.dailySalesData = this.prepareDailyData(stats.salesByDay, 30); // 30 derniers jours
    stats.categorySalesData = this.prepareCategoryData(stats.salesByCategory);

    return stats;
  }

  /**
   * Préparer les données journalières pour les graphiques (30 derniers jours)
   */
  static prepareDailyData(salesByDay, daysCount = 30) {
    const data = [];
    const now = new Date();
    
    for (let i = daysCount - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dayKey = date.toISOString().split('T')[0];
      const dayLabel = date.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short' });
      
      data.push({
        day: dayLabel,
        revenue: salesByDay[dayKey]?.revenue || 0,
        sales: salesByDay[dayKey]?.count || 0,
        quantity: salesByDay[dayKey]?.quantity || 0,
      });
    }
    
    return data;
  }

  /**
   * Préparer les données mensuelles pour les graphiques (6 derniers mois)
   */
  static prepareMonthlyData(salesByMonth, monthsCount = 6) {
    const data = [];
    const now = new Date();
    
    for (let i = monthsCount - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const monthName = date.toLocaleDateString('fr-FR', { month: 'short', year: '2-digit' });
      
      data.push({
        month: monthName,
        revenue: salesByMonth[monthKey]?.revenue || 0,
        sales: salesByMonth[monthKey]?.count || 0,
      });
    }
    
    return data;
  }

  /**
   * Préparer les données par catégorie pour les graphiques
   */
  static prepareCategoryData(salesByCategory) {
    return Object.entries(salesByCategory)
      .map(([category, data]) => ({
        name: category,
        value: data.revenue,
        quantity: data.quantity,
        count: data.count,
      }))
      .sort((a, b) => b.value - a.value);
  }

  /**
   * Calculer les statistiques de pertes
   */
  static calculateLossStats(losses) {
    const stats = {
      totalLosses: losses.length,
      totalCost: 0,
      lossesByReason: {},
      lossesByProduct: {},
    };

    losses.forEach(loss => {
      stats.totalCost += loss.cost;

      // Par raison
      if (!stats.lossesByReason[loss.reason]) {
        stats.lossesByReason[loss.reason] = { count: 0, cost: 0 };
      }
      stats.lossesByReason[loss.reason].count++;
      stats.lossesByReason[loss.reason].cost += loss.cost;

      // Par produit
      if (!stats.lossesByProduct[loss.productId]) {
        stats.lossesByProduct[loss.productId] = {
          name: loss.productName,
          quantity: 0,
          cost: 0,
        };
      }
      stats.lossesByProduct[loss.productId].quantity += loss.quantity;
      stats.lossesByProduct[loss.productId].cost += loss.cost;
    });

    return stats;
  }

  /**
   * Obtenir les produits à faible rotation (pas vendus depuis X jours)
   */
  static getSlowMovingProducts(products, sales, days = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return products.filter(product => {
      const productSales = sales.filter(sale => 
        sale.productId === product.id && sale.date >= cutoffDate
      );
      return productSales.length === 0 && product.quantity > 0;
    });
  }
}

export default SalesService;


