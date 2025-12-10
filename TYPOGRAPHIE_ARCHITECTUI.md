# ✍️ Typographie ArchitectUI

## Référence Rapide de Typographie

---

## 📏 Tailles de Police

### Extra Small (XS)
```
Taille: 11px
Usage: Très petits labels, badges, métadonnées
Code: theme.fonts.sizes.xs
```

**Exemple:**
```javascript
<Text style={{ fontSize: theme.fonts.sizes.xs }}>
  Métadonnée
</Text>
```

---

### Small (SM)
```
Taille: 13px
Usage: Labels, descriptions courtes, sous-titres mineurs
Code: theme.fonts.sizes.sm
```

**Exemple:**
```javascript
<Text style={{ 
  fontSize: theme.fonts.sizes.sm,
  color: theme.colors.textSecondary 
}}>
  Label ou description
</Text>
```

---

### Base
```
Taille: 15px
Usage: Texte par défaut, paragraphes, contenu principal
Code: theme.fonts.sizes.base
```

**Exemple:**
```javascript
<Text style={{ 
  fontSize: theme.fonts.sizes.base,
  color: theme.colors.textPrimary 
}}>
  Texte de paragraphe normal
</Text>
```

---

### Medium (MD)
```
Taille: 16px
Usage: Texte important, boutons, formulaires
Code: theme.fonts.sizes.md
```

**Exemple:**
```javascript
<Text style={{ 
  fontSize: theme.fonts.sizes.md,
  fontWeight: theme.fonts.weights.medium 
}}>
  Texte de bouton
</Text>
```

---

### Large (LG)
```
Taille: 18px
Usage: Sous-titres importants, texte mis en avant
Code: theme.fonts.sizes.lg
```

**Exemple:**
```javascript
<Text style={{ 
  fontSize: theme.fonts.sizes.lg,
  fontWeight: theme.fonts.weights.semibold,
  color: theme.colors.textPrimary 
}}>
  Sous-titre important
</Text>
```

---

### Extra Large (XL)
```
Taille: 22px
Usage: Titres de section, headers de cartes
Code: theme.fonts.sizes.xl
```

**Exemple:**
```javascript
<Text style={{ 
  fontSize: theme.fonts.sizes.xl,
  fontWeight: theme.fonts.weights.bold,
  color: theme.colors.textPrimary 
}}>
  Titre de Section
</Text>
```

---

### 2X Large (2XL)
```
Taille: 26px
Usage: Titres de page, headers principaux
Code: theme.fonts.sizes['2xl']
```

**Exemple:**
```javascript
<Text style={{ 
  fontSize: theme.fonts.sizes['2xl'],
  fontWeight: theme.fonts.weights.bold,
  color: theme.colors.textPrimary 
}}>
  Titre de Page
</Text>
```

---

### 3X Large (3XL)
```
Taille: 32px
Usage: Grands titres, valeurs importantes (statistiques)
Code: theme.fonts.sizes['3xl']
```

**Exemple:**
```javascript
<Text style={{ 
  fontSize: theme.fonts.sizes['3xl'],
  fontWeight: theme.fonts.weights.bold,
  color: theme.colors.textPrimary 
}}>
  12,450 $
</Text>
```

---

### 4X Large (4XL)
```
Taille: 40px
Usage: Très grands titres, hero headers
Code: theme.fonts.sizes['4xl']
```

**Exemple:**
```javascript
<Text style={{ 
  fontSize: theme.fonts.sizes['4xl'],
  fontWeight: theme.fonts.weights.extrabold,
  color: theme.colors.textPrimary 
}}>
  Bienvenue
</Text>
```

---

### 5X Large (5XL)
```
Taille: 48px
Usage: Titres hero, splash screens
Code: theme.fonts.sizes['5xl']
```

**Exemple:**
```javascript
<Text style={{ 
  fontSize: theme.fonts.sizes['5xl'],
  fontWeight: theme.fonts.weights.black,
  color: theme.colors.textPrimary 
}}>
  Hero Title
</Text>
```

---

## ⚖️ Poids de Police

### Light
```
Poids: 300
Usage: Texte très léger, design minimaliste
Code: theme.fonts.weights.light
```

---

### Regular
```
Poids: 400
Usage: Texte normal par défaut
Code: theme.fonts.weights.regular
```

---

### Medium
```
Poids: 500
Usage: Labels, texte légèrement accentué
Code: theme.fonts.weights.medium
```

**Recommandé pour:**
- Labels de formulaire
- Tabs actifs
- Sous-titres

---

### Semibold
```
Poids: 600
Usage: Titres, texte important
Code: theme.fonts.weights.semibold
```

**Recommandé pour:**
- Titres de section
- Boutons
- Headers de table
- Éléments cliquables

---

### Bold
```
Poids: 700
Usage: Titres principaux, emphase forte
Code: theme.fonts.weights.bold
```

**Recommandé pour:**
- Titres de page
- Valeurs importantes (prix, stats)
- Calls to action

---

