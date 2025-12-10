# 🧾 Comment Ajouter des Produits dans une Facture

## 📝 FONCTIONNEMENT DU SYSTÈME

Le système d'ajout de produits fonctionne en **3 étapes simples** :

---

## ✅ ÉTAPE 1 : Avoir des Produits dans l'Inventaire

**IMPORTANT** : Vous devez d'abord avoir des produits avec du stock dans votre inventaire !

### Comment ajouter des produits à l'inventaire :
```
1. Dashboard → Inventaire
2. Cliquez "+ Ajouter un produit"
3. Remplissez les informations :
   - Nom du produit
   - Catégorie
   - Prix d'achat
   - Prix de vente
   - Quantité initiale (IMPORTANT : > 0)
4. Cliquez "Ajouter"
```

**Exemple** :
```
Nom : Coca-Cola 1.5L
Catégorie : Boissons
Prix d'achat : 800 FCFA
Prix de vente : 1000 FCFA
Quantité : 50
```

---

## ✅ ÉTAPE 2 : Créer une Facture

```
1. Dashboard → Facturation
2. Cliquez "+ Nouvelle facture"
3. Le formulaire s'ouvre
```

---

## ✅ ÉTAPE 3 : Ajouter des Produits à la Facture

### Interface Améliorée (maintenant)

#### Cas 1 : Vous avez des produits disponibles ✅

Vous verrez :
```
┌─────────────────────────────────────────┐
│ Ajouter des produits *                  │
│ 👆 Cliquez sur un produit pour le       │
│    sélectionner                          │
│                                          │
│ [Coca-Cola] [Pain] [Lait] [Eau] →      │
│  1000 FCFA   500    800    300          │
│                                          │
│ (Après clic sur un produit)             │
│ Qté: [___]  [Ajouter]                   │
└─────────────────────────────────────────┘
```

**Comment faire** :
1. **Cliquez** sur une des chips de produit (ex: "Coca-Cola")
2. Le produit devient bleu (sélectionné)
3. Un champ "Qté" apparaît en dessous
4. Entrez la quantité (ex: "5")
5. Cliquez "Ajouter"
6. Le produit est ajouté à votre facture

#### Cas 2 : Vous n'avez PAS de produits disponibles ⚠️

Vous verrez :
```
┌─────────────────────────────────────────┐
│ Ajouter des produits *                  │
│                                          │
│ ┌─────────────────────────────────┐    │
│ │           📦                     │    │
│ │   Aucun produit disponible       │    │
│ │                                  │    │
│ │   Ajoutez d'abord des produits   │    │
│ │   dans votre inventaire avec du  │    │
│ │   stock disponible.              │    │
│ └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Que faire** :
1. Fermez le modal de facture
2. Allez dans **Inventaire**
3. Ajoutez des produits avec du stock
4. Revenez dans **Facturation**

---

## 🎯 EXEMPLE COMPLET

### Scénario : Créer une facture pour Jean Dupont

**1. Vérifier l'inventaire**
```
Inventaire actuel :
- Coca-Cola 1.5L : 50 unités (1000 FCFA)
- Pain : 30 unités (500 FCFA)
- Lait : 20 unités (800 FCFA)
```

**2. Créer la facture**
```
Dashboard → Facturation → + Nouvelle facture
```

**3. Remplir le formulaire**
```
Nom du client : Jean Dupont

Ajouter des produits :
1. Clic sur "Coca-Cola" → Devient bleu
   Qté: 5 → Clic "Ajouter"
   ✅ Ajouté : Coca-Cola × 5 = 5000 FCFA

2. Clic sur "Pain" → Devient bleu
   Qté: 3 → Clic "Ajouter"
   ✅ Ajouté : Pain × 3 = 1500 FCFA

3. Clic sur "Lait" → Devient bleu
   Qté: 2 → Clic "Ajouter"
   ✅ Ajouté : Lait × 2 = 1600 FCFA

Produits ajoutés (3) :
• Coca-Cola 1.5L : 5 × 1000 = 5000 FCFA [✕]
• Pain : 3 × 500 = 1500 FCFA [✕]
• Lait : 2 × 800 = 1600 FCFA [✕]

Remise : 500 FCFA
Mode de paiement : Mobile Money
Statut : Payé

┌─────────────────────────┐
│ Sous-total: 8100 FCFA   │
│ Remise:     -500 FCFA   │
│ Total:      7600 FCFA   │
└─────────────────────────┘
```

**4. Générer**
```
Clic sur "Générer facture"
✅ Facture INV-202410-001 créée !
```

---

## ❓ QUESTIONS FRÉQUENTES

### Q : Pourquoi je ne vois aucun produit ?
**R :** Deux raisons possibles :
1. Vous n'avez pas de produits dans votre inventaire
2. Tous vos produits ont un stock = 0

**Solution** : Allez dans Inventaire et ajoutez des produits avec du stock.

---

### Q : Comment modifier la quantité d'un produit déjà ajouté ?
**R :** 
1. Cliquez sur la petite croix ✕ pour le supprimer
2. Re-sélectionnez le produit avec la nouvelle quantité
3. Cliquez "Ajouter"

---

### Q : Puis-je ajouter le même produit plusieurs fois ?
**R :** Oui ! Si vous ajoutez le même produit, il remplacera l'ancien avec la nouvelle quantité.

**Exemple** :
```
1. Ajout Coca × 5
2. Ajout Coca × 10
Résultat : Coca × 10 (remplace les 5)
```

---

### Q : Que se passe-t-il si je demande plus que le stock disponible ?
**R :** Une erreur s'affiche :
```
❌ Stock insuffisant pour Coca-Cola. Disponible: 50
```

---

### Q : Comment supprimer un produit de la facture ?
**R :** Cliquez sur le petit ✕ à droite du produit dans la liste "Produits ajoutés".

---

## 🎨 INTERFACE VISUELLE

### Avant l'amélioration (problème) ❌
```
Ajouter des produits *
[Rien ne s'affiche - confusion !]
```

### Après l'amélioration (maintenant) ✅

**Avec produits disponibles** :
```
Ajouter des produits *
👆 Cliquez sur un produit pour le sélectionner

[Coca] [Pain] [Lait] [Eau] →  (scroll horizontal)
```

**Sans produits disponibles** :
```
Ajouter des produits *

┌────────────────────────────┐
│           📦               │
│  Aucun produit disponible  │
│                            │
│  Ajoutez d'abord des       │
│  produits dans votre       │
│  inventaire...             │
└────────────────────────────┘
```

---

## ✅ RÉSUMÉ RAPIDE

### Pour ajouter des produits à une facture :

1. **Pré-requis** : Avoir des produits avec stock > 0 dans l'inventaire
2. **Cliquer** sur un produit (il devient bleu)
3. **Entrer** la quantité
4. **Cliquer** "Ajouter"
5. **Répéter** pour d'autres produits

### Si rien ne s'affiche :

1. Fermez le modal
2. Allez dans **Inventaire**
3. Ajoutez des produits
4. Revenez créer votre facture

---

**Le système est maintenant plus clair avec des messages explicatifs !** ✨



