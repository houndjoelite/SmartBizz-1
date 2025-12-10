import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSettings } from '../../hooks/useSettings';
import { Ionicons } from '@expo/vector-icons';

const BackupSettingsScreen = ({ navigation }) => {
  const { settings, backups, createBackup, loadBackups, loading } = useSettings();
  const [creating, setCreating] = React.useState(false);

  useEffect(() => {
    loadBackups();
  }, []);

  const handleCreateBackup = async () => {
    setCreating(true);
    const result = await createBackup();
    setCreating(false);

    if (result.success) {
      Alert.alert('Succès', 'Sauvegarde créée avec succès');
    } else {
      Alert.alert('Erreur', result.error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {/* Ancien header - Commenté
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sauvegarde & Restauration</Text>
        <View style={{ width: 80 }} />
      </View>
      */}

      {/* Nouveau header visible */}
      <View style={styles.newHeader}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Settings')}
          style={styles.newBackButton}
        >
          <Ionicons name="chevron-back" size={18} color="#ffffff" />
          <Text style={styles.newBackButtonText}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.newHeaderTitle}>Sauvegarde & Restauration</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>☁️</Text>
          <Text style={styles.infoTitle}>Sauvegarde automatique activée</Text>
          <Text style={styles.infoText}>
            Vos données sont sauvegardées quotidiennement sur Firebase
          </Text>
          {settings?.backup?.lastBackup && (
            <Text style={styles.infoDate}>
              Dernière sauvegarde: {formatDate(settings.backup.lastBackup)}
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[styles.createBackupButton, creating && styles.buttonDisabled]}
          onPress={handleCreateBackup}
          disabled={creating}
        >
          {creating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.createBackupIcon}>💾</Text>
              <Text style={styles.createBackupText}>Créer une sauvegarde manuelle</Text>
            </>
          )}
        </TouchableOpacity>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sauvegardes récentes</Text>
          {backups && backups.length > 0 ? (
            backups.map((backup) => (
              <View key={backup.id} style={styles.backupItem}>
                <View style={styles.backupInfo}>
                  <Text style={styles.backupDate}>{formatDate(backup.createdAt)}</Text>
                  <Text style={styles.backupDetails}>
                    {backup.productsCount} produits • {backup.salesCount} ventes • {backup.clientsCount} clients
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.noBackups}>Aucune sauvegarde disponible</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  // Anciens styles header - Commentés
  /*
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: { fontSize: 16, color: '#3b82f6', fontWeight: '500' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  */

  // Nouveaux styles header - Plus visibles et simples
  newHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    zIndex: 1000,
  },
  newBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    marginRight: 15,
  },
  newBackButtonText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    marginLeft: 4,
  },
  newHeaderTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    flex: 1,
  },
  content: { flex: 1, padding: 20 },
  infoCard: {
    backgroundColor: '#eff6ff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  infoIcon: { fontSize: 48, marginBottom: 12 },
  infoTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 8 },
  infoText: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 8 },
  infoDate: { fontSize: 12, color: '#3b82f6', fontWeight: '600' },
  createBackupButton: {
    backgroundColor: '#3b82f6',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
  },
  buttonDisabled: { opacity: 0.5 },
  createBackupIcon: { fontSize: 20, marginRight: 8 },
  createBackupText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  section: { 
    marginBottom: 24,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 12 },
  backupItem: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  backupDate: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 4 },
  backupDetails: { fontSize: 13, color: '#6b7280' },
  noBackups: { fontSize: 14, color: '#9ca3af', textAlign: 'center', padding: 20 },
});

export default BackupSettingsScreen;


