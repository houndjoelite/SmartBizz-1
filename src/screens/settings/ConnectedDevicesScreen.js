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

const ConnectedDevicesScreen = ({ navigation }) => {
  const { devices, disconnectDevice, loadDevices, loading } = useSettings();

  useEffect(() => {
    loadDevices();
  }, []);

  const handleDisconnect = (device) => {
    Alert.alert(
      'Déconnecter l\'appareil',
      `Déconnecter ${device.deviceName} ?`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Déconnecter',
          style: 'destructive',
          onPress: async () => {
            const result = await disconnectDevice(device.id);
            if (result.success) {
              Alert.alert('Succès', 'Appareil déconnecté');
            } else {
              Alert.alert('Erreur', result.error);
            }
          },
        },
      ]
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      {/* Ancien header - Commenté
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Appareils connectés</Text>
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
        <Text style={styles.newHeaderTitle}>Appareils connectés</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.infoCard}>
          <Text style={styles.infoText}>
            Liste des appareils ayant accès à votre compte
          </Text>
        </View>

        {devices && devices.length > 0 ? (
          devices.map((device) => (
            <View key={device.id} style={styles.deviceItem}>
              <View style={styles.deviceIcon}>
                <Text style={styles.deviceIconText}>
                  {device.platform === 'ios' || device.platform === 'android' ? '📱' : '💻'}
                </Text>
              </View>
              <View style={styles.deviceInfo}>
                <Text style={styles.deviceName}>{device.deviceName}</Text>
                <Text style={styles.deviceDetails}>
                  {device.platform} • {device.os}
                </Text>
                <Text style={styles.deviceDate}>
                  Dernière activité: {formatDate(device.lastActivity)}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.disconnectButton}
                onPress={() => handleDisconnect(device)}
              >
                <Text style={styles.disconnectText}>Déconnecter</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <Text style={styles.noDevices}>Aucun appareil enregistré</Text>
        )}
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
    padding: 16,
    borderRadius: 12,
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
  infoText: { fontSize: 14, color: '#6b7280', textAlign: 'center' },
  deviceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
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
  deviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  deviceIconText: { fontSize: 24 },
  deviceInfo: { flex: 1 },
  deviceName: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 4 },
  deviceDetails: { fontSize: 13, color: '#6b7280', marginBottom: 2 },
  deviceDate: { fontSize: 12, color: '#9ca3af' },
  disconnectButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  disconnectText: { fontSize: 13, color: '#ef4444', fontWeight: '500' },
  noDevices: { fontSize: 14, color: '#9ca3af', textAlign: 'center', padding: 20 },
});

export default ConnectedDevicesScreen;


