import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Button, Alert, ScrollView, useWindowDimensions } from 'react-native';
import ChartComponent from '../components/ChartComponent';
import { downloadAndShareFile, pickDocument } from '../utils/fileUtils';
import NetInfo from '@react-native-community/netinfo';

const DataScreen = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [sampleData, setSampleData] = useState([
    { x: 1, y: 2 },
    { x: 2, y: 3 },
    { x: 3, y: 5 },
    { x: 4, y: 4 },
    { x: 5, y: 7 }
  ]);

  // Vérifier la connectivité au chargement
  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    return () => unsubscribe();
  }, []);

  const handleDownload = async () => {
    if (!isConnected) {
      Alert.alert('Hors ligne', 'Vous devez être connecté pour télécharger des fichiers');
      return;
    }

    // Exemple d'URL de fichier à télécharger
    const fileUrl = 'https://www.example.com/sample.pdf';
    const result = await downloadAndShareFile(fileUrl, 'sample.pdf', 'application/pdf');
    
    if (!result.success) {
      Alert.alert('Erreur', 'Impossible de télécharger le fichier: ' + result.error);
    }
  };

  const handleFilePick = async () => {
    try {
      const result = await pickDocument('*/*');
      if (result.success) {
        Alert.alert('Fichier sélectionné', `Nom: ${result.name}\nTaille: ${result.size} octets`);
      }
    } catch (error) {
      console.error('Erreur lors de la sélection du fichier:', error);
    }
  };

  const { width } = useWindowDimensions();
  const isLandscape = width > 600; // Seuil pour le mode paysage/tablette

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Gestion des Données</Text>
      
      <View style={[
        styles.contentWrapper,
        isLandscape && styles.landscapeContentWrapper
      ]}>
        <View style={[
          styles.column,
          isLandscape && styles.landscapeColumn
        ]}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Graphique des Données</Text>
            <ChartComponent 
              data={sampleData} 
              chartTitle="Exemple de Graphique" 
            />
          </View>
        </View>

        <View style={[
          styles.column,
          isLandscape && styles.landscapeColumn
        ]}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Gestion des Fichiers</Text>
            <View style={styles.buttonContainer}>
              <View style={styles.buttonWrapper}>
                <Button 
                  title="Télécharger un Fichier" 
                  onPress={handleDownload} 
                  disabled={!isConnected}
                  color="#c43a31"
                />
              </View>
              <View style={styles.buttonSpacer} />
              <View style={styles.buttonWrapper}>
                <Button 
                  title="Sélectionner un Fichier" 
                  onPress={handleFilePick}
                  color="#2e7d32"
                />
              </View>
            </View>
            {!isConnected && (
              <Text style={styles.offlineText}>Mode hors ligne activé</Text>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  contentContainer: {
    padding: 16,
  },
  contentWrapper: {
    flex: 1,
  },
  landscapeContentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  column: {
    flex: 1,
  },
  landscapeColumn: {
    marginHorizontal: 8,
    maxWidth: '50%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  buttonContainer: {
    marginVertical: 10,
  },
  buttonWrapper: {
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 5,
  },
  buttonSpacer: {
    height: 10,
  },
  offlineText: {
    color: '#d32f2f',
    marginTop: 12,
    textAlign: 'center',
    fontStyle: 'italic',
    fontSize: 14,
  },
});

export default DataScreen;
