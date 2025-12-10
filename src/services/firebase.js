import { initializeApp } from 'firebase/app';
import { getAuth, connectAuthEmulator } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator } from 'firebase/firestore';
import { getStorage, connectStorageEmulator } from 'firebase/storage';

// Configuration Firebase - REMPLACE CES VALEURS PAR TES VRAIES CLÉS
const firebaseConfig = {
  apiKey: "AIzaSyByAtUwLUy8-VlHpr5LDmglAe7O7j6hTIQ",
  authDomain: "entrepreneur-africa.firebaseapp.com",
  projectId: "entrepreneur-africa",
  storageBucket: "entrepreneur-africa.appspot.com",
  messagingSenderId: "606185649607",
  appId: "1:606185649607:web:cb20c25d133b42727415e2",
  measurementId: "G-SG1KR8RJWL"
};

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
