# Configuration Firebase - Guide étape par étape

## 1. Créer un projet Firebase

1. Va sur [Firebase Console](https://console.firebase.google.com/)
2. Clique sur "Créer un projet"
3. Nom du projet : `entrepreneur-africa` (ou un nom de ton choix)
4. Active Google Analytics (optionnel)
5. Choisis ton compte Google Analytics

## 2. Configurer l'authentification

1. Dans le menu de gauche, clique sur "Authentication"
2. Clique sur "Commencer"
3. Va dans l'onglet "Sign-in method"
4. Active "Email/Password" (première option)
5. Clique sur "Enregistrer"

## 3. Configurer Firestore Database

1. Dans le menu de gauche, clique sur "Firestore Database"
2. Clique sur "Créer une base de données"
3. Choisis "Commencer en mode test" (pour l'instant)
4. Sélectionne une région proche (Europe ou Afrique)
5. Clique sur "Terminé"

## 4. Récupérer les clés de configuration

1. Va dans les paramètres du projet (icône d'engrenage)
2. Clique sur "Paramètres du projet"
3. Fais défiler vers le bas jusqu'à "Vos applications"
4. Clique sur l'icône Web (</>) pour ajouter une application web
5. Nom de l'application : `Entrepreneur Africa Web`
6. Clique sur "Enregistrer l'application"
7. **COPIE les clés de configuration** qui s'affichent

## 5. Mettre à jour le fichier firebase.js

Remplace les valeurs dans `src/services/firebase.js` par tes vraies clés :

```javascript
const firebaseConfig = {
  apiKey: "ta-vraie-api-key",
  authDomain: "ton-projet.firebaseapp.com",
  projectId: "ton-projet-id",
  storageBucket: "ton-projet.appspot.com",
  messagingSenderId: "ton-sender-id",
  appId: "ton-app-id"
};
```

## 6. Règles de sécurité Firestore (optionnel)

Dans Firestore > Règles, tu peux utiliser ces règles pour commencer :

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 7. Test de l'application

Une fois configuré, tu pourras :
- Créer un compte utilisateur
- Se connecter
- Voir le dashboard
- Les données seront sauvegardées dans Firestore
