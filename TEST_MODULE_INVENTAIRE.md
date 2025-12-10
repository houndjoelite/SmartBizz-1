# 🧪 Tests du Module Inventaire

## ✅ CHECKLIST DE TEST COMPLÈTE

Suivez cette checklist pour tester toutes les fonctionnalités du module d'inventaire.

---

## 🚀 ÉTAPE 0 : Prérequis

Avant de commencer les tests :

- [ ] Firebase règles déployées (voir `QUICK_START_INVENTORY.md`)
- [ ] Application lancée (`npm start`)
- [ ] Compte utilisateur créé et connecté
- [ ] Dashboard accessible

---

## 📦 ÉTAPE 1 : Accès au Module

### Test 1.1 : Navigation depuis le Dashboard

1. [ ] Sur le Dashboard, vérifier que le bouton "📦 Inventaire" est visible dans le menu
2. [ ] Cliquer sur "📦 Inventaire"
3. [ ] ✅ **Résultat attendu** : L'écran d'inventaire s'ouvre

### Test 1.2 : État Vide Initial

1. [ ] Vérifier que l'écran affiche "Aucun produit dans l'inventaire"
2. [ ] Vérifier que le bouton "+ Ajouter un produit" est visible
3. [ ] Vérifier que les statistiques affichent 0 partout
4. [ ] ✅ **Résultat attendu** : Écran vide avec invitation à ajouter un produit

---

## ➕ ÉTAPE 2 : Ajout de Produits

### Test 2.1 : Ouvrir le Modal

1. [ ] Cliquer sur "+ Ajouter un produit"
2. [ ] ✅ **Résultat attendu** : Modal s'ouvre avec le formulaire

### Test 2.2 : Validation des Champs

#### Test 2.2.1 : Nom requis
1. [ ] Laisser le champ "Nom" vide
2. [ ] Remplir les autres champs
3. [ ] Cliquer sur "Ajouter"
4. [ ] ✅ **Résultat attendu** : Erreur "Le nom du produit est requis"

#### Test 2.2.2 : Prix requis
1. [ ] Remplir le nom
2. [ ] Laisser le prix de vente vide
3. [ ] Cliquer sur "Ajouter"
4. [ ] ✅ **Résultat attendu** : Erreur sur le prix

#### Test 2.2.3 : Quantité requise
1. [ ] Remplir nom et prix
2. [ ] Laisser la quantité vide
3. [ ] Cliquer sur "Ajouter"
4. [ ] ✅ **Résultat attendu** : Erreur sur la quantité

### Test 2.3 : Ajout Produit 1 (Disponible)

1. [ ] Remplir :
   - Nom : "Coca-Cola 1.5L"
   - Catégorie : "Boissons"
   - Prix d'achat : 400
   - Prix de vente : 600
   - Quantité : 24
   - Description : "Boisson gazeuse sucrée"
2. [ ] Cliquer sur "Ajouter"
3. [ ] ✅ **Résultat attendu** :
   - Modal se ferme
   - Alert "Produit ajouté avec succès"
   - Produit apparaît dans la liste
   - Badge 🟢 "Disponible"
   - Stats : Total = 1, Disponible = 1
   - Valeur totale = 14400 FCFA (600 × 24)

### Test 2.4 : Ajout Produit 2 (Stock Faible)

1. [ ] Ajouter :
   - Nom : "Pain de mie"
   - Catégorie : "Alimentation"
   - Prix d'achat : 200
   - Prix de vente : 300
   - Quantité : 3
2. [ ] ✅ **Résultat attendu** :
   - Badge 🟡 "Stock faible"
   - Stats : Total = 2, Disponible = 1, Faible = 1

### Test 2.5 : Ajout Produit 3 (Rupture)

1. [ ] Ajouter :
   - Nom : "Savon Lux"
   - Catégorie : "Cosmétiques"
   - Prix de vente : 500
   - Quantité : 0
2. [ ] ✅ **Résultat attendu** :
   - Badge 🔴 "Rupture de stock"
   - Stats : Total = 3, Rupture = 1

---

## 🔍 ÉTAPE 3 : Recherche

### Test 3.1 : Recherche par Nom

1. [ ] Taper "coca" dans la barre de recherche
2. [ ] ✅ **Résultat attendu** : Seul "Coca-Cola 1.5L" s'affiche

### Test 3.2 : Recherche par Catégorie

1. [ ] Taper "boissons"
2. [ ] ✅ **Résultat attendu** : Seul "Coca-Cola 1.5L" s'affiche

### Test 3.3 : Recherche Vide

1. [ ] Effacer la recherche (cliquer sur ✕)
2. [ ] ✅ **Résultat attendu** : Tous les produits s'affichent

### Test 3.4 : Recherche Sans Résultat

1. [ ] Taper "xyz123"
2. [ ] ✅ **Résultat attendu** : "Aucun produit trouvé"

---

## 🏷️ ÉTAPE 4 : Filtres

### Test 4.1 : Ouvrir le Panneau de Filtres

