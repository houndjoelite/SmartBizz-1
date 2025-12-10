# 🧪 Test de Navigation - Checklist Complète

## ✅ Navigation Principale (Dashboard)

Depuis le Dashboard, vérifier que ces boutons fonctionnent :

### Actions Rapides
- [ ] **Enregistrer une vente** → Doit ouvrir `QuickSaleScreen`
- [ ] **Gérer l'inventaire** → Doit ouvrir `InventoryScreen`

### Menu Gestion
- [ ] **Inventaire** → Doit ouvrir `InventoryScreen`
- [ ] **Ventes** → Doit ouvrir `SalesScreen`
- [ ] **Facturation** → Doit ouvrir `InvoicesScreen`
- [ ] **Créer un site** → Message "Bientôt disponible"
- [ ] **Paramètres** → Doit ouvrir `SettingsScreen`

---

## ⚙️ Navigation Paramètres

Depuis `SettingsScreen`, vérifier chaque menu :

### Section : Compte
- [ ] **Informations professionnelles** (`ProfileSettings`)
  - Doit ouvrir avec formulaire d'infos business
  - Bouton retour fonctionne
  
- [ ] **Statistiques du compte** (`AccountStats`)
  - Doit ouvrir avec vue d'ensemble
  - Affiche : Produits, Ventes, Clients, Compte
  - Bouton retour fonctionne
  
- [ ] **Notifications** (`Notifications`)
  - Doit ouvrir liste des notifications
  - Bouton retour fonctionne

### Section : Paiement & Abonnement
- [ ] **Modes de paiement** (`PaymentSettings`)
  - Doit ouvrir paramètres de paiement
  - Bouton retour fonctionne
  
- [ ] **Abonnement** (`Subscription`)
  - Doit ouvrir gestion abonnement
  - Bouton retour fonctionne

### Section : Personnalisation
- [ ] **Apparence** (`AppearanceSettings`)
  - Doit ouvrir paramètres d'apparence
  - Bouton retour fonctionne
  
- [ ] **Multi-boutiques** (`StoresManagement`)
  - Message "Bientôt disponible"

### Section : Sécurité & Confidentialité
- [ ] **Sécurité** (`SecuritySettings`)
  - Doit ouvrir paramètres de sécurité
  - Bouton retour fonctionne
  
- [ ] **Appareils connectés** (`ConnectedDevices`)
  - Doit ouvrir liste des appareils
  - Bouton retour fonctionne
  
- [ ] **Sauvegarde & Restauration** (`BackupSettings`)
  - Doit ouvrir paramètres de sauvegarde
  - Bouton retour fonctionne

### Section : Avancé
- [ ] **Gestion des employés** - Message "Bientôt disponible"
- [ ] **Intégrations** - Message "Bientôt disponible"

### Section : Support
- [ ] **Aide & Documentation** - Alert "Aide"
- [ ] **Contacter le support** - Alert avec email
- [ ] **Noter l'application** - Alert "Merci"

---

## 🔍 Tests Spécifiques

### Test 1 : Navigation Dashboard → Paramètres → Statistiques
```
Dashboard 
  → Cliquer "Paramètres"
    → Cliquer "Statistiques du compte"
      → Vérifier que l'écran s'affiche
      → Cliquer "← Retour"
        → Retour à Paramètres
```

### Test 2 : Navigation avec données
```
Dashboard 
  → Cliquer "Paramètres"
    → Vérifier que les stats rapides s'affichent :
      - Nombre de produits
      - Nombre de ventes
      - Nombre de clients
    → Cliquer "Statistiques du compte"
      → Vérifier que les données s'affichent correctement
```

### Test 3 : Navigation profonde
```
Dashboard 
  → Paramètres 
    → Statistiques 
      → Retour 
        → Informations professionnelles 
          → Retour 
            → Retour au Dashboard
```

---

## 🐛 Débogage

### Si "Statistiques du compte" ne s'ouvre pas :

1. **Ouvrir la console du navigateur (F12)**
   - Vérifier s'il y a des erreurs en rouge
   - Chercher des messages d'erreur liés à "AccountStats"

2. **Vérifier dans la console :**
   ```javascript
   // Vérifier que l'écran existe
   console.log('AccountStats importé ?')
   ```

3. **Tester dans le terminal :**
   - Arrêter le serveur (Ctrl+C)
   - Relancer : `npm start`
   - Recharger la page (F5)

4. **Vérifier le fichier App.js :**
   - Ligne 19 : Import de `AccountStatsScreen` ✅
   - Ligne 130 : Route `AccountStats` ✅

### Si l'écran s'ouvre mais affiche "Loading..." indéfiniment :

1. **Problème de données**
   - Le hook `useSettings()` ne charge pas
   - Vérifier que Firebase est bien configuré
   - Vérifier que l'utilisateur a des données

2. **Dans la console, taper :**
   ```javascript
   // Vérifier les données
   firebase.auth().currentUser
   ```

### Si le bouton retour ne fonctionne pas :

1. **Problème de navigation**
   - Vérifier que `navigation` est bien passé en props
   - Vérifier que `navigation.goBack()` est appelé

---

## 📊 Écrans de Paramètres - État

| Écran | Import | Route | Fonctionnel |
|-------|--------|-------|-------------|
| ProfileSettings | ✅ | ✅ | ? |
| AccountStats | ✅ | ✅ | ? |
| Notifications | ✅ | ✅ | ? |
| PaymentSettings | ✅ | ✅ | ? |
| AppearanceSettings | ✅ | ✅ | ? |
| BackupSettings | ✅ | ✅ | ? |
| ConnectedDevices | ✅ | ✅ | ? |
| SecuritySettings | ✅ | ✅ | ? |
| Subscription | ✅ | ✅ | ? |

---

## 🔧 Commandes Utiles

### Relancer l'application
```bash
# Arrêter (Ctrl+C)
npm start
```

### Vider le cache
```bash
npm start --reset-cache
```

### Vérifier les erreurs
```bash
# Regarder le terminal pour les erreurs
# Regarder la console navigateur (F12) pour les erreurs
```

---

## 🎯 Résultat Attendu

Après les tests, tous les écrans devraient :
1. ✅ S'ouvrir sans erreur
2. ✅ Afficher les données correctement
3. ✅ Avoir un bouton retour fonctionnel
4. ✅ Revenir à l'écran précédent

---

## 📝 Notes

Si un écran ne fonctionne pas :
1. Noter le nom de l'écran
2. Noter l'erreur exacte (console)
3. Noter les étapes pour reproduire
4. Partager ces informations

Cela permettra de cibler et corriger rapidement le problème spécifique.

