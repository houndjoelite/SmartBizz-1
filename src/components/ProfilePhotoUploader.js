import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { theme } from '../styles/theme';
import ProfileService from '../services/profileService';

/**
 * Composant pour uploader/changer la photo de profil
 */
export const ProfilePhotoUploader = ({ userId, currentPhotoURL, onPhotoUpdated, size = 100 }) => {
  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState(currentPhotoURL);

  const pickImage = async () => {
    try {
      // Demander la permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert('Permission requise', 'Nous avons besoin de la permission pour accéder à vos photos');
        return;
      }

      // Ouvrir le sélecteur d'image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        await uploadImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Erreur sélection image:', error);
      Alert.alert('Erreur', 'Impossible de sélectionner l\'image');
    }
  };

  const uploadImage = async (uri) => {
    setUploading(true);
    try {
      const response = await ProfileService.uploadProfilePhoto(userId, uri);
      
      if (response.success) {
        setPhotoURL(response.photoURL);
        if (onPhotoUpdated) {
          onPhotoUpdated(response.photoURL);
        }
        Alert.alert('Succès', 'Photo de profil mise à jour !');
      } else {
        Alert.alert('Erreur', response.error || 'Impossible d\'uploader la photo');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      Alert.alert('Erreur', 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  // Pour le web : utiliser input file
  const handleWebUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      Alert.alert('Erreur', 'L\'image est trop grande (max 5MB)');
      return;
    }

    // Vérifier le type
    if (!file.type.startsWith('image/')) {
      Alert.alert('Erreur', 'Veuillez sélectionner une image');
      return;
    }

    setUploading(true);
    try {
      const response = await ProfileService.uploadFromFile(userId, file);
      
      if (response.success) {
        setPhotoURL(response.photoURL);
        if (onPhotoUpdated) {
          onPhotoUpdated(response.photoURL);
        }
        Alert.alert('Succès', 'Photo de profil mise à jour !');
      } else {
        Alert.alert('Erreur', response.error || 'Impossible d\'uploader la photo');
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      Alert.alert('Erreur', 'Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Photo actuelle ou placeholder */}
      {photoURL ? (
        <Image source={{ uri: photoURL }} style={styles.photo} />
      ) : (
        <View style={[styles.placeholder, { width: size, height: size }]}>
          <Ionicons name="person" size={size * 0.5} color={theme.colors.textTertiary} />
        </View>
      )}

      {/* Bouton pour changer */}
      {Platform.OS === 'web' ? (
        <label htmlFor="profile-photo-upload" style={styles.webLabel}>
          <View style={styles.editButton}>
            {uploading ? (
              <ActivityIndicator size="small" color={theme.colors.textInverse} />
            ) : (
              <Ionicons name="camera" size={20} color={theme.colors.textInverse} />
            )}
          </View>
          <input
            id="profile-photo-upload"
            type="file"
            accept="image/*"
            onChange={handleWebUpload}
            style={{ display: 'none' }}
          />
        </label>
      ) : (
        <TouchableOpacity 
          style={styles.editButton}
          onPress={pickImage}
          disabled={uploading}
        >
          {uploading ? (
            <ActivityIndicator size="small" color={theme.colors.textInverse} />
          ) : (
            <Ionicons name="camera" size={20} color={theme.colors.textInverse} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },

  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 9999,
    backgroundColor: theme.colors.backgroundDark,
  },

  placeholder: {
    borderRadius: 9999,
    backgroundColor: theme.colors.backgroundDark,
    justifyContent: 'center',
    alignItems: 'center',
  },

  editButton: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: theme.colors.surface,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 4,
      },
    }),
  },

  webLabel: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
});

export default ProfilePhotoUploader;


