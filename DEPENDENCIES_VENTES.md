# 📦 Dépendances - Module Ventes

## ✅ Packages installés

### Recharts (Graphiques)
```bash
npm install recharts
```

**Version installée** : Dernière version compatible  
**Utilisation** : LineChart, BarChart, PieChart  
**Plateforme** : Web uniquement (affiche un placeholder sur mobile)

---

## 📋 Package.json

Votre `package.json` devrait maintenant inclure :

```json
{
  "dependencies": {
    "react": "...",
    "react-native": "...",
    "firebase": "...",
    "recharts": "^2.x.x",
    ...
  }
}
```

---

## 🔧 Commandes utiles

### Démarrer l'application
```bash
npm start
```

### Installer les dépendances
```bash
npm install
```

### Vérifier les dépendances
```bash
npm list recharts
```

### Mettre à jour Recharts (si nécessaire)
```bash
npm update recharts
```

---

## ⚠️ Notes importantes

### Recharts sur React Native
- **Web** : Fonctionne parfaitement ✅
- **Mobile** : Affiche un message "Graphique disponible sur web" ⚠️

**Raison** : Recharts est basé sur SVG/DOM, incompatible avec React Native natif.

**Solution actuelle** : 
```javascript
{Platform.OS === 'web' ? (
  <LineChart ... />
) : (
  <Text>Graphique disponible sur web</Text>
)}
```

**Alternative future** (si nécessaire) :
- `react-native-chart-kit` (pour mobile)
- `react-native-svg-charts` (pour mobile)
- Victory Native (cross-platform)

---

## 🎯 Packages déjà présents

Ces packages sont **déjà installés** dans votre projet :

### Firebase
```bash
@react-native-firebase/app
@react-native-firebase/auth
@react-native-firebase/firestore
```

### React Navigation
```bash
@react-navigation/native
@react-navigation/stack
```

### React Native
```bash
react-native-gesture-handler
react-native-screens
react-native-safe-area-context
```

---

## ✅ Vérification de l'installation

Pour vérifier que tout est bien installé :

```bash
npm list --depth=0
```

Vous devriez voir :
- ✅ `recharts@2.x.x`
- ✅ `firebase@x.x.x`
- ✅ `react@x.x.x`
- ✅ `react-native@x.x.x`

---

## 🚨 En cas d'erreur

### Erreur : "recharts not found"
```bash
npm install recharts --save
```

### Erreur : "Module not found" après installation
```bash
# Supprimez node_modules et réinstallez
rm -rf node_modules
npm install
npm start
```

### Erreur sur web : "Can't resolve 'recharts'"
```bash
# Redémarrez le serveur
Ctrl+C
npm start
```

---

## 💡 Astuce

Si vous voulez **supprimer Recharts** (pour alléger le projet) :

```bash
npm uninstall recharts
```

Puis supprimez les imports dans `SalesScreen.js` et remplacez les graphiques par un message.

---

## 📊 Taille du package

| Package | Taille approx. | Impact |
|---------|----------------|--------|
| recharts | ~500 KB | Moyen |
| firebase | ~300 KB | Faible |
| react-navigation | ~200 KB | Faible |

**Total module Ventes** : ~1 MB (acceptable pour une app web)

---

## ✅ Checklist d'installation

- [x] `npm install recharts` exécuté
- [x] Pas d'erreurs dans la console
- [x] Application démarre correctement
- [x] Graphiques s'affichent sur web

---

**Si tout est coché, vous êtes prêt ! 🚀**

---

**Dernière mise à jour** : 23 Octobre 2025


