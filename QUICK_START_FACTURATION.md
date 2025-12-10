# 🚀 Guide de Démarrage Rapide - Module Facturation

**Temps estimé** : 5 minutes

---

## ⚡ ÉTAPES RAPIDES

### 1️⃣ Déployer les Règles Firestore (2 minutes)

**Option A : Console Firebase** (recommandé)
```
1. Allez sur https://console.firebase.google.com/
2. Sélectionnez votre projet "entrepreneur-africa"
3. Menu gauche → Firestore Database → Onglet "Règles"
4. Copiez-collez le contenu de votre fichier "firestore.rules"
5. Cliquez "Publier"
```

**Option B : Firebase CLI**
```bash
firebase deploy --only firestore:rules
```

---

### 2️⃣ Vérifier les Règles (30 secondes)

Dans la console Firebase, vérifiez que vous voyez :
```javascript
✅ match /invoices/{userId}/documents/{invoiceId} { ... }
```

---

### 3️⃣ Lancer l'Application (1 minute)

```bash
# Dans votre terminal
npm start
# ou
expo start
```

---

### 4️⃣ Tester le Module (2 minutes)

#### A. Accéder à la Facturation
```
1. Ouvrez l'application
2. Connectez-vous
3. Dashboard → Cliquez sur "Facturation"
```

#### B. Créer une première facture
```
1. Cliquez "+ Nouvelle facture"
2. Sélectionnez un produit
3. Ajustez la quantité
4. Cliquez "Ajouter"
5. Choisissez le mode de paiement
6. Cliquez "Générer facture"
```

#### C. Vérifier
```
✅ La facture apparaît dans la liste
✅ Un numéro est généré (ex: INV-202410-001)
✅ Les stats se mettent à jour
✅ Le stock du produit a diminué
```

---

## 🎯 FONCTIONNALITÉS À TESTER

### Test 1 : Créer une facture simple
```
Client : "Jean Dupont"
Produit : Sélectionnez 1 produit
Quantité : 2
Paiement : Espèces
Statut : Payé
```

### Test 2 : Facture avec remise
```
Produit : Sélectionnez 1 produit
Quantité : 5
Remise : 1000 FCFA
Paiement : Mobile Money
Statut : Non payé
```

### Test 3 : Facture multiple produits
```
Produits : Ajoutez 3 produits différents
Quantités : Variées
Paiement : Transfert
Statut : Payé
```

### Test 4 : Filtres et recherche
```
1. Créez 3 factures (2 payées, 1 non payée)
2. Filtrez par "Payées" → Doit afficher 2
3. Filtrez par "Non payées" → Doit afficher 1
4. Recherchez un nom de client → Doit trouver
```

### Test 5 : Gestion des statuts
```
1. Créez une facture "Non payée"
2. Cliquez sur la facture → Détails
3. Cliquez "Marquer comme payé"
4. Vérifiez que les stats changent
```

---

## ✅ CHECKLIST DE VÉRIFICATION

Après les tests, vérifiez que :

- [ ] Les factures s'affichent dans la liste
- [ ] Les numéros sont uniques (INV-YYYYMM-XXX)
- [ ] Les statistiques sont correctes
- [ ] Le stock se met à jour automatiquement
- [ ] Les filtres fonctionnent
- [ ] La recherche fonctionne
- [ ] Les détails s'affichent correctement
- [ ] Le changement de statut fonctionne
- [ ] L'interface est responsive (testez sur mobile)
- [ ] Aucune erreur dans la console (F12)

---

## 🎨 APERÇU VISUEL

### Dashboard
```
┌─────────────────────────────────────┐
│  Entrepreneur Africa                │
│  ────────────────────────────       │
│  [Inventaire]                       │
│  [Ventes]                           │
│  [Facturation]  ← CLIQUEZ ICI       │
│  [Produits]                         │
└─────────────────────────────────────┘
```

### Écran Facturation
```
┌─────────────────────────────────────────┐
│  ← Retour   Facturation   [+ Nouvelle]  │
├─────────────────────────────────────────┤
│  [🧾 45]  [💰 1.5M]  [✅ 1.2M]         │
│  [⏳ 300K] [📅 12]   [💳 350K]         │
├─────────────────────────────────────────┤
│  🔍 [Rechercher...]                    │
│  [Toutes] [Payées] [Non payées]        │
├─────────────────────────────────────────┤
│  Factures (45)                          │
│  ┌─────────────────────────────────┐   │
│  │ INV-202410-001    [Payé ✅]     │   │
│  │ Jean Dupont                      │   │
│  │ 5,000 FCFA  →  Voir détails     │   │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### Modal de Création
```
┌───────────────────────────────────────┐
│  Nouvelle facture               [×]   │
├───────────────────────────────────────┤
│  Nom du client (optionnel)            │
│  [___________________________]        │
│                                       │
│  Ajouter des produits *               │
│  [Coca] [Pain] [Lait] [Eau]  →       │
│                                       │
│  Qté: [1]  [Ajouter]                  │
│                                       │
│  Produits ajoutés (2)                 │
│  • Coca-Cola  2 × 1,000 = 2,000      │
│  • Pain       1 × 500   = 500         │
│                                       │
│  Remise (FCFA)                        │
│  [0]                                  │
│                                       │
│  Mode de paiement                     │
│  [Espèces] [Mobile Money] ...         │
│                                       │
│  Statut                               │
│  [Payé] [Non payé]                    │
│                                       │
│  ┌─────────────────────────────┐     │
│  │ Sous-total:      2,500 FCFA │     │
│  │ Remise:             -0 FCFA │     │
│  │ Total:           2,500 FCFA │     │
│  └─────────────────────────────┘     │
│                                       │
│        [Annuler] [Générer facture]   │
└───────────────────────────────────────┘
```

---

## 🔥 RACCOURCIS UTILES

### Créer une facture rapide
```
1. Dashboard → Facturation
2. + Nouvelle facture
3. Sélectionnez produit(s)
4. Générer
```

### Voir toutes les factures non payées
```
1. Facturation
2. Filtre "Non payées"
```

### Trouver une facture spécifique
```
1. Facturation
2. Rechercher le numéro ou le client
```

### Changer le statut
```
1. Cliquez sur la facture
2. "Marquer comme..."
```

---

## 📞 AIDE RAPIDE

### ❓ La facture ne se crée pas
```
Vérifiez :
1. Au moins 1 produit ajouté
2. Stock suffisant
3. Connexion internet
4. Console (F12) pour erreurs
```

### ❓ Les stats ne s'affichent pas
```
Solution :
1. Rafraîchir la page
2. Vérifier règles Firestore
3. Vérifier authentification
```

### ❓ Le stock ne change pas
```
Solution :
1. Recharger l'inventaire
2. Vérifier la console
3. Vérifier les permissions Firestore
```

---

## 🎊 VOUS ÊTES PRÊT !

Le module Facturation est maintenant :
- ✅ Installé
- ✅ Configuré
- ✅ Testé
- ✅ Prêt à l'emploi

**Créez votre première facture et profitez ! 🚀**

---

**Pour plus de détails** : Consultez `MODULE_FACTURATION_COMPLET.md`