1. [ ] Cliquer sur "▼ Filtres"
2. [ ] ✅ **Résultat attendu** : Panneau de filtres s'ouvre

### Test 4.2 : Filtre par Catégorie

1. [ ] Cliquer sur "Boissons"
2. [ ] ✅ **Résultat attendu** : Seul "Coca-Cola" s'affiche

3. [ ] Cliquer sur "Toutes"
4. [ ] ✅ **Résultat attendu** : Tous les produits s'affichent

### Test 4.3 : Filtre par Statut

1. [ ] Cliquer sur "🟢 Disponible"
2. [ ] ✅ **Résultat attendu** : Seul "Coca-Cola" s'affiche

3. [ ] Cliquer sur "🟡 Faible"
4. [ ] ✅ **Résultat attendu** : Seul "Pain de mie" s'affiche

5. [ ] Cliquer sur "🔴 Rupture"
6. [ ] ✅ **Résultat attendu** : Seul "Savon Lux" s'affiche

---

## 🔀 ÉTAPE 5 : Tri

### Test 5.1 : Tri par Nom

1. [ ] Cliquer sur "Nom"
2. [ ] ✅ **Résultat attendu** : Produits triés alphabétiquement (A→Z)

3. [ ] Cliquer à nouveau sur "Nom"
4. [ ] ✅ **Résultat attendu** : Ordre inversé (Z→A)

### Test 5.2 : Tri par Quantité

1. [ ] Cliquer sur "Quantité"
2. [ ] ✅ **Résultat attendu** : Ordre croissant (0, 3, 24)

### Test 5.3 : Tri par Prix

1. [ ] Cliquer sur "Prix"
2. [ ] ✅ **Résultat attendu** : Ordre croissant (300, 500, 600)

### Test 5.4 : Tri par Date

1. [ ] Cliquer sur "Date"
2. [ ] ✅ **Résultat attendu** : Plus récents en premier

---

## ✏️ ÉTAPE 6 : Modification

### Test 6.1 : Ouvrir le Modal de Modification

1. [ ] Trouver "Coca-Cola 1.5L"
2. [ ] Cliquer sur "✏️ Modifier"
3. [ ] ✅ **Résultat attendu** :
   - Modal s'ouvre
   - Titre = "Modifier le produit"
   - Tous les champs pré-remplis

### Test 6.2 : Modifier la Quantité (Disponible → Faible)

1. [ ] Changer la quantité de 24 à 4
2. [ ] Cliquer sur "Modifier"
3. [ ] ✅ **Résultat attendu** :
   - Badge passe de 🟢 à 🟡
   - Stats : Disponible = 0, Faible = 2
   - Valeur totale recalculée

### Test 6.3 : Modifier la Quantité (Faible → Rupture)

1. [ ] Modifier "Pain de mie"
2. [ ] Mettre la quantité à 0
3. [ ] ✅ **Résultat attendu** :
   - Badge 🔴
   - Stats : Faible = 1, Rupture = 2

### Test 6.4 : Modifier la Quantité (Rupture → Disponible)

1. [ ] Modifier "Savon Lux"
2. [ ] Mettre la quantité à 10
3. [ ] ✅ **Résultat attendu** :
   - Badge 🟢
   - Stats : Disponible = 1, Rupture = 1

### Test 6.5 : Modifier le Prix

1. [ ] Modifier "Coca-Cola"
2. [ ] Changer le prix de vente de 600 à 700
3. [ ] ✅ **Résultat attendu** :
   - Prix affiché : 700 FCFA
   - Marge recalculée
   - Valeur totale recalculée

### Test 6.6 : Modifier le Nom

1. [ ] Modifier "Coca-Cola 1.5L"
2. [ ] Changer en "Coca-Cola 1L"
3. [ ] ✅ **Résultat attendu** : Nom mis à jour

---

## 🗑️ ÉTAPE 7 : Suppression

### Test 7.1 : Annuler la Suppression

1. [ ] Trouver "Pain de mie"
2. [ ] Cliquer sur "🗑️ Supprimer"
3. [ ] Cliquer sur "Annuler" dans la confirmation
4. [ ] ✅ **Résultat attendu** : Produit toujours présent

### Test 7.2 : Confirmer la Suppression

1. [ ] Cliquer à nouveau sur "🗑️ Supprimer"
2. [ ] Cliquer sur "Supprimer" dans la confirmation
3. [ ] ✅ **Résultat attendu** :
   - Produit supprimé de la liste
   - Stats recalculées
   - Alert "Produit supprimé avec succès"

---

## 📊 ÉTAPE 8 : Statistiques

### Test 8.1 : Vérifier les Statistiques

Après avoir :
- Ajouté 3 produits
- Modifié quelques quantités
- Supprimé 1 produit

1. [ ] Vérifier que les stats sont cohérentes :
   - Total = nombre de produits
   - Disponible + Faible + Rupture = Total
   - Valeur totale = somme des (prix × quantité)

---

## 🔄 ÉTAPE 9 : Pull-to-Refresh

