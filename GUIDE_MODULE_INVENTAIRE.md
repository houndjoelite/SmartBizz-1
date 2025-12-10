# 📦 Guide Complet : Module Inventaire SmartBizz

## 🎯 Vue d'ensemble

Le **Module Inventaire** est un système complet de gestion de produits intégré directement dans votre tableau de bord SmartBizz. Il vous permet de gérer vos stocks, suivre vos produits, et obtenir des statistiques en temps réel.

---

## ✨ Fonctionnalités Principales

### 1️⃣ **Vue principale (Liste des produits)**

- ✅ Affichage de tous vos produits sous forme de cartes détaillées
- ✅ Informations complètes : nom, catégorie, prix, quantité, statut
- ✅ Indicateurs visuels de stock :
  - 🟢 **Disponible** : Quantité > 5
  - 🟡 **Stock faible** : Quantité entre 1 et 5
  - 🔴 **Rupture de stock** : Quantité = 0
- ✅ Pull-to-refresh pour actualiser les données
- ✅ Statistiques globales en temps réel

### 2️⃣ **Ajout de produit**

- ✅ Formulaire intuitif avec validation
- ✅ Champs requis : Nom, Catégorie, Prix de vente, Quantité
- ✅ Champs optionnels : Prix d'achat, Description
- ✅ Sélection de catégorie par boutons
- ✅ Calcul automatique de la marge
- ✅ Enregistrement sécurisé dans Firestore

### 3️⃣ **Modification de produit**

- ✅ Formulaire pré-rempli avec les données existantes
- ✅ Mise à jour instantanée
- ✅ Validation des modifications
- ✅ Mise à jour automatique du statut de stock

### 4️⃣ **Suppression de produit**

- ✅ Confirmation avant suppression
- ✅ Suppression sécurisée de Firestore
- ✅ Actualisation automatique de la liste

### 5️⃣ **Recherche et filtres**

- ✅ **Recherche** : Par nom, catégorie ou description
- ✅ **Filtre par catégorie** : Alimentation, Boissons, Électronique, etc.
- ✅ **Filtre par statut** : Disponible, Stock faible, Rupture
- ✅ **Tri dynamique** : Par nom, quantité, prix ou date
- ✅ **Ordre croissant/décroissant**

### 6️⃣ **Statistiques en temps réel**

- ✅ Nombre total de produits
- ✅ Produits disponibles
- ✅ Produits en stock faible
- ✅ Produits en rupture
- ✅ Valeur totale de l'inventaire (FCFA)

### 7️⃣ **Sécurité**

- ✅ **Isolation par utilisateur** : Chaque utilisateur voit uniquement ses propres produits
- ✅ **Authentification Firebase** : Vérification à chaque requête
- ✅ **Validation des données** : Côté client et serveur
- ✅ **Chemins sécurisés** : `inventory/{userId}/products`

---

## 📂 Structure du Code

```
src/
├── services/
│   └── inventoryService.js        # Service Firebase pour l'inventaire
├── hooks/
│   └── useInventory.js            # Hook React personnalisé
├── components/
│   ├── ProductCard.js             # Carte individuelle de produit
│   └── ProductModal.js            # Modal d'ajout/modification
└── screens/
    └── InventoryScreen.js         # Écran principal d'inventaire
```

---

## 🔧 Architecture Technique

### **1. Service Inventaire** (`inventoryService.js`)

Gère toutes les interactions avec Firestore :

**Méthodes principales :**
- `getUserProducts()` - Récupère tous les produits de l'utilisateur
- `getProduct(productId)` - Récupère un produit spécifique
- `addProduct(productData)` - Ajoute un nouveau produit
- `updateProduct(productId, productData)` - Met à jour un produit
- `deleteProduct(productId)` - Supprime un produit
- `searchProducts(products, searchTerm)` - Recherche dans les produits
- `sortProducts(products, sortBy, sortOrder)` - Trie les produits
- `filterByCategory(products, category)` - Filtre par catégorie
- `filterByStatus(products, status)` - Filtre par statut
- `getInventoryStats(products)` - Calcule les statistiques

**Structure Firestore :**
```
inventory/
  {userId}/
    products/
      {productId}/
        - name: string
        - category: string
        - purchasePrice: number
        - sellingPrice: number
        - quantity: number
        - description: string
        - imageUrl: string | null
        - status: 'disponible' | 'faible' | 'rupture'
        - createdAt: timestamp
        - updatedAt: timestamp
```

### **2. Hook Personnalisé** (`useInventory.js`)

