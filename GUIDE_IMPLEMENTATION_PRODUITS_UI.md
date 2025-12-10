# 🎨 Guide d'Implémentation - Interfaces Produits

**Date**: 23 Octobre 2025  
**Status**: ✅ **COMPOSANTS CRÉÉS** | 📝 **INSTRUCTIONS D'INTÉGRATION**

---

## ✅ CE QUI A ÉTÉ CRÉÉ

### 1. Hook useProducts ✅
**Fichier**: `src/hooks/useProducts.js`

```javascript
import { useProducts } from '../hooks/useProducts';

const {
  products,        // Tous les produits
  stats,           // Statistiques complètes
  alerts,          // Alertes de stock
  categories,      // Liste des catégories
  loading,         // Chargement initial
  refreshing,      // Rafraîchissement
  error,           // Message d'erreur
  addProduct,      // Ajouter un produit
  updateProduct,   // Modifier un produit
  deleteProduct,   // Supprimer un produit
  getHistory,      // Récupérer l'historique
  refreshData,     // Rafraîchir les données
  loadData,        // Charger avec filtres
} = useProducts();
```

### 2. ProductModalAdvanced ✅
**Fichier**: `src/components/ProductModalAdvanced.js`

**Fonctionnalités complètes** :
- ✅ Upload d'image (max 5MB)
- ✅ Tous les champs (nom, catégorie, description, prix, stock, etc.)
- ✅ Catégories avec chips sélectionnables + catégorie personnalisée
- ✅ Unités de mesure (dropdown horizontal)
- ✅ Seuil d'alerte personnalisé
- ✅ Switch "Visible en ligne"
- ✅ Calcul automatique de la marge et du bénéfice
- ✅ Aperçu de l'image avec suppression
- ✅ Validation complète
- ✅ Mode création ET modification

### 3. ProductDetailsModal ✅
**Fichier**: `src/components/ProductDetailsModal.js`

**Affichage complet** :
- ✅ Image en grand avec badge "En ligne"
- ✅ Statut du stock (badge coloré)
- ✅ Informations complètes du produit
- ✅ Prix et rentabilité (marge, bénéfice)
- ✅ Gestion du stock (quantité, seuil, valeur)
- ✅ **Historique des modifications** (timeline)
- ✅ Métadonnées (dates de création/modification)
- ✅ Actions : Modifier, Supprimer, Fermer

---

## 🚀 COMMENT UTILISER DANS InventoryScreen

Voici comment mettre à jour votre **`src/screens/InventoryScreen.js`** pour utiliser les nouveaux composants :

### Étape 1 : Imports

```javascript
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ... } from 'react-native';
import { useProducts } from '../hooks/useProducts';  // NOUVEAU
import ProductModalAdvanced from '../components/ProductModalAdvanced';  // NOUVEAU
import ProductDetailsModal from '../components/ProductDetailsModal';  // NOUVEAU
```

### Étape 2 : Utiliser le Hook

```javascript
const InventoryScreen = ({ navigation }) => {
  const {
    products,
    stats,
    alerts,
    categories,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshData,
    loadData,
  } = useProducts();  // NOUVEAU

  const [productModalVisible, setProductModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // ... reste du code
};
```

### Étape 3 : Gérer l'Ajout/Modification

```javascript
// Ouvrir le modal pour ajouter
const handleAddProduct = () => {
  setSelectedProduct(null);
  setProductModalVisible(true);
};

// Ouvrir le modal pour modifier
const handleEditProduct = (product) => {
  setSelectedProduct(product);
  setProductModalVisible(true);
};

// Soumettre le formulaire
const handleSubmitProduct = async (productData) => {
  setSubmitting(true);

  try {
    let result;
    
    if (selectedProduct) {
      // Modification
      result = await updateProduct(selectedProduct.id, productData);
    } else {
      // Ajout
      result = await addProduct(productData);
    }

    if (result.success) {
      setProductModalVisible(false);
      setSelectedProduct(null);
      alert('Produit enregistré avec succès!');
    } else {
      alert(`Erreur: ${result.error}`);
    }
  } catch (error) {
    console.error('Erreur:', error);
    alert('Une erreur inattendue est survenue');
  } finally {
    setSubmitting(false);
  }
};
```

### Étape 4 : Gérer la Suppression

