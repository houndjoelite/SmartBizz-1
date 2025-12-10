/**
 * Script pour activer tous les utilisateurs existants
 * À EXÉCUTER UNE SEULE FOIS
 * 
 * COMMENT UTILISER :
 * 1. Installez Firebase Admin si pas déjà fait: npm install firebase
 * 2. Lancez: node fix-existing-users.js
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';

// Configuration Firebase
const firebaseConfig = {
  apiKey: "AIzaSyByAtUwLUy8-VlHpr5LDmglAe7O7j6hTIQ",
  authDomain: "entrepreneur-africa.firebaseapp.com",
  projectId: "entrepreneur-africa",
  storageBucket: "entrepreneur-africa.firebasestorage.app",
  messagingSenderId: "606185649607",
  appId: "1:606185649607:web:cb20c25d133b42727415e2",
  measurementId: "G-SG1KR8RJWL"
};

// Initialiser Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function fixExistingUsers() {
  console.log('🔄 Début de l\'activation des utilisateurs...\n');

  try {
    // Récupérer tous les utilisateurs
    const usersSnapshot = await getDocs(collection(db, 'users'));
    console.log(`📊 ${usersSnapshot.docs.length} utilisateurs trouvés\n`);

    let fixedCount = 0;
    let alreadyOkCount = 0;

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data();
      const email = userData.email || 'Email inconnu';

      // Vérifier si emailVerified est vide ou false
      if (userData.emailVerified !== true) {
        try {
          await updateDoc(doc(db, 'users', userDoc.id), {
            emailVerified: true,
            isActive: true,
          });

          console.log(`✅ ${email} - Activé (emailVerified mis à true)`);
          fixedCount++;
        } catch (error) {
          console.log(`❌ ${email} - Erreur: ${error.message}`);
        }
      } else {
        console.log(`⏭️  ${email} - Déjà activé`);
        alreadyOkCount++;
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 RÉSUMÉ :');
    console.log(`   ✅ Utilisateurs activés : ${fixedCount}`);
    console.log(`   ⏭️  Déjà activés : ${alreadyOkCount}`);
    console.log(`   📝 Total : ${usersSnapshot.docs.length}`);
    console.log('='.repeat(50));
    console.log('\n✅ Terminé ! Vos utilisateurs peuvent maintenant se connecter.\n');

  } catch (error) {
    console.error('❌ ERREUR :', error);
  }
}

// Exécuter le script
fixExistingUsers().then(() => {
  console.log('Script terminé. Vous pouvez fermer cette fenêtre.');
  process.exit(0);
});

