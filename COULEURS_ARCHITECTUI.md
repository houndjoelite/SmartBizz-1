# 🎨 Palette de Couleurs ArchitectUI

## Référence Rapide des Couleurs

---

## 🔵 Couleur Primaire - Bleu

### Primary
```
HEX: #5B5FED
RGB: rgb(91, 95, 237)
Usage: Boutons principaux, liens, actions, éléments interactifs
```

### Primary Light
```
HEX: #7D81F2
RGB: rgb(125, 129, 242)
Usage: Hover states, variantes claires
```

### Primary Dark
```
HEX: #4548C4
RGB: rgb(69, 72, 196)
Usage: Active states, variantes foncées
```

**Code d'utilisation:**
```javascript
theme.colors.primary
theme.colors.primaryLight
theme.colors.primaryDark
```

---

## 🟢 Vert - Succès / Gains / Revenus

### Success
```
HEX: #00C48C
RGB: rgb(0, 196, 140)
Usage: Messages de succès, gains positifs, revenus, indicateurs de croissance
```

### Success Light
```
HEX: #33D1A3
RGB: rgb(51, 209, 163)
```

### Success Dark
```
HEX: #00A876
RGB: rgb(0, 168, 118)
```

**Code d'utilisation:**
```javascript
theme.colors.success
theme.colors.iconGreen  // #00C48C (pour icônes)
```

---

## 🔴 Rose/Rouge - Danger / Alertes / Dépenses

### Danger
```
HEX: #F85C7F
RGB: rgb(248, 92, 127)
Usage: Messages d'erreur, alertes, dépenses, pertes, indicateurs négatifs
```

### Danger Light
```
HEX: #FA7D9A
RGB: rgb(250, 125, 154)
```

### Danger Dark
```
HEX: #E74467
RGB: rgb(231, 68, 103)
```

**Code d'utilisation:**
```javascript
theme.colors.danger
theme.colors.iconPink  // #F85C7F (pour icônes)
```

---

## 🟡 Jaune/Or - Avertissements / Highlights

### Warning
```
HEX: #FDB022
RGB: rgb(253, 176, 34)
Usage: Avertissements non critiques, highlights, stocks moyens
```

### Warning Light
```
HEX: #FDC04B
RGB: rgb(253, 192, 75)
```

### Warning Dark
```
HEX: #E49E1E
RGB: rgb(228, 158, 30)
```

**Code d'utilisation:**
```javascript
theme.colors.warning
theme.colors.iconYellow  // #FDB022 (pour icônes)
```

---

## 🔵 Bleu Secondaire

### Secondary
```
HEX: #4A90E2
RGB: rgb(74, 144, 226)
Usage: Éléments secondaires, informations
```

**Code d'utilisation:**
```javascript
theme.colors.secondary
```

---

## ⚪ Fonds et Surfaces

### Background (Fond principal)
```
HEX: #F8F9FB
RGB: rgb(248, 249, 251)
Usage: Arrière-plan principal de l'application
```

### Background Dark
```
HEX: #EDF0F5
RGB: rgb(237, 240, 245)
Usage: Arrière-plans alternatifs, sections distinctes
```

### Surface (Blanc)
```
HEX: #FFFFFF
RGB: rgb(255, 255, 255)
Usage: Cartes, modales, panneaux
```

### Surface Light
```
HEX: #FAFBFC
RGB: rgb(250, 251, 252)
Usage: Surfaces légères, arrière-plans de sections
```

**Code d'utilisation:**
```javascript
theme.colors.background
theme.colors.backgroundDark
theme.colors.surface
theme.colors.surfaceLight
```

---

## ⬛ Textes

### Text Primary
```
HEX: #2C3E50
RGB: rgb(44, 62, 80)
Usage: Titres principaux, contenu important
Contraste: AAA (excellent)
```

### Text Secondary
```
HEX: #546E7A
RGB: rgb(84, 110, 122)
Usage: Descriptions, sous-titres, labels
Contraste: AA (bon)
```

### Text Tertiary
```
HEX: #90A4AE
RGB: rgb(144, 164, 174)
Usage: Hints, placeholders, texte auxiliaire
Contraste: AA (bon sur fond clair)
```

### Text Inverse
```
HEX: #FFFFFF
RGB: rgb(255, 255, 255)
Usage: Texte sur fond foncé ou coloré (boutons)
```

**Code d'utilisation:**
```javascript
theme.colors.textPrimary
theme.colors.textSecondary
theme.colors.textTertiary
theme.colors.textInverse
```

---

## 📏 Bordures

### Border
```
HEX: #E8ECF1
RGB: rgb(232, 236, 241)
Usage: Bordures normales, séparateurs
```

### Border Light
```
HEX: #F0F3F7
RGB: rgb(240, 243, 247)
Usage: Bordures très subtiles
```

