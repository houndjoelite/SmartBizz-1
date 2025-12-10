import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Configuration Firebase - Utilisation des variables d'environnement
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

if (!firebaseConfig.apiKey) {
  console.error("Erreur: La clé API Firebase n'est pas configurée. Veuillez définir les variables d'environnement nécessaires.");
}

// Initialiser Firebase
const app = initializeApp(firebaseConfig);

// Vérifier si on est en mode développement
const isDevelopment = __DEV__;

// Initialiser les services
let auth;
let db;
let storage;

try {
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);

  // En mode développement, on peut utiliser les émulateurs Firebase
  if (isDevelopment) {
    console.log('Mode développement détecté');
    // Décommente ces lignes si tu veux utiliser les émulateurs Firebase
    // connectAuthEmulator(auth, 'http://localhost:9099');
    // connectFirestoreEmulator(db, 'localhost', 8080);
    // connectStorageEmulator(storage, 'localhost', 9199);
  }
} catch (error) {
  console.error('Erreur lors de l\'initialisation de Firebase:', error);
  throw error;
}

export { auth, db, storage };
export default app;
