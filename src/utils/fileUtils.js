import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

export const downloadAndShareFile = async (uri, filename, mimeType = 'application/octet-stream') => {
  try {
    const fileUri = FileSystem.documentDirectory + filename;
    
    // Télécharger le fichier
    const downloadResumable = FileSystem.createDownloadResumable(
      uri,
      fileUri
    );

    const { uri: localUri } = await downloadResumable.downloadAsync();
    
    // Demander la permission d'accéder aux médias
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Permission to access media library was denied');
    }

    // Sauvegarder dans la bibliothèque
    await MediaLibrary.saveToLibraryAsync(localUri);
    
    // Partager le fichier
    await Sharing.shareAsync(localUri, { mimeType });
    
    return { success: true, uri: localUri };
  } catch (error) {
    console.error('Erreur lors du téléchargement:', error);
    return { success: false, error: error.message };
  }
};

export const pickDocument = async (fileType = '*/*') => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: fileType,
      copyToCacheDirectory: true
    });

    if (result.type === 'success') {
      return { 
        success: true, 
        uri: result.uri,
        name: result.name,
        size: result.size,
        type: result.mimeType
      };
    }
    return { success: false, error: 'Aucun fichier sélectionné' };
  } catch (err) {
    console.error('Erreur lors de la sélection du fichier:', err);
    return { success: false, error: err.message };
  }
};
