# 🔥 Configuration Firebase - Envoi d'Emails de Vérification

## ⚠️ PROBLÈME : Les emails n'arrivent pas

Voici **TOUTES** les étapes à faire dans Firebase Console pour que ça fonctionne.

---

## 📋 CHECKLIST COMPLÈTE

### ✅ Étape 1 : Vérifier l'Authentification Email/Password

1. **Ouvrez** : https://console.firebase.google.com
2. **Sélectionnez** : `entrepreneur-africa`
3. **Menu de gauche** → **🔐 Authentication**
4. **Onglet** → **Sign-in method**
5. **Vérifiez** :
   ```
   Email/Password : Enabled ✅
   ```
6. **Si Disabled** :
   - Cliquez sur `Email/Password`
   - Activez **Enable** (le premier bouton)
   - Laissez **Email link (passwordless sign-in)** DÉSACTIVÉ
   - Cliquez **Save**

---

### ✅ Étape 2 : Configurer le Template d'Email

1. Toujours dans **Authentication**
2. **Onglet** → **Templates** (ou **Modèles**)
3. **Cliquez sur** : `Email address verification`

4. **Configurez** :

   **FROM name (Nom de l'expéditeur)** :
   ```
   SmartBizz
   ```

   **FROM email** :
   ```
   noreply@entrepreneur-africa.firebaseapp.com
   ```
   ⚠️ NE CHANGEZ PAS le domaine ! Gardez `.firebaseapp.com`

   **Reply-to** :
   ```
   (Laissez vide)
   ```

   **Subject (Sujet)** :
   ```
   Vérifiez votre adresse email
   ```

   **Email body** :
   ```
   Bonjour,

   Merci de vous être inscrit sur SmartBizz !

   Pour activer votre compte, veuillez cliquer sur le lien ci-dessous :
   %LINK%

   Si vous n'êtes pas à l'origine de cette demande, ignorez cet email.

   L'équipe SmartBizz
   ```

5. **IMPORTANT** : Assurez-vous que `%LINK%` est bien présent dans le corps de l'email !

6. **Cliquez** : **SAVE**

---

### ✅ Étape 3 : Vérifier les Domaines Autorisés

1. **Authentication** → **Settings** (⚙️ en haut à droite)

2. **Scrollez vers** : **Authorized domains** (Domaines autorisés)

3. **Vérifiez que ces domaines existent** :
   ```
   ✅ localhost
   ✅ entrepreneur-africa.firebaseapp.com
   ✅ entrepreneur-africa.web.app
   ```

4. **Si `localhost` n'est pas là** :
   - Cliquez **Add domain**
   - Tapez : `localhost`
   - **Add**

5. **Si vous utilisez Expo Web** :
   - Ajoutez aussi : `127.0.0.1`

---

### ✅ Étape 4 : Configurer les Règles Firestore

1. **Menu de gauche** → **🗄️ Firestore Database**

2. **Onglet** → **Rules**

3. **SUPPRIMEZ TOUT** et **COLLEZ CECI** :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Collection users
    match /users/{userId} {
      // L'utilisateur peut lire/écrire ses propres données
      allow read, write: if request.auth != null && request.auth.uid == userId;
      // Tout utilisateur authentifié peut créer son profil
      allow create: if request.auth != null;
    }
  }
}
```

4. **Cliquez** : **Publish**

5. **ATTENDEZ** que ça dise : "Rules published successfully"

---

### ✅ Étape 5 : Tester l'Envoi d'Email depuis Firebase

Pour vérifier que Firebase PEUT envoyer des emails :

1. **Authentication** → **Users**

2. **Cliquez** : **Add user** (Ajouter un utilisateur)

3. **Remplissez** :
   - **Email** : VOTRE VRAI EMAIL (Gmail, Outlook, etc.)
   - **Password** : `Test123456`

4. **Cliquez** : **Add user**

5. L'utilisateur apparaît dans la liste

6. **À côté de l'utilisateur** :
   - Regardez la colonne **Email verified**
   - Elle devrait dire : `No` ou `❌`

7. **Cliquez sur les 3 points** `⋮` à droite de l'utilisateur

8. **Cherchez une option comme** :
   - "Send verification email"
   - "Resend verification email"
   - OU une icône d'email

9. **Si cette option existe**, cliquez dessus

10. **VÉRIFIEZ VOTRE BOÎTE MAIL** :
    - Regardez dans la boîte de réception
    - **REGARDEZ AUSSI LES SPAMS** ⚠️
    - Attendez 2-3 minutes maximum

11. **Si vous recevez l'email** ✅ :
    - Firebase fonctionne !
    - Le problème vient de votre code

12. **Si vous NE recevez PAS l'email** ❌ :
    - Passez à l'étape suivante

---

### ✅ Étape 6 : Vérifier les Quotas Firebase

1. **Menu de gauche** → **⚙️ Project settings** (Paramètres du projet)

2. **Onglet** → **Usage** (Utilisation)

3. **Vérifiez** :
   - **Authentication** : Pas de limite atteinte
   - **Email verification** : Pas bloqué

4. **Si vous voyez des erreurs** :
   - Vous avez peut-être dépassé la limite gratuite
   - Attendez 24h ou passez à Blaze (payant)

---

### ✅ Étape 7 : Activer l'API Email (Important)

1. **Ouvrez** : https://console.cloud.google.com

2. **Sélectionnez** : `entrepreneur-africa`

3. **Menu hamburger** (☰) → **APIs & Services** → **Enabled APIs & Services**

4. **Vérifiez que ces APIs sont activées** :
   ```
   ✅ Identity Toolkit API
   ✅ Cloud Firestore API
   ✅ Firebase Management API
   ```

5. **Si "Identity Toolkit API" est manquante** :
   - Cliquez **+ ENABLE APIS AND SERVICES**
   - Cherchez : `Identity Toolkit API`
   - Cliquez dessus
   - Cliquez **ENABLE**

---

### ✅ Étape 8 : Vérifier le Plan Firebase

1. **Firebase Console** → **⚙️ Project settings**

2. **Scrollez vers le bas** : **Your plan**

3. **Vérifiez** :
   ```
   Spark (No-cost) ✅
   OU
   Blaze (Pay as you go) ✅
   ```

4. **IMPORTANT** : Le plan Spark (gratuit) permet :
   - 10,000 vérifications d'email / mois
   - Largement suffisant pour les tests

---

## 🧪 TEST APRÈS CONFIGURATION

1. **Relancez votre application**

2. **Ouvrez la console** (F12) → Onglet **Console**

3. **Inscrivez-vous** avec un VRAI email

4. **Regardez la console**, vous devriez voir :
   ```
   📧 Envoi de l'email de vérification à: votre@email.com
   🌐 URL de retour: http://localhost:19006
   ✅ Email de vérification envoyé avec succès
   ```

5. **Si vous voyez une ERREUR** :
   - Copiez l'erreur complète
   - Partagez-la

6. **Vérifiez votre boîte mail** :
   - Boîte de réception
   - **SPAMS** ⚠️
   - Attendez 5 minutes maximum

---

## 🐛 PROBLÈMES COURANTS

### ❌ "Missing or insufficient permissions"

**Solution** :
- Vérifiez les règles Firestore (Étape 4)
- Assurez-vous que l'utilisateur est bien authentifié

### ❌ "auth/operation-not-allowed"

**Solution** :
- Email/Password n'est pas activé
- Retournez à l'Étape 1

### ❌ "auth/invalid-continue-uri"

**Solution** :
- Le domaine n'est pas autorisé
- Retournez à l'Étape 3

### ❌ L'email arrive en SPAM

**C'est normal au début !** Solutions :
- Ajoutez `noreply@entrepreneur-africa.firebaseapp.com` à vos contacts
- Marquez l'email comme "Non spam"
- Pour la production, configurez un domaine personnalisé

### ❌ Aucun email ne arrive (même après 10 minutes)

**Vérifications** :
1. L'email est-il correct ?
2. Avez-vous bien regardé les spams ?
3. Essayez avec Gmail (plus fiable pour les tests)
4. Vérifiez les quotas (Étape 6)
5. Vérifiez que l'API est activée (Étape 7)

---

## ✅ CHECKLIST FINALE

Avant de dire "ça ne marche pas" :

- [ ] Email/Password activé dans Authentication
- [ ] Template d'email configuré avec `%LINK%`
- [ ] Domaines autorisés configurés (localhost inclus)
- [ ] Règles Firestore publiées
- [ ] Test depuis Firebase Console réussi
- [ ] Identity Toolkit API activée
- [ ] Console de l'app affiche "✅ Email envoyé"
- [ ] Vérifié les SPAMS
- [ ] Attendu au moins 5 minutes
- [ ] Essayé avec Gmail

---

## 📞 SI ÇA NE MARCHE TOUJOURS PAS

**Envoyez-moi** :

1. Une capture d'écran de **Authentication** → **Sign-in method**
2. Le contenu de la **console** après inscription
3. Votre adresse email (pour vérifier le domaine)
4. Le message d'erreur exact (s'il y en a un)

---

**COMMENCEZ PAR L'ÉTAPE 1 ET SUIVEZ DANS L'ORDRE** ✅

