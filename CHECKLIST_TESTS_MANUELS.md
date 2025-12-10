# ✅ Checklist de Tests Manuels

## 🎯 Avant de Commencer

### Prérequis
- [ ] Règles Firestore déployées
- [ ] Règles Storage déployées  
- [ ] Application démarrée (`npm start` ou `expo start`)
- [ ] Connexion internet active

---

## 1️⃣ Module Authentification (10 min)

### Inscription
- [ ] Ouvrir l'application
- [ ] Cliquer sur "Créer un compte"
- [ ] Remplir : nom, email, mot de passe
- [ ] Cliquer "S'inscrire"
- [ ] ✅ **Résultat attendu** : Redirection vers VerifyEmail

### Vérification Email
- [ ] Ouvrir l'email de vérification
- [ ] Cliquer sur le lien de vérification
- [ ] Revenir à l'application
- [ ] Cliquer "J'ai vérifié mon email"
- [ ] ✅ **Résultat attendu** : Accès au Dashboard

### Déconnexion / Reconnexion
- [ ] Se déconnecter depuis Dashboard ou Paramètres
- [ ] Se reconnecter avec email et mot de passe
- [ ] ✅ **Résultat attendu** : Accès immédiat au Dashboard (email déjà vérifié)

### Mot de Passe Oublié
- [ ] Sur Login, cliquer "Mot de passe oublié ?"
- [ ] Entrer l'email
- [ ] Cliquer "Réinitialiser"
- [ ] ✅ **Résultat attendu** : Email de réinitialisation envoyé

---

## 2️⃣ Module Dashboard (5 min)

### Affichage
- [ ] Vérifier les 4 cartes de statistiques
- [ ] Vérifier les actions rapides (Enregistrer vente, Gérer inventaire)
- [ ] Vérifier le menu de gestion
- [ ] ✅ **Résultat attendu** : Tout s'affiche correctement

### Navigation
- [ ] Cliquer sur "Enregistrer une vente" → QuickSale
- [ ] Revenir, cliquer sur "Gérer l'inventaire" → Inventory
- [ ] Revenir, cliquer sur "Ventes" dans le menu → Sales
- [ ] Revenir, cliquer sur "Facturation" → Invoices
- [ ] Revenir, cliquer sur "Paramètres" → Settings
- [ ] ✅ **Résultat attendu** : Navigation fluide

---

## 3️⃣ Module Inventaire/Produits (15 min)

### Ajouter un Produit SANS Image
- [ ] Dashboard → Inventaire
- [ ] Cliquer "+ Ajouter un produit"
- [ ] Remplir : Nom, catégorie, prix achat, prix vente, quantité
- [ ] Cliquer "Enregistrer"
- [ ] ✅ **Résultat attendu** : Produit ajouté, visible dans la liste

### Ajouter un Produit AVEC Image
- [ ] Cliquer "+ Ajouter un produit"
- [ ] Remplir tous les champs
- [ ] Cliquer "Choisir une image"
- [ ] Sélectionner une image
- [ ] ✅ **Vérifier** : Prévisualisation visible
- [ ] Cliquer "Enregistrer"
- [ ] ✅ **Résultat attendu** : Produit avec image visible

### Voir les Détails
- [ ] Cliquer "Détails" sur un produit
- [ ] ✅ **Vérifier** : Affichage complet + historique (si modifié)
- [ ] Fermer le modal

### Modifier un Produit
- [ ] Cliquer "Modifier" sur un produit
- [ ] Changer la quantité (ex: 10 → 15)
- [ ] Cliquer "Enregistrer"
- [ ] Cliquer "Détails"
- [ ] ✅ **Résultat attendu** : Historique affiche le changement

### Recherche et Filtres
- [ ] Utiliser la barre de recherche
- [ ] Cliquer "Filtres"
- [ ] Filtrer par catégorie
- [ ] Filtrer par statut (Disponible, Stock faible, Rupture)
- [ ] Trier par nom, quantité, prix
- [ ] ✅ **Résultat attendu** : Filtres fonctionnent

### Supprimer un Produit
- [ ] Cliquer "Supprimer" sur un produit
- [ ] Confirmer la suppression
- [ ] ✅ **Résultat attendu** : Produit supprimé + image effacée

