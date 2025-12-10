/**
 * TEST DE DIAGNOSTIC - Connexion Firestore
 * 
 * Ce script va tester si votre application peut lire les produits depuis Firestore
 * 
 * COMMENT L'UTILISER :
 * 1. Ouvrir la console du navigateur (F12)
 * 2. Copier-coller ce code dans la console
 * 3. Appuyer sur Entrée
 * 4. Observer les résultats
 */

console.log('🔍 DÉBUT DU TEST DE DIAGNOSTIC');
console.log('================================');

// Test 1 : Vérifier l'authentification
console.log('\n📝 Test 1 : Vérification de l'utilisateur connecté');
import { auth } from './src/services/firebase';

const user = auth.currentUser;
if (user) {
  console.log('✅ Utilisateur connecté :');
  console.log('   - UID:', user.uid);
  console.log('   - Email:', user.email);
  console.log('   - Nom:', user.displayName || 'Non défini');
} else {
  console.log('❌ PROBLÈME : Aucun utilisateur connecté !');
  console.log('   → Vous devez vous connecter d'abord');
}

// Test 2 : Vérifier les produits dans Firestore
console.log('\n📝 Test 2 : Lecture des produits depuis Firestore');

import { collection, getDocs } from 'firebase/firestore';
import { db } from './src/services/firebase';

if (user) {
  const productsRef = collection(db, `inventory/${user.uid}/products`);
  
  getDocs(productsRef)
    .then((querySnapshot) => {
      console.log(`\n📊 Résultat : ${querySnapshot.size} produit(s) trouvé(s)`);
      
      if (querySnapshot.size === 0) {
        console.log('❌ PROBLÈME : Aucun produit dans Firestore !');
        console.log('   → Vous devez d\'abord ajouter des produits dans l\'inventaire');
      } else {
        console.log('✅ Produits trouvés :');
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log(`\n   📦 ${data.name}`);
          console.log(`      - Catégorie: ${data.category}`);
          console.log(`      - Quantité: ${data.quantity}`);
          console.log(`      - Prix: ${data.sellingPrice} FCFA`);
          console.log(`      - Statut: ${data.status}`);
          
          if (data.quantity === 0) {
            console.log('      ⚠️ ATTENTION : Quantité = 0 (rupture de stock)');
          }
        });
      }
      
      // Test 3 : Vérifier les produits disponibles
      const availableProducts = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.quantity > 0) {
          availableProducts.push(data);
        }
      });
      
      console.log(`\n📝 Test 3 : Produits disponibles (quantité > 0)`);
      console.log(`   Résultat : ${availableProducts.length} produit(s) disponible(s)`);
      
      if (availableProducts.length === 0) {
        console.log('   ❌ PROBLÈME : Tous les produits sont en rupture de stock !');
        console.log('   → Ajoutez du stock à vos produits ou créez de nouveaux produits');
      } else {
        console.log('   ✅ Produits disponibles pour vente/facture :');
        availableProducts.forEach((p) => {
          console.log(`      - ${p.name} (${p.quantity} unités)`);
        });
      }
    })
    .catch((error) => {
      console.log('❌ ERREUR lors de la lecture Firestore :');
      console.log('   Message:', error.message);
      console.log('   Code:', error.code);
      
      if (error.code === 'permission-denied') {
        console.log('\n   ⚠️ PROBLÈME DE PERMISSIONS FIRESTORE !');
        console.log('   → Vérifiez vos règles Firestore');
        console.log('   → Assurez-vous que l\'utilisateur est bien connecté');
      }
    });
} else {
  console.log('⏭️ Test 2 ignoré : Aucun utilisateur connecté');
}

console.log('\n================================');
console.log('🔍 FIN DU TEST DE DIAGNOSTIC');
console.log('Attendez les résultats ci-dessus...\n');