Fournit une interface simple pour gérer l'inventaire :

**Retourne :**
```javascript
{
  // Données
  products,           // Liste filtrée des produits
  allProducts,        // Tous les produits (non filtrés)
  stats,              // Statistiques calculées
  categories,         // Catégories uniques
  
  // États
  loading,            // Chargement initial
  refreshing,         // Rafraîchissement
  error,              // Erreur éventuelle
  
  // Actions CRUD
  addProduct,         // Ajouter un produit
  updateProduct,      // Modifier un produit
  deleteProduct,      // Supprimer un produit
  uploadImage,        // Upload d'image
  refreshProducts,    // Rafraîchir manuellement
  
  // Filtres et tri
  searchTerm,         // Terme de recherche
  setSearchTerm,      // Modifier la recherche
  selectedCategory,   // Catégorie sélectionnée
  setSelectedCategory,
  selectedStatus,     // Statut sélectionné
  setSelectedStatus,
  sortBy,             // Champ de tri
  setSortBy,
  sortOrder,          // Ordre de tri
  setSortOrder,
}
```

### **3. Composants UI**

#### **ProductCard** (`ProductCard.js`)
Affiche les détails d'un produit :
- Badge de statut avec couleur dynamique
- Prix d'achat et de vente
- Calcul de la marge unitaire
- Boutons Modifier et Supprimer

#### **ProductModal** (`ProductModal.js`)
Formulaire modal pour ajouter/modifier un produit :
- Validation en temps réel
- Sélection de catégorie par boutons
- Gestion des erreurs
- Indicateur de chargement

#### **InventoryScreen** (`InventoryScreen.js`)
Écran principal :
- Header avec statistiques
- Barre de recherche
- Panneau de filtres extensible
- Liste scrollable avec pull-to-refresh
- État vide personnalisé

---

## 🎨 Catégories Disponibles

1. Alimentation
2. Boissons
3. Électronique
4. Vêtements
5. Cosmétiques
6. Fournitures
7. Accessoires
8. Autre

> **Note :** Vous pouvez facilement ajouter de nouvelles catégories en modifiant le tableau `CATEGORIES` dans `ProductModal.js`.

---

## 📊 Règles de Gestion du Stock

### **Statut Automatique**

Le statut d'un produit est automatiquement calculé selon ces règles :

| Quantité | Statut | Couleur | Icône |
|----------|--------|---------|-------|
| 0 | Rupture de stock | 🔴 Rouge | 🔴 |
| 1 - 5 | Stock faible | 🟡 Orange | 🟡 |
| > 5 | Disponible | 🟢 Vert | 🟢 |

### **Calcul de la Marge**

Si un prix d'achat est renseigné :
```
Marge unitaire = Prix de vente - Prix d'achat
```

### **Valeur Totale**

```
Valeur totale = Σ (Prix de vente × Quantité)
```

---

## 🚀 Utilisation

### **1. Accéder à l'inventaire**

Depuis le Dashboard :
1. Cliquez sur **"📦 Inventaire"** dans le menu principal
2. Ou utilisez le bouton **"📦 Inventaire"** dans les actions rapides

### **2. Ajouter un produit**

1. Cliquez sur **"+ Ajouter un produit"**
2. Remplissez le formulaire :
   - **Nom** * (requis)
   - **Catégorie** * (requis)
   - **Prix de vente** * (requis, en FCFA)
   - **Quantité** * (requis)
   - Prix d'achat (optionnel, en FCFA)
   - Description (optionnel)
3. Cliquez sur **"Ajouter"**

### **3. Modifier un produit**

1. Trouvez le produit dans la liste
2. Cliquez sur **"✏️ Modifier"**
3. Modifiez les champs souhaités
4. Cliquez sur **"Modifier"**

### **4. Supprimer un produit**

1. Trouvez le produit dans la liste
2. Cliquez sur **"🗑️ Supprimer"**
3. Confirmez la suppression

### **5. Rechercher un produit**

1. Tapez dans la barre de recherche
2. La liste se filtre automatiquement
3. Cliquez sur **"✕"** pour effacer

### **6. Filtrer les produits**

1. Cliquez sur **"▼ Filtres"** pour ouvrir le panneau
2. Sélectionnez :
   - Une **catégorie** (ou "Toutes")
   - Un **statut** (ou "Tous")
   - Un **critère de tri** (Nom, Quantité, Prix, Date)
3. Cliquez à nouveau pour inverser l'ordre (↑/↓)

### **7. Rafraîchir la liste**