---

## 4️⃣ Module Vente Rapide (10 min)

### Vente Simple
- [ ] Dashboard → "Enregistrer une vente"
- [ ] Sélectionner un produit
- [ ] Entrer la quantité (ex: 2)
- [ ] ✅ **Vérifier** : Montant total calculé automatiquement
- [ ] Sélectionner mode paiement (Espèces)
- [ ] Cliquer "Enregistrer"
- [ ] ✅ **Résultat attendu** : Vente enregistrée, stock réduit

### Vente avec Client Existant
- [ ] "Enregistrer une vente"
- [ ] Sélectionner un produit et quantité
- [ ] Cliquer "Choisir un client"
- [ ] Sélectionner un client (si existe)
- [ ] Mode paiement → Enregistrer
- [ ] ✅ **Résultat attendu** : Vente liée au client

### Vente avec Nouveau Client
- [ ] "Enregistrer une vente"
- [ ] Sélectionner produit et quantité
- [ ] Cliquer "+ Nouveau" (client)
- [ ] Remplir nom, téléphone
- [ ] Cliquer "Ajouter le client"
- [ ] ✅ **Vérifier** : Client sélectionné automatiquement
- [ ] Mode paiement → Enregistrer
- [ ] ✅ **Résultat attendu** : Client créé + vente enregistrée

### Vente avec Facture
- [ ] "Enregistrer une vente"
- [ ] Sélectionner produit, quantité, client
- [ ] Mode paiement
- [ ] Cliquer "Enregistrer + Facture"
- [ ] ✅ **Résultat attendu** : Vente + Facture créée

### Paiement Partiel
- [ ] "Enregistrer une vente"
- [ ] Sélectionner produit, quantité (ex: total 5000 FCFA)
- [ ] Dans "Montant payé", entrer 3000
- [ ] ✅ **Vérifier** : "Reste à payer: 2000 FCFA" affiché
- [ ] Enregistrer
- [ ] ✅ **Résultat attendu** : Vente avec créance

### Validation Stock Insuffisant
- [ ] Sélectionner un produit avec stock faible (ex: 3 en stock)
- [ ] Entrer quantité supérieure (ex: 5)
- [ ] ✅ **Résultat attendu** : Alerte "Stock insuffisant"

---

## 5️⃣ Module Ventes & Performances (5 min)

### Affichage
- [ ] Dashboard → Ventes
- [ ] ✅ **Vérifier** : Indicateurs clés affichés
- [ ] ✅ **Vérifier** : Graphique mensuel visible
- [ ] ✅ **Vérifier** : Top 5 produits
- [ ] ✅ **Vérifier** : Timeline des événements

### Filtres
- [ ] Utiliser les filtres (période, catégorie)
- [ ] ✅ **Résultat attendu** : Données filtrées

---

## 6️⃣ Module Facturation (10 min)

### Créer une Facture
- [ ] Dashboard → Facturation
- [ ] Cliquer "+ Nouvelle facture"
- [ ] Entrer nom client
- [ ] Sélectionner un produit
- [ ] Entrer quantité
- [ ] Cliquer "Ajouter"
- [ ] ✅ **Vérifier** : Produit ajouté à la liste
- [ ] Ajouter un 2ème produit (optionnel)
- [ ] Sélectionner mode de paiement
- [ ] Cliquer "Générer la facture"
- [ ] ✅ **Résultat attendu** : Facture créée