### Extrabold
```
Poids: 800
Usage: Titres très marqués
Code: theme.fonts.weights.extrabold
```

---

### Black
```
Poids: 900
Usage: Titres ultra marqués, hero sections
Code: theme.fonts.weights.black
```

---

## 📐 Hauteurs de Ligne (Line Heights)

### Tight
```
Ratio: 1.2
Usage: Titres, texte compact
Code: theme.fonts.lineHeights.tight
```

**Exemple:**
```javascript
<Text style={{ 
  fontSize: theme.fonts.sizes['2xl'],
  lineHeight: theme.fonts.sizes['2xl'] * theme.fonts.lineHeights.tight 
}}>
  Titre Compact
</Text>
```

---

### Normal
```
Ratio: 1.5
Usage: Texte par défaut, lisibilité optimale
Code: theme.fonts.lineHeights.normal
```

**Exemple:**
```javascript
<Text style={{ 
  fontSize: theme.fonts.sizes.base,
  lineHeight: theme.fonts.sizes.base * theme.fonts.lineHeights.normal 
}}>
  Texte avec lisibilité optimale.
</Text>
```

---

### Relaxed
```
Ratio: 1.75
Usage: Paragraphes longs, lecture confortable
Code: theme.fonts.lineHeights.relaxed
```

**Exemple:**
```javascript
<Text style={{ 
  fontSize: theme.fonts.sizes.base,
  lineHeight: theme.fonts.sizes.base * theme.fonts.lineHeights.relaxed,
  color: theme.colors.textSecondary 
}}>
  Paragraphe long avec espacement généreux pour une lecture 
  confortable sur mobile et desktop.
</Text>
```

---

### Loose
```
Ratio: 2
Usage: Citations, texte très aéré
Code: theme.fonts.lineHeights.loose
```

---

## 🎯 Hiérarchie Typographique Recommandée

### Niveau 1 - Titre Hero
```javascript
{
  fontSize: theme.fonts.sizes['4xl'],        // 40px
  fontWeight: theme.fonts.weights.bold,      // 700
  color: theme.colors.textPrimary,           // #2C3E50
  lineHeight: theme.fonts.sizes['4xl'] * theme.fonts.lineHeights.tight
}
```

---

### Niveau 2 - Titre Principal
```javascript
{
  fontSize: theme.fonts.sizes['3xl'],        // 32px
  fontWeight: theme.fonts.weights.bold,      // 700
  color: theme.colors.textPrimary,           // #2C3E50
  marginBottom: theme.spacing.md
}
```

---

### Niveau 3 - Titre de Section
```javascript
{
  fontSize: theme.fonts.sizes['2xl'],        // 26px
  fontWeight: theme.fonts.weights.semibold,  // 600
  color: theme.colors.textPrimary,           // #2C3E50
  marginBottom: theme.spacing.sm
}
```

---

### Niveau 4 - Sous-titre
```javascript
{
  fontSize: theme.fonts.sizes.xl,            // 22px
  fontWeight: theme.fonts.weights.semibold,  // 600
  color: theme.colors.textPrimary,           // #2C3E50
}
```

---

### Niveau 5 - Titre de Carte
```javascript
{
  fontSize: theme.fonts.sizes.lg,            // 18px
  fontWeight: theme.fonts.weights.semibold,  // 600
  color: theme.colors.textPrimary,           // #2C3E50
}
```

---

### Texte Normal
```javascript
{
  fontSize: theme.fonts.sizes.base,          // 15px
  fontWeight: theme.fonts.weights.regular,   // 400
  color: theme.colors.textPrimary,           // #2C3E50
  lineHeight: theme.fonts.sizes.base * theme.fonts.lineHeights.normal
}
```

---

### Texte Secondaire
```javascript
{
  fontSize: theme.fonts.sizes.base,          // 15px
  fontWeight: theme.fonts.weights.regular,   // 400
  color: theme.colors.textSecondary,         // #546E7A
  lineHeight: theme.fonts.sizes.base * theme.fonts.lineHeights.relaxed
}
```

---

### Label / Caption
```javascript
{
  fontSize: theme.fonts.sizes.sm,            // 13px
  fontWeight: theme.fonts.weights.medium,    // 500
  color: theme.colors.textSecondary,         // #546E7A
}
```

---

### Petit Texte / Helper
```javascript
{
  fontSize: theme.fonts.sizes.sm,            // 13px
  fontWeight: theme.fonts.weights.regular,   // 400
  color: theme.colors.textTertiary,          // #90A4AE
}
```

---

## 💼 Cas d'Usage par Composant

### Boutons

**Bouton Principal:**
```javascript
{
  fontSize: theme.fonts.sizes.md,            // 16px
  fontWeight: theme.fonts.weights.semibold,  // 600
  color: theme.colors.textInverse,           // #FFFFFF
}
```

**Bouton Petit:**
```javascript
{
  fontSize: theme.fonts.sizes.sm,            // 13px
  fontWeight: theme.fonts.weights.medium,    // 500
  color: theme.colors.textInverse,           // #FFFFFF
}
```