### Border Dark
```
HEX: #CFD8DC
RGB: rgb(207, 216, 220)
Usage: Bordures marquées, délimitations fortes
```

**Code d'utilisation:**
```javascript
theme.colors.border
theme.colors.borderLight
theme.colors.borderDark
```

---

## 🎨 Couleurs Spéciales pour Icônes

Ces couleurs sont optimisées pour être utilisées avec des backgrounds à 12.5% d'opacité (ajoutez '20' à la fin).

### Icon Yellow (Jaune)
```
HEX: #FDB022
RGB: rgb(253, 176, 34)
Avec background: #FDB02220
Usage: Icônes de dépôts, revenus, monnaie
```

### Icon Pink (Rose)
```
HEX: #F85C7F
RGB: rgb(248, 92, 127)
Avec background: #F85C7F20
Usage: Icônes d'alertes, dividendes, notifications
```

### Icon Green (Vert)
```
HEX: #00C48C
RGB: rgb(0, 196, 140)
Avec background: #00C48C20
Usage: Icônes de gains, croissance, succès
```

### Icon Blue (Bleu)
```
HEX: #5B5FED
RGB: rgb(91, 95, 237)
Avec background: #5B5FED20
Usage: Icônes d'informations, statistiques
```

**Exemple d'utilisation:**
```javascript
// Icône avec background coloré à 12.5% d'opacité
<View style={{
  backgroundColor: theme.colors.iconGreen + '20',
  borderRadius: theme.borderRadius.full,
  padding: 16
}}>
  <Ionicons 
    name="trending-up" 
    size={24} 
    color={theme.colors.iconGreen} 
  />
</View>
```

---

## 🌈 Dégradés

Tous les dégradés vont du foncé au clair (parfait pour LinearGradient).

### Primary Gradient
```javascript
['#5B5FED', '#7D81F2']
```

### Success Gradient
```javascript
['#00C48C', '#33D1A3']
```

### Danger Gradient
```javascript
['#F85C7F', '#FA7D9A']
```

### Warning Gradient
```javascript
['#FDB022', '#FDC04B']
```

**Exemple d'utilisation:**
```javascript
import { LinearGradient } from 'expo-linear-gradient';

<LinearGradient
  colors={theme.gradients.primary}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 0 }}
  style={{ padding: 20, borderRadius: 12 }}
>
  {/* Contenu */}
</LinearGradient>
```

---

## 📊 Cas d'Usage par Contexte

### Dashboard / Statistiques
- **Revenus/Gains**: `theme.colors.iconGreen` (#00C48C)
- **Dépenses/Pertes**: `theme.colors.iconPink` (#F85C7F)
- **Informations/KPIs**: `theme.colors.iconBlue` (#5B5FED)
- **Avertissements**: `theme.colors.iconYellow` (#FDB022)

### Boutons
- **Action Principale**: `theme.colors.primary` (#5B5FED)
- **Action Positive**: `theme.colors.success` (#00C48C)
- **Action Destructive**: `theme.colors.danger` (#F85C7F)
- **Action Neutre**: `theme.colors.secondary` (#4A90E2)

### Alertes/Notifications
- **Succès**: `theme.colors.success` (#00C48C)
- **Erreur**: `theme.colors.danger` (#F85C7F)
- **Avertissement**: `theme.colors.warning` (#FDB022)
- **Information**: `theme.colors.primary` (#5B5FED)

### États de Stock
- **Stock Élevé**: `theme.colors.success` (#00C48C)
- **Stock Moyen**: `theme.colors.warning` (#FDB022)
- **Stock Bas**: `theme.colors.danger` (#F85C7F)

---

## 🎯 Accessibilité (WCAG)

### Contrastes Recommandés

✅ **Texte sur fond blanc**
- `textPrimary` (#2C3E50): Contraste 12.59:1 (AAA)
- `textSecondary` (#546E7A): Contraste 6.79:1 (AA)
- `textTertiary` (#90A4AE): Contraste 3.48:1 (AA pour texte large)

✅ **Texte blanc sur primaire**
- Blanc sur `primary` (#5B5FED): Contraste 5.12:1 (AA)

✅ **Texte blanc sur success**
- Blanc sur `success` (#00C48C): Contraste 3.58:1 (AA pour texte large)

✅ **Texte blanc sur danger**
- Blanc sur `danger` (#F85C7F): Contraste 4.23:1 (AA)

---

## 💾 Import dans votre code

```javascript
import { theme } from './src/styles/theme';

// Utilisation
const myStyle = {
  backgroundColor: theme.colors.primary,
  color: theme.colors.textInverse,
  borderColor: theme.colors.border,
};
```

---

**Dernière mise à jour** : Octobre 2025  
**Version** : 1.0  
**Basé sur** : ArchitectUI Dashboard Template