### Voir les Détails
- [ ] Cliquer "Détails" sur une facture
- [ ] ✅ **Vérifier** : Tous les détails visibles
- [ ] Cliquer "Imprimer" (test d'affichage)

### Filtres
- [ ] Filtrer par statut (Payé/Non payé)
- [ ] Rechercher par client
- [ ] ✅ **Résultat attendu** : Filtres fonctionnent

---

## 7️⃣ Module Paramètres (15 min)

### Informations Professionnelles
- [ ] Dashboard → Paramètres → Informations professionnelles
- [ ] Modifier le nom de l'entreprise
- [ ] Sélectionner type d'activité
- [ ] Cliquer "Changer le logo"
- [ ] Sélectionner une image
- [ ] ✅ **Vérifier** : Logo affiché
- [ ] Remplir adresse, téléphone, email
- [ ] Cliquer "Enregistrer"
- [ ] ✅ **Résultat attendu** : Infos mises à jour

### Statistiques du Compte
- [ ] Paramètres → Statistiques du compte
- [ ] ✅ **Vérifier** : Stats produits, ventes, clients affichées

### Notifications
- [ ] Paramètres → Notifications
- [ ] ✅ **Vérifier** : Liste des notifications (peut être vide)
- [ ] Si notifications, cliquer sur une
- [ ] ✅ **Vérifier** : Marquée comme lue
- [ ] Cliquer ✕ pour supprimer
- [ ] ✅ **Résultat attendu** : Notification supprimée

### Modes de Paiement
- [ ] Paramètres → Modes de paiement
- [ ] Sélectionner vos modes préférés
- [ ] Entrer numéro Mobile Money
- [ ] Cliquer "Enregistrer"
- [ ] ✅ **Résultat attendu** : Modes sauvegardés

### Apparence
- [ ] Paramètres → Apparence
- [ ] Sélectionner un thème (Clair/Sombre)
- [ ] Choisir une couleur
- [ ] ✅ **Vérifier** : Prévisualisation s'affiche
- [ ] Cliquer "Enregistrer"
- [ ] ✅ **Résultat attendu** : Apparence mise à jour (peut nécessiter rechargement)

### Sauvegarde
- [ ] Paramètres → Sauvegarde & Restauration
- [ ] Cliquer "Créer une sauvegarde manuelle"
- [ ] Attendre quelques secondes
- [ ] ✅ **Résultat attendu** : "Sauvegarde créée avec succès"
- [ ] ✅ **Vérifier** : Sauvegarde dans la liste

### Appareils Connectés
- [ ] Paramètres → Appareils connectés
- [ ] ✅ **Vérifier** : Appareil actuel listé
- [ ] ✅ **Vérifier** : Détails (plateforme, OS, date)

---

## 8️⃣ Tests d'Intégration (10 min)

### Vente Rapide → Stock Mis à Jour
1. [ ] Noter le stock d'un produit (ex: 20)
2. [ ] Enregistrer une vente de ce produit (ex: quantité 5)
3. [ ] Aller dans Inventaire
4. [ ] ✅ **Vérifier** : Stock = 15 (20 - 5)

### Vente Rapide → Facture Créée
1. [ ] Enregistrer une vente avec "Enregistrer + Facture"
2. [ ] Aller dans Facturation
3. [ ] ✅ **Vérifier** : Nouvelle facture visible

### Vente Rapide → Client Mis à Jour
1. [ ] Enregistrer une vente avec un client
2. [ ] Aller dans QuickSale → Choisir un client
3. [ ] ✅ **Vérifier** : Historique d'achat du client mis à jour

### Paramètres → Logo Affiché Partout
1. [ ] Changer le logo dans Paramètres
2. [ ] Retourner au Dashboard
3. [ ] ✅ **Vérifier** : Logo affiché (si implémenté)

---

## 🐛 Problèmes Rencontrés

### Formulaire pour Noter les Bugs
Si un test échoue, noter :
- **Module** : 
- **Action** : 
- **Résultat attendu** : 
- **Résultat obtenu** : 
- **Message d'erreur** : 
- **Capture d'écran** : 

---

## ✅ Résumé des Tests

### Modules Testés
- [ ] Authentification (10 min)
- [ ] Dashboard (5 min)
- [ ] Inventaire/Produits (15 min)
- [ ] Vente Rapide (10 min)
- [ ] Ventes & Performances (5 min)
- [ ] Facturation (10 min)
- [ ] Paramètres (15 min)
- [ ] Tests d'Intégration (10 min)

### Temps Total Estimé : 80 minutes (1h20)

### Statut Global
- [ ] ✅ Tous les tests passent
- [ ] ⚠️ Quelques problèmes mineurs
- [ ] ❌ Problèmes majeurs détectés

---

**Date des tests** : ___________  
**Testeur** : ___________  
**Résultat** : ___________


