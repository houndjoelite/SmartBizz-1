# ⚡ Quick Start : Module Inventaire (5 minutes)

## 🎯 Objectif

Démarrer avec le module d'inventaire en **5 minutes chrono** !

---

## ✅ Étape 1 : Déployer les Règles Firestore (2 min)

### Méthode 1 : Via Firebase Console (Recommandé)

1. Ouvrez [Firebase Console](https://console.firebase.google.com/)
2. Sélectionnez **entrepreneur-africa**
3. Menu **Firestore Database** → Onglet **Rules**
4. **Copiez-collez** le code ci-dessous :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Utilisateurs
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // INVENTAIRE (NOUVEAU)
    match /inventory/{userId}/products/{productId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Par défaut, tout est interdit
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Cliquez sur **Publier**

### Méthode 2 : Via CLI

```bash
firebase deploy --only firestore:rules
```

---

## ✅ Étape 2 : Lancer l'Application (1 min)

```bash
# Arrêtez le serveur actuel (Ctrl+C)

# Relancez
npm start

# Scannez le QR code ou appuyez sur 'w' pour le web
```

---

## ✅ Étape 3 : Accéder à l'Inventaire (1 min)

1. **Connectez-vous** avec vos identifiants
2. Sur le **Dashboard**, cliquez sur **"📦 Inventaire"**

Vous devriez voir :
```
📦 Inventaire
┌─────────────────────────────────┐
│ Aucun produit dans l'inventaire │
│                                 │
│   [+ Ajouter un produit]       │
└─────────────────────────────────┘
```

---

## ✅ Étape 4 : Ajouter un Produit Test (1 min)

1. Cliquez sur **"+ Ajouter un produit"**
2. Remplissez :
   - **Nom** : Coca-Cola 1.5L
   - **Catégorie** : Boissons
   - **Prix d'achat** : 400
   - **Prix de vente** : 600
   - **Quantité** : 24
3. Cliquez sur **"Ajouter"**

✅ **Votre premier produit est créé !**

---

## ✅ Étape 5 : Tester les Fonctionnalités (30 sec)

### Recherche
1. Tapez "coca" dans la barre de recherche
2. Le produit s'affiche

### Modification
1. Cliquez sur **"✏️ Modifier"**
2. Changez la quantité à **10**
3. Cliquez sur **"Modifier"**
4. Le statut passe à **🟡 Stock faible**

### Suppression
1. Cliquez sur **"🗑️ Supprimer"**
2. Confirmez
3. Le produit est supprimé

---

## 🎉 C'est Tout !

Votre module d'inventaire est **opérationnel** !

---

## 📚 Pour Aller Plus Loin

### Guides Complets
- 📘 **Guide utilisateur** : `GUIDE_MODULE_INVENTAIRE.md`
- 📗 **Doc technique** : `TECHNICAL_DOC_INVENTORY.md`
- 📙 **README complet** : `MODULE_INVENTAIRE_README.md`

### Fonctionnalités Avancées
- 🔍 Recherche par nom/catégorie
- 🏷️ Filtres par catégorie/statut
- 🔀 Tri par nom/prix/quantité/date
- 📊 Statistiques en temps réel

---

## 🐛 Problème ?

### Erreur "Permission denied"
➡️ Vérifiez l'Étape 1 (règles Firestore)

### Produit ne s'affiche pas
➡️ Rechargez la page (F5)

### Autre problème
➡️ Consultez `MODULE_INVENTAIRE_README.md` section Dépannage

---

## ⏱️ Temps Total : **5 minutes**

1. ✅ Déployer règles (2 min)
2. ✅ Lancer app (1 min)
3. ✅ Accéder inventaire (1 min)
4. ✅ Ajouter produit (1 min)

---

**C'est parti ! 🚀**


