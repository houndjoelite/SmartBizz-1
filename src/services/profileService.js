import { Platform } from 'react-native';
import { getStorage, ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from './firebase';

const storage = getStorage();

/**
 * Service pour gérer les photos de profil
 */
class ProfileService {
  /**
   * Upload une photo de profil
   */
  async uploadProfilePhoto(userId, imageUri) {
    try {
      // Créer une référence unique pour l'image
      const timestamp = Date.now();
      const storageRef = ref(storage, `profile_photos/${userId}/${timestamp}.jpg`);

      // Convertir l'URI en blob pour l'upload
      let blob;
      if (Platform.OS === 'web') {
        // Pour le web
        const response = await fetch(imageUri);
        blob = await response.blob();
      } else {
        // Pour mobile
        const response = await fetch(imageUri);
        blob = await response.blob();
      }

      // Upload l'image
      await uploadBytes(storageRef, blob);

      // Obtenir l'URL de téléchargement
      const downloadURL = await getDownloadURL(storageRef);

      // Mettre à jour Firestore avec la nouvelle URL
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        photoURL: downloadURL,
        updatedAt: new Date(),
      });

      return { success: true, photoURL: downloadURL };
    } catch (error) {
      console.error('Erreur upload photo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Récupérer la photo de profil
   */
  async getProfilePhoto(userId) {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists()) {
        return {
          success: true,
          photoURL: userSnap.data().photoURL || null,
        };
      }

      return { success: false, error: 'Utilisateur non trouvé' };
    } catch (error) {
      console.error('Erreur récupération photo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Supprimer une photo de profil
   */
  async deleteProfilePhoto(userId, photoURL) {
    try {
      // Supprimer de Storage
      if (photoURL) {
        const photoRef = ref(storage, photoURL);
        await deleteObject(photoRef);
      }

      // Mettre à jour Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        photoURL: null,
        updatedAt: new Date(),
      });

      return { success: true };
    } catch (error) {
      console.error('Erreur suppression photo:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Uploader depuis un fichier (Web)
   */
  async uploadFromFile(userId, file) {
    try {
      const timestamp = Date.now();
      const storageRef = ref(storage, `profile_photos/${userId}/${timestamp}.jpg`);

      // Upload le fichier
      await uploadBytes(storageRef, file);

      // Obtenir l'URL
      const downloadURL = await getDownloadURL(storageRef);

      // Mettre à jour Firestore
      const userRef = doc(db, 'users', userId);
      await updateDoc(userRef, {
        photoURL: downloadURL,
        updatedAt: new Date(),
      });

      return { success: true, photoURL: downloadURL };
    } catch (error) {
      console.error('Erreur upload fichier:', error);
      return { success: false, error: error.message };
    }
  }
}

export default new ProfileService();