```javascript
const handleDeleteProduct = async (productId) => {
  if (Platform.OS === 'web') {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) return;
  } else {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer ce produit ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            const result = await deleteProduct(productId);
            if (result.success) {
              setDetailsModalVisible(false);
              alert('Produit supprimé avec succès!');
            } else {
              alert(`Erreur: ${result.error}`);
            }
          },
        },
      ]
    );
    return;
  }

  const result = await deleteProduct(productId);
  if (result.success) {
    setDetailsModalVisible(false);
    alert('Produit supprimé avec succès!');
  } else {
    alert(`Erreur: ${result.error}`);
  }
};
```

### Étape 5 : Afficher les Produits

```javascript
return (
  <View style={styles.container}>
    <ScrollView>
      {/* Header avec bouton ajouter */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Inventaire</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddProduct}
        >
          <Text style={styles.addButtonText}>+ Ajouter</Text>
        </TouchableOpacity>
      </View>

      {/* Statistiques (existant - à améliorer) */}
      {stats && (
        <View style={styles.statsGrid}>
          {/* Vos cartes de stats existantes */}
        </View>
      )}

      {/* Alertes de stock */}
      {alerts && alerts.totalAlerts > 0 && (
        <View style={styles.alertBanner}>
          <Text style={styles.alertText}>
            ⚠️ {alerts.lowStock.length} produits en stock faible
          </Text>
          <Text style={styles.alertText}>
            🔴 {alerts.outOfStock.length} produits en rupture
          </Text>
        </View>
      )}

      {/* Liste des produits */}
      <View style={styles.productsGrid}>
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.productCard}
            onPress={() => {
              setSelectedProduct(product);
              setDetailsModalVisible(true);
            }}
          >
            {/* Image */}
            {product.imageUrl && (
              <Image 
                source={{ uri: product.imageUrl }} 
                style={styles.productImage} 
              />
            )}

            {/* Badge statut */}
            <View style={[
              styles.statusBadge,
              product.status === 'disponible' && styles.statusAvailable,
              product.status === 'faible' && styles.statusLow,
              product.status === 'rupture' && styles.statusOut,
            ]}>
              <Text style={styles.statusText}>
                {product.status}
              </Text>
            </View>

            {/* Informations */}
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productCategory}>{product.category}</Text>
            <Text style={styles.productPrice}>
              {formatNumber(product.sellingPrice)} FCFA
            </Text>
            <Text style={styles.productStock}>
              Stock: {product.quantity} {product.unit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>

    {/* Modal d'ajout/modification */}
    <ProductModalAdvanced
      visible={productModalVisible}
      onClose={() => {
        setProductModalVisible(false);
        setSelectedProduct(null);
      }}
      onSubmit={handleSubmitProduct}
      product={selectedProduct}
      loading={submitting}
      categories={categories}
    />

    {/* Modal de détails */}
    <ProductDetailsModal
      visible={detailsModalVisible}
      onClose={() => {
        setDetailsModalVisible(false);
        setSelectedProduct(null);
      }}
      product={selectedProduct}
      onEdit={(product) => {
        setDetailsModalVisible(false);
        handleEditProduct(product);
      }}
      onDelete={handleDeleteProduct}
    />
  </View>
);
```

---

## 📊 STATISTIQUES À AFFICHER

Le hook `useProducts` retourne des statistiques complètes :

```javascript
stats = {
  total: 150,                    // Nombre total de produits
  totalValue: 2450000,          // Valeur totale du stock
  lowStock: 12,                 // Produits en alerte
  outOfStock: 3,                // Produits en rupture
  online: 89,                   // Produits visibles en ligne
  
  byCategory: {
    "Boissons": {
      count: 25,
      totalValue: 450000
    },
    // ...
  },
  
  byStatus: {
    disponible: 135,
    faible: 12,
    rupture: 3
  }
}
```

**Exemple de cartes statistiques** :

```javascript
<View style={styles.statsGrid}>
  <View style={styles.statCard}>
    <Text style={styles.statIcon}>📦</Text>
    <Text style={styles.statValue}>{stats.total}</Text>
    <Text style={styles.statLabel}>Produits</Text>
  </View>

  <View style={styles.statCard}>
    <Text style={styles.statIcon}>💰</Text>
    <Text style={styles.statValue}>
      {formatNumber(stats.totalValue)} FCFA
    </Text>
    <Text style={styles.statLabel}>Valeur du stock</Text>
  </View>

  <View style={styles.statCard}>
    <Text style={styles.statIcon}>⚠️</Text>
    <Text style={styles.statValue}>{stats.lowStock}</Text>
    <Text style={styles.statLabel}>Stock faible</Text>
  </View>

  <View style={styles.statCard}>
    <Text style={styles.statIcon}>🔴</Text>
    <Text style={styles.statValue}>{stats.outOfStock}</Text>
    <Text style={styles.statLabel}>Rupture</Text>
  </View>

  <View style={styles.statCard}>
    <Text style={styles.statIcon}>🌐</Text>
    <Text style={styles.statValue}>{stats.online}</Text>
    <Text style={styles.statLabel}>En ligne</Text>
  </View>
</View>
```

