import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from './firebase';

// Service d'authentification centralisé
export class AuthService {
  
  // Connexion utilisateur
  static async signIn(email, password) {
    try {
      // Validation basique
      if (!email || !email.trim()) {
        return { success: false, error: 'Veuillez entrer votre adresse email' };
      }
      if (!password) {
        return { success: false, error: 'Veuillez entrer votre mot de passe' };
      }

      console.log('Tentative de connexion pour:', email);
      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      console.log('✅ Connexion réussie:', user.uid);
      
      // Récupérer les données de l'utilisateur
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log('Données utilisateur:', { emailVerified: userData.emailVerified, isActive: userData.isActive });
      }
      
      return { success: true, user };
    } catch (error) {
      console.error('❌ Erreur de connexion:', error.code);
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Inscription utilisateur avec vérification d'email FIREBASE (GRATUIT)
  static async signUp(userData) {
    try {
      const { email, password, firstName, lastName, businessType, businessName } = userData;
      
      // Validation des données
      if (!email || !email.trim()) {
        return { success: false, error: 'L\'adresse email est requise' };
      }
      if (!password || password.length < 6) {
        return { success: false, error: 'Le mot de passe doit contenir au moins 6 caractères' };
      }
      if (!firstName || !firstName.trim()) {
        return { success: false, error: 'Le prénom est requis' };
      }
      if (!lastName || !lastName.trim()) {
        return { success: false, error: 'Le nom est requis' };
      }
      if (!businessType) {
        return { success: false, error: 'Le type d\'activité est requis' };
      }
      if (!businessName || !businessName.trim()) {
        return { success: false, error: 'Le nom de l\'entreprise est requis' };
      }

      console.log('📝 Création du compte pour:', email.trim());
      
      // Créer le compte utilisateur
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      const user = userCredential.user;
      console.log('✅ Compte créé:', user.uid);

      // Mettre à jour le profil
      await updateProfile(user, {
        displayName: `${firstName.trim()} ${lastName.trim()}`,
      });

      // Créer le document utilisateur dans Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim().toLowerCase(),
        businessType,
        businessName: businessName.trim(),
        createdAt: new Date(),
        isActive: true,
        emailVerified: false,
        lastLogin: new Date(),
      });

      // ENVOYER L'EMAIL DE VÉRIFICATION VIA FIREBASE
      console.log('📧 Envoi de l\'email de vérification...');
      
      try {
        await sendEmailVerification(user, {
          url: window.location?.origin || 'https://entrepreneur-africa.firebaseapp.com',
          handleCodeInApp: false,
        });
        console.log('✅ Email de vérification envoyé avec succès');
      } catch (emailError) {
        console.error('❌ Erreur lors de l\'envoi de l\'email:', emailError);
        // On ne bloque pas l'inscription même si l'email ne part pas
        console.warn('⚠️ Le compte a été créé mais l\'email n\'a pas pu être envoyé');
      }

      return { success: true, user, email: email.trim() };
    } catch (error) {
      console.error('❌ Erreur lors de l\'inscription:', error.code);
      
      // Nettoyer en cas d'erreur après la création du compte
      if (error.code !== 'auth/email-already-in-use' && error.code !== 'auth/weak-password') {
        try {
          const currentUser = auth.currentUser;
          if (currentUser) {
            await currentUser.delete();
            console.log('🧹 Compte partiellement créé supprimé');
          }
        } catch (cleanupError) {
          console.error('Erreur lors du nettoyage:', cleanupError);
        }
      }
      
      return { success: false, error: this.getErrorMessage(error.code) || error.message };
    }
  }

  // Renvoyer l'email de vérification
  static async resendVerificationEmail() {
    try {
      const user = auth.currentUser;
      if (!user) {
        return { success: false, error: 'Aucun utilisateur connecté' };
      }

      if (user.emailVerified) {
        return { success: false, error: 'Email déjà vérifié' };
      }

      await sendEmailVerification(user, {
        url: window.location.origin,
        handleCodeInApp: false,
      });

      return { success: true };
    } catch (error) {
      console.error('Erreur lors du renvoi:', error);
      return { success: false, error: 'Erreur lors du renvoi de l\'email' };
    }
  }

  // Vérifier si l'email a été vérifié (rafraîchir le statut)
  static async checkEmailVerified() {
    try {
      const user = auth.currentUser;
      console.log('🔍 Vérification de l\'email...');
      
      if (!user) {
        console.log('❌ Aucun utilisateur connecté');
        return { success: false, error: 'Aucun utilisateur connecté' };
      }

      console.log('👤 Utilisateur:', user.email);
      console.log('📧 Email vérifié (avant reload):', user.emailVerified);

      // Rafraîchir les informations de l'utilisateur
      await user.reload();
      
      console.log('📧 Email vérifié (après reload):', user.emailVerified);
      
      if (user.emailVerified) {
        console.log('✅ Email vérifié ! Mise à jour de Firestore...');
        
        // Mettre à jour Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          emailVerified: true,
          verifiedAt: new Date(),
        });
        
        console.log('✅ Firestore mis à jour avec succès');
        return { success: true, verified: true };
      }

      console.log('⏳ Email pas encore vérifié');
      return { success: true, verified: false };
    } catch (error) {
      console.error('❌ Erreur lors de la vérification:', error);
      return { success: false, error: 'Erreur lors de la vérification' };
    }
  }

  // Déconnexion
  static async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: 'Erreur lors de la déconnexion' };
    }
  }

  // Réinitialisation du mot de passe
  static async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      return { success: false, error: this.getErrorMessage(error.code) };
    }
  }

  // Écouter les changements d'état d'authentification
  static onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Obtenir l'utilisateur actuellement connecté
  static getCurrentUser() {
    return auth.currentUser;
  }

  // Obtenir les données utilisateur depuis Firestore
  static async getUserData(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return { success: true, data: userDoc.data() };
      } else {
        return { success: false, error: 'Utilisateur non trouvé' };
      }
    } catch (error) {
      return { success: false, error: 'Erreur lors de la récupération des données' };
    }
  }

  // Traduire les codes d'erreur Firebase en français
  static getErrorMessage(errorCode) {
    const errorMessages = {
      // Erreurs de connexion
      'auth/user-not-found': 'Aucun compte trouvé avec cet email',
      'auth/wrong-password': 'Mot de passe incorrect',
      'auth/invalid-credential': 'Email ou mot de passe incorrect',
      'auth/user-disabled': 'Ce compte a été désactivé',
      'auth/too-many-requests': 'Trop de tentatives. Réessayez dans quelques minutes',
      
      // Erreurs d'inscription
      'auth/email-already-in-use': 'Cet email est déjà utilisé par un autre compte',
      'auth/weak-password': 'Le mot de passe doit contenir au moins 6 caractères',
      'auth/invalid-email': 'Adresse email invalide',
      
      // Erreurs réseau
      'auth/network-request-failed': 'Erreur de connexion. Vérifiez votre connexion internet',
      'auth/timeout': 'Délai d\'attente dépassé. Réessayez',
      
      // Erreurs de vérification
      'auth/expired-action-code': 'Le lien de vérification a expiré. Demandez-en un nouveau',
      'auth/invalid-action-code': 'Le lien de vérification est invalide ou a déjà été utilisé',
      
      // Erreurs générales
      'auth/operation-not-allowed': 'Cette opération n\'est pas autorisée',
      'auth/requires-recent-login': 'Veuillez vous reconnecter pour effectuer cette action',
    };
    
    return errorMessages[errorCode] || 'Une erreur inattendue est survenue. Réessayez';
  }
}

export default AuthService;