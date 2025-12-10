# 🔧 Dépannage - Module Ventes

## ❌ Problème: Page blanche

### Cause
- Recharts incompatible avec React Native Web
- Erreur de compilation JavaScript

### ✅ Solution appliquée
- Recharts supprimé (`npm uninstall recharts`)
- Graphiques remplacés par barres CSS natives
- Code simplifié et compatible

---

## ❌ Problème: Erreur 500 (Internal Server Error)

### Cause
- Le serveur de développement a crashé
- Erreur de compilation dans le code

### ✅ Solution
1. **Arrêter tous les processus Node** :
   ```bash
   taskkill /F /IM node.exe
   ```

2. **Redémarrer le serveur** :
   ```bash
   npm start
   ```

---

## ❌ Problème: "Cannot read properties of undefined (reading 'bodyStream')"

### Cause
- Problème réseau avec Expo CLI
- Cache corrompu

### ✅ Solutions

**Option 1 : Utiliser npm start**
```bash
npm start
```

**Option 2 : Nettoyer le cache**
```bash
npx expo start --clear
```

**Option 3 : Supprimer cache et node_modules**
```bash
rm -rf node_modules .expo
npm install
npm start
```

---

## ❌ Problème: Les statistiques ne s'affichent pas

### Cause
- Aucune vente enregistrée
- Erreur dans le chargement des données Firestore

### ✅ Solution
1. Vérifiez la console (F12) pour les erreurs
2. Assurez-vous d'avoir :
   - ✅ Au moins 1 produit en stock
   - ✅ Règles Firestore déployées
   - ✅ Connecté avec un compte vérifié

3. Enregistrez une vente de test

---

## ❌ Problème: "Permission denied" Firestore

### Cause
- Règles Firestore pas déployées
- Utilisateur non authentifié

### ✅ Solution
1. **Déployez les règles** :
   - Allez sur https://console.firebase.google.com
   - Firestore Database → Règles
   - Copiez le contenu de `firestore.rules`
   - Publiez

2. **Vérifiez l'authentification** :
   - Déconnectez-vous
   - Reconnectez-vous

---

## ✅ Checklist de vérification

### Avant de démarrer :
- [ ] Node.js installé
- [ ] Dépendances installées (`npm install`)
- [ ] Firebase configuré (`src/services/firebase.js`)
- [ ] Règles Firestore déployées

### Pour tester :
- [ ] Serveur démarré (`npm start`)
- [ ] Navigateur ouvert (http://localhost:19006)
- [ ] Connecté avec un compte
- [ ] Au moins 1 produit en stock
- [ ] Navigation "Ventes" accessible

---

## 🔍 Debug : Console du navigateur

**Appuyez sur F12** → Onglet "Console"

### Messages normaux (OK) :
```
🎯 SalesScreen - Rendu
📊 SalesScreen - sales: 0
📈 SalesScreen - stats: {...}
✅ Rendu de l'écran complet
```

### Messages d'erreur (à corriger) :
```
❌ Permission denied
→ Règles Firestore pas déployées

❌ User is not authenticated
→ Reconnectez-vous

❌ Cannot read property 'map' of undefined
→ Données non chargées, vérifiez Firestore
```

---

## 🚀 Commandes utiles

### Démarrer le serveur
```bash
npm start
```

### Arrêter tous les processus Node
```bash
# Windows
taskkill /F /IM node.exe

# Mac/Linux
killall node
```

### Nettoyer et réinstaller
```bash
rm -rf node_modules
npm install
```

### Vider le cache Expo
```bash
npx expo start --clear
```

---

## 📞 Support rapide

**Si rien ne fonctionne** :

1. **Copiez les messages d'erreur** de la console (F12)
2. **Vérifiez les fichiers** :
   - `src/services/salesService.js` existe ?
   - `src/hooks/useSales.js` existe ?
   - `src/screens/SalesScreen.js` existe ?
3. **Vérifiez Firebase** :
   - Règles déployées ?
   - Collections `sales`, `inventory` créées ?

---

## ✅ Solution alternative (si tout échoue)

**Version minimale sans graphiques** :

Ouvrez `src/screens/SalesScreen.js` et commentez la section "Analyse des performances" :

```javascript
// {/* Section Analyse des performances */}
// ... tout le bloc ...
```

Gardez uniquement :
- Les 6 cartes d'indicateurs
- La timeline
- La vente rapide

---

**Dernière mise à jour** : 23 Octobre 2025