---

## 🔍 FILTRES ET RECHERCHE

Pour ajouter des filtres :

```javascript
const [filters, setFilters] = useState({
  search: '',
  category: null,
  status: null,
  lowStock: false,
  online: null,
});

// Appliquer les filtres
const handleApplyFilters = () => {
  loadData(filters);
};

// UI des filtres
<View style={styles.filtersContainer}>
  {/* Recherche */}
  <TextInput
    style={styles.searchInput}
    placeholder="Rechercher..."
    value={filters.search}
    onChangeText={(text) => setFilters({ ...filters, search: text })}
  />

  {/* Catégories */}
  <ScrollView horizontal>
    {['Tout', ...categories].map((cat) => (
      <TouchableOpacity
        key={cat}
        style={[
          styles.filterChip,
          filters.category === cat && styles.filterChipActive
        ]}
        onPress={() => setFilters({ 
          ...filters, 
          category: cat === 'Tout' ? null : cat 
        })}
      >
        <Text>{cat}</Text>
      </TouchableOpacity>
    ))}
  </ScrollView>

  {/* Statut */}
  <View style={styles.statusFilters}>
    {['disponible', 'faible', 'rupture'].map((status) => (
      <TouchableOpacity
        key={status}
        style={[
          styles.statusChip,
          filters.status === status && styles.statusChipActive
        ]}
        onPress={() => setFilters({ 
          ...filters, 
          status: filters.status === status ? null : status 
        })}
      >
        <Text>{status}</Text>
      </TouchableOpacity>
    ))}
  </View>
</View>
```

---

## 🎨 STYLES RECOMMANDÉS

Quelques styles pour un rendu professionnel :

```javascript
const styles = StyleSheet.create({
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    position: 'relative',
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  statusBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusAvailable: {
    backgroundColor: '#d1fae5',
  },
  statusLow: {
    backgroundColor: '#fef3c7',
  },
  statusOut: {
    backgroundColor: '#fee2e2',
  },
  productName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 18,
    fontWeight: '700',
    color: '#10b981',
    marginBottom: 4,
  },
  productStock: {
    fontSize: 13,
    color: '#374151',
  },
  alertBanner: {
    backgroundColor: '#fef3c7',
    padding: 16,
    marginBottom: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  alertText: {
    fontSize: 14,
    color: '#92400e',
    marginBottom: 4,
  },
});
```

---

## ✅ CHECKLIST D'INTÉGRATION

- [ ] Importer les nouveaux composants
- [ ] Remplacer l'ancien modal par ProductModalAdvanced
- [ ] Ajouter ProductDetailsModal
- [ ] Utiliser le hook useProducts
- [ ] Afficher les alertes de stock
- [ ] Ajouter les filtres (optionnel)
- [ ] Afficher les statistiques complètes
- [ ] Gérer l'upload d'images
- [ ] Tester l'ajout d'un produit
- [ ] Tester la modification
- [ ] Tester la suppression
- [ ] Tester l'historique
- [ ] Déployer les règles Storage

---

## 🎯 RÉSUMÉ

### ✅ Composants Créés

1. ✅ `useProducts.js` - Hook complet
2. ✅ `ProductModalAdvanced.js` - Formulaire avec upload
3. ✅ `ProductDetailsModal.js` - Vue détaillée avec historique

### ⏳ À Faire

1. ⏳ Mettre à jour `InventoryScreen.js` (suivre ce guide)
2. ⏳ Tester l'upload d'images
3. ⏳ Déployer les règles Storage

### 🎊 Résultat Final

Une fois intégré, vous aurez :
- ✅ Upload d'images professionnel
- ✅ Formulaire complet et moderne
- ✅ Historique automatique
- ✅ Alertes de stock visuelles
- ✅ Statistiques détaillées
- ✅ Préparation e-commerce

---

**Le code est prêt ! Il ne reste qu'à l'intégrer dans InventoryScreen !** 🚀