- **Sur mobile** : Tirez vers le bas (pull-to-refresh)
- **Sur web** : Rechargez la page ou utilisez le bouton retour

---

## 🔐 Règles de Sécurité Firestore

Pour que le module fonctionne correctement, configurez ces règles dans Firebase Console :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Règles pour l'inventaire
    match /inventory/{userId}/products/{productId} {
      // L'utilisateur peut lire, créer, modifier et supprimer uniquement ses propres produits
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

---

## 🎯 Validation des Données

### **Champs Requis**

- ✅ **Nom** : Non vide après trim()
- ✅ **Catégorie** : Doit être dans la liste des catégories
- ✅ **Prix de vente** : Nombre > 0
- ✅ **Quantité** : Nombre entier ≥ 0

### **Champs Optionnels**

- Prix d'achat : Si fourni, doit être ≥ 0
- Description : Texte libre

### **Validation Automatique**

- ❌ Prix négatifs refusés
- ❌ Quantité négative refusée
- ❌ Nom vide refusé
- ❌ Catégorie invalide refusée

---

## 🐛 Gestion des Erreurs

### **Messages d'erreur en Français**

Tous les messages sont traduits et explicites :

- ✅ "Le nom du produit est requis"
- ✅ "Le prix de vente doit être un nombre positif"
- ✅ "La quantité doit être un nombre positif"
- ✅ "Erreur lors de la récupération des produits"
- ✅ "Produit non trouvé"

### **Affichage des erreurs**

- **Formulaire** : Bordure rouge + message sous le champ
- **Actions** : Alert native avec message clair
- **Écran** : État d'erreur avec bouton "Réessayer"

---

## 📱 Responsive Design

Le module est entièrement responsive :

- ✅ **Mobile** (< 768px) : Cartes empilées, filtres scroll horizontal
- ✅ **Tablette/Desktop** : Cartes larges, filtres sur une ligne
- ✅ **Statistiques** : Grille adaptative selon la largeur
- ✅ **Modal** : Centré avec max-width pour éviter l'étirement

---

## 🔮 Évolutions Futures Possibles

### **Phase 2 (Court terme)**
- [ ] Upload d'images de produits
- [ ] Codes-barres et QR codes
- [ ] Import/Export CSV
- [ ] Notifications de stock faible
- [ ] Historique des modifications

### **Phase 3 (Moyen terme)**
- [ ] Gestion des variantes (taille, couleur)
- [ ] Alerte automatique de réapprovisionnement
- [ ] Connexion avec les ventes (déduction auto)
- [ ] Rapports et graphiques
- [ ] Multi-magasins/entrepôts

### **Phase 4 (Long terme)**
- [ ] Prévisions de stock par IA
- [ ] Intégration fournisseurs
- [ ] Scan de factures (OCR)
- [ ] App mobile native

---

## 💡 Bonnes Pratiques

### **Nommage des Produits**
- ✅ Soyez descriptif : "Coca-Cola 1.5L" au lieu de "Coca"
- ✅ Incluez le format/taille si pertinent
- ✅ Utilisez une convention cohérente

### **Gestion des Catégories**
- ✅ Regroupez intelligemment vos produits
- ✅ N'abusez pas de la catégorie "Autre"
- ✅ Créez des catégories personnalisées si nécessaire

### **Prix et Marges**
- ✅ Renseignez TOUJOURS le prix d'achat
- ✅ Vérifiez vos marges régulièrement
- ✅ Mettez à jour les prix lors d'inflation

### **Stocks**
- ✅ Faites un inventaire physique régulier
- ✅ Corrigez les écarts immédiatement
- ✅ Surveillez les produits en stock faible

---

## 📞 Support

Pour toute question ou problème :

1. Consultez d'abord ce guide
2. Vérifiez la console pour les erreurs
3. Assurez-vous que Firebase est bien configuré
4. Vérifiez votre connexion internet

---

## ✅ Checklist de Configuration

Avant d'utiliser le module, vérifiez que :

- [x] Firebase est initialisé dans `src/services/firebase.js`
- [x] Les règles Firestore sont configurées
- [x] L'utilisateur est authentifié
- [x] Le module est importé dans `App.js`
- [x] La navigation est configurée
- [x] Le lien est présent dans le Dashboard

---

## 🎉 Félicitations !

Vous avez maintenant un **système de gestion d'inventaire complet** intégré dans SmartBizz !

Le module est prêt à l'emploi et peut gérer des milliers de produits avec des performances optimales grâce à l'indexation Firestore.

**Bon business ! 🚀📦💼**