---

### Formulaires

**Label d'Input:**
```javascript
{
  fontSize: theme.fonts.sizes.sm,            // 13px
  fontWeight: theme.fonts.weights.medium,    // 500
  color: theme.colors.textPrimary,           // #2C3E50
  marginBottom: theme.spacing.xs
}
```

**Input:**
```javascript
{
  fontSize: theme.fonts.sizes.md,            // 16px
  fontWeight: theme.fonts.weights.regular,   // 400
  color: theme.colors.textPrimary,           // #2C3E50
}
```

**Placeholder:**
```javascript
{
  fontSize: theme.fonts.sizes.md,            // 16px
  color: theme.colors.placeholder,           // #90A4AE
}
```

**Message d'Erreur:**
```javascript
{
  fontSize: theme.fonts.sizes.sm,            // 13px
  color: theme.colors.danger,                // #F85C7F
  marginTop: theme.spacing.xs
}
```

---

### Cartes de Statistiques

**Label:**
```javascript
{
  fontSize: theme.fonts.sizes.sm,            // 13px
  fontWeight: theme.fonts.weights.medium,    // 500
  color: theme.colors.textSecondary,         // #546E7A
}
```

**Valeur:**
```javascript
{
  fontSize: theme.fonts.sizes['3xl'],        // 32px
  fontWeight: theme.fonts.weights.bold,      // 700
  color: theme.colors.textPrimary,           // #2C3E50
}
```

**Pourcentage:**
```javascript
{
  fontSize: theme.fonts.sizes.sm,            // 13px
  fontWeight: theme.fonts.weights.semibold,  // 600
  color: theme.colors.success,               // #00C48C (ou danger)
}
```

---

### Tables

**Header:**
```javascript
{
  fontSize: theme.fonts.sizes.sm,            // 13px
  fontWeight: theme.fonts.weights.semibold,  // 600
  color: theme.colors.textSecondary,         // #546E7A
  textTransform: 'uppercase',
}
```

**Cellule:**
```javascript
{
  fontSize: theme.fonts.sizes.base,          // 15px
  fontWeight: theme.fonts.weights.regular,   // 400
  color: theme.colors.textPrimary,           // #2C3E50
}
```

---

### Badges

**Badge Normal:**
```javascript
{
  fontSize: theme.fonts.sizes.sm,            // 13px
  fontWeight: theme.fonts.weights.semibold,  // 600
  color: theme.colors.textInverse,           // #FFFFFF
}
```

**Badge Petit:**
```javascript
{
  fontSize: theme.fonts.sizes.xs,            // 11px
  fontWeight: theme.fonts.weights.semibold,  // 600
  color: theme.colors.textInverse,           // #FFFFFF
}
```

---

## 📱 Responsive (Mobile vs Desktop)

### Mobile (< 768px)
- Réduire les tailles de 10-15% si nécessaire
- Augmenter les line-heights pour meilleure lisibilité tactile
- Minimum de 16px pour les inputs (évite le zoom automatique iOS)

### Tablet (768px - 1024px)
- Utiliser les tailles par défaut
- Espacement généreux

### Desktop (> 1024px)
- Utiliser les tailles par défaut ou légèrement augmentées
- Peut utiliser des line-heights plus serrés

---

## 🎨 Combinaisons Recommandées

### Titre + Description
```javascript
// Titre
<Text style={{
  fontSize: theme.fonts.sizes['2xl'],
  fontWeight: theme.fonts.weights.bold,
  color: theme.colors.textPrimary,
  marginBottom: theme.spacing.xs
}}>
  Titre Principal
</Text>

// Description
<Text style={{
  fontSize: theme.fonts.sizes.base,
  color: theme.colors.textSecondary,
  lineHeight: theme.fonts.sizes.base * theme.fonts.lineHeights.relaxed
}}>
  Description qui accompagne le titre avec plus de détails.
</Text>
```

---

### Valeur + Label
```javascript
// Label
<Text style={{
  fontSize: theme.fonts.sizes.sm,
  fontWeight: theme.fonts.weights.medium,
  color: theme.colors.textSecondary,
  marginBottom: theme.spacing.xs
}}>
  Revenus Totaux
</Text>

// Valeur
<Text style={{
  fontSize: theme.fonts.sizes['3xl'],
  fontWeight: theme.fonts.weights.bold,
  color: theme.colors.textPrimary
}}>
  24,850 €
</Text>
```

---

## 💾 Import et Utilisation

```javascript
import { theme } from './src/styles/theme';

const styles = StyleSheet.create({
  title: {
    fontSize: theme.fonts.sizes['2xl'],
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
  },
  
  body: {
    fontSize: theme.fonts.sizes.base,
    lineHeight: theme.fonts.sizes.base * theme.fonts.lineHeights.normal,
    color: theme.colors.textSecondary,
  },
});
```

---

**Dernière mise à jour** : Octobre 2025  
**Version** : 1.0  
**Basé sur** : ArchitectUI Dashboard Template


