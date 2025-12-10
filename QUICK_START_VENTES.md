# 🚀 Démarrage Rapide - Module Ventes

## ⚡ En 3 étapes

### 1️⃣ Déployez les règles Firestore

**Via la Console Firebase** :
1. Allez sur https://console.firebase.google.com
2. Sélectionnez votre projet
3. **Firestore Database** → **Règles**
4. Copiez-collez les règles depuis `firestore.rules`
5. **Publiez**

---

### 2️⃣ Lancez l'application

```bash
npm start
```

Puis ouvrez dans votre navigateur (généralement http://localhost:19006)

---

### 3️⃣ Testez le module

1. **Connectez-vous** avec votre compte
2. **Dashboard** → Cliquez sur **"Ventes"** (menu Gestion)
3. **Enregistrez une première vente** :
   - Scrollez en bas
   - Cliquez sur un produit
   - Entrez la quantité (ex: 2)
   - Validez
4. **Admirez les statistiques** qui se mettent à jour !

---

## 📊 Ce que vous verrez

### Si AUCUNE vente :
```
📊
Aucune donnée disponible

Commencez à enregistrer des ventes pour voir 
vos statistiques et performances ici.

[Enregistrer une première vente]
```

### Après LA PREMIÈRE vente :
```
💰 Revenu total cumulé
   1,200 FCFA
   1 vente

📦 Total produits vendus
   2
   Unités

⚠️ Total des pertes
   0
   0 FCFA

... (+ 3 autres cartes)

[Graphiques mensuels]
[Timeline d'événements]
```

---

## 🎯 Actions rapides

### Enregistrer une vente
```
Dashboard → Ventes → Scroll en bas → Clic sur produit → Remplir → Valider
```

### Voir les statistiques
```
Dashboard → Ventes → Visualiser directement
```

### Filtrer par période
```
Écran Ventes → Filtres en haut → Clic sur "Aujourd'hui", "Ce mois", etc.
```

---

## ✅ Vérifications

**Avant de commencer** :
- [ ] Règles Firestore déployées
- [ ] Au moins 1 produit dans l'inventaire
- [ ] Produit avec stock > 0

**Si problème** :
1. Ouvrez la console (F12)
2. Regardez les messages d'erreur
3. Vérifiez que vous êtes connecté

---

## 🎨 Où ça se trouve ?

| Élément | Emplacement |
|---------|-------------|
| Code principal | `src/screens/SalesScreen.js` |
| Service | `src/services/salesService.js` |
| Hook | `src/hooks/useSales.js` |
| Modal | `src/components/SaleModal.js` |
| Règles | `firestore.rules` |

---

## 💡 Astuce Pro

**Pour tester rapidement** :
1. Créez 5-6 produits dans l'inventaire
2. Enregistrez 10-15 ventes sur différents jours
3. Les graphiques s'afficheront automatiquement !

**Pour des données réalistes** :
- Variez les dates (utilisez le calendrier dans le modal)
- Variez les catégories de produits
- Ajoutez quelques pertes pour voir l'impact

---

**C'est tout ! Profitez du module Ventes & Performances ! 🎉**

---

**Besoin d'aide ?** Consultez `MODULE_VENTES_COMPLET.md` pour la documentation complète.