### Test 9.1 : Rafraîchir (Mobile)

1. [ ] Tirer la liste vers le bas
2. [ ] ✅ **Résultat attendu** :
   - Spinner de chargement
   - Données rechargées depuis Firestore

### Test 9.2 : Rafraîchir (Web)

1. [ ] Appuyer sur F5
2. [ ] ✅ **Résultat attendu** : Données rechargées

---

## 🔙 ÉTAPE 10 : Navigation

### Test 10.1 : Retour au Dashboard

1. [ ] Cliquer sur "← Retour"
2. [ ] ✅ **Résultat attendu** : Retour au Dashboard

### Test 10.2 : Revenir à l'Inventaire

1. [ ] Cliquer à nouveau sur "📦 Inventaire"
2. [ ] ✅ **Résultat attendu** :
   - Inventaire s'ouvre
   - Produits toujours présents

---

## 🔐 ÉTAPE 11 : Sécurité

### Test 11.1 : Isolation des Données

1. [ ] Se déconnecter
2. [ ] Se connecter avec un autre compte
3. [ ] Aller dans Inventaire
4. [ ] ✅ **Résultat attendu** : Inventaire vide (pas les produits de l'autre utilisateur)

5. [ ] Ajouter un produit
6. [ ] Se déconnecter
7. [ ] Se reconnecter avec le premier compte
8. [ ] ✅ **Résultat attendu** : Produits du premier utilisateur visibles, pas ceux du second

---

## 📱 ÉTAPE 12 : Responsive

### Test 12.1 : Desktop (> 768px)

1. [ ] Ouvrir sur un grand écran
2. [ ] ✅ **Résultat attendu** :
   - Cartes larges
   - Statistiques en ligne
   - Filtres sur une ligne

### Test 12.2 : Mobile (< 768px)

1. [ ] Ouvrir sur mobile ou réduire la fenêtre
2. [ ] ✅ **Résultat attendu** :
   - Cartes empilées
   - Statistiques en grille
   - Scroll horizontal pour filtres

---

## 🌐 ÉTAPE 13 : Scroll (Correction Web)

### Test 13.1 : Scroll avec la Souris

1. [ ] Utiliser la molette de la souris
2. [ ] ✅ **Résultat attendu** : La page défile

### Test 13.2 : Barre de Défilement

1. [ ] Vérifier la présence de la barre à droite
2. [ ] Cliquer et glisser
3. [ ] ✅ **Résultat attendu** : La page défile

---

## 🎯 ÉTAPE 14 : Scénario Complet

### Test 14.1 : Scénario Réaliste

1. [ ] Ajouter 10 produits de catégories différentes
2. [ ] Rechercher "coca"
3. [ ] Filtrer par catégorie "Boissons"
4. [ ] Trier par prix
5. [ ] Modifier 2 produits
6. [ ] Supprimer 1 produit
7. [ ] Vérifier les statistiques
8. [ ] Retour au Dashboard
9. [ ] Revenir à l'inventaire
10. [ ] ✅ **Résultat attendu** : Tout fonctionne parfaitement

---

## ✅ RÉSULTATS ATTENDUS GLOBAUX

### Fonctionnalités Core
- [x] Ajout de produits
- [x] Modification de produits
- [x] Suppression de produits
- [x] Recherche fonctionnelle
- [x] Filtres fonctionnels
- [x] Tri fonctionnel

### UX
- [x] Messages clairs en français
- [x] Loading states
- [x] Confirmations
- [x] Validation avec messages d'erreur
- [x] Responsive

### Performance
- [x] Chargement rapide (< 1s)
- [x] Recherche instantanée
- [x] Aucun lag lors du scroll

### Sécurité
- [x] Isolation par utilisateur
- [x] Authentification requise
- [x] Validation des données

---

## 📋 CHECKLIST RÉCAPITULATIVE

Au total, vous devriez avoir testé :

- [ ] **14 étapes** principales
- [ ] **50+ tests** individuels
- [ ] Toutes les fonctionnalités CRUD
- [ ] Tous les filtres et tris
- [ ] Tous les états (loading, empty, error)
- [ ] Navigation complète
- [ ] Sécurité et isolation
- [ ] Responsive design
- [ ] Scroll (correction web)

---

## 🐛 En Cas de Problème

Si un test échoue :

1. Vérifiez la console (F12) pour les erreurs
2. Vérifiez Firebase Console → Firestore Database
3. Vérifiez que les règles Firestore sont déployées
4. Rechargez la page (F5)
5. Consultez `MODULE_INVENTAIRE_README.md` section Dépannage

---

## ✅ VALIDATION FINALE

Si tous les tests passent :

🎉 **FÉLICITATIONS !**

Votre module d'inventaire est **100% fonctionnel** et prêt pour la production !

---

**Tests effectués le :** _______________  
**Par :** _______________  
**Résultat global :** ☐ ✅ PASS   ☐ ❌ FAIL  
**Commentaires :** _______________________________________

---

**Bon test ! 🧪**


