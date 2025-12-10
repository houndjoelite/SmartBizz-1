import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Switch,
  Platform,
} from 'react-native';
import { useSettings } from '../../hooks/useSettings';
import { Ionicons } from '@expo/vector-icons';
import { auth } from '../../services/firebase';
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

const SecuritySettingsScreen = ({ navigation }) => {
  const { settings, updateSettings } = useSettings();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    settings?.security?.twoFactorEnabled || false
  );
  const [sessionTimeout, setSessionTimeout] = useState(
    settings?.security?.sessionTimeout?.toString() || '30'
  );
  const [requirePassword, setRequirePassword] = useState(
    settings?.security?.requirePasswordForSensitiveActions || true
  );

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setSubmitting(true);

    try {
      const user = auth.currentUser;
      if (!user || !user.email) {
        Alert.alert('Erreur', 'Utilisateur non connecté');
        return;
      }

      // Reauthenticate user
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);

      // Update password
      await updatePassword(user, newPassword);

      Alert.alert('Succès', 'Mot de passe modifié avec succès');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error('Erreur:', error);
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Erreur', 'Mot de passe actuel incorrect');
      } else {
        Alert.alert('Erreur', error.message || 'Erreur lors du changement de mot de passe');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveSecuritySettings = async () => {
    setSubmitting(true);

    const result = await updateSettings({
      'security.twoFactorEnabled': twoFactorEnabled,
      'security.sessionTimeout': parseInt(sessionTimeout) || 30,
      'security.requirePasswordForSensitiveActions': requirePassword,
    });

    setSubmitting(false);

    if (result.success) {
      Alert.alert('Succès', 'Paramètres de sécurité mis à jour');
    } else {
      Alert.alert('Erreur', result.error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Ancien header - Commenté
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sécurité</Text>
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
        <Text style={styles.newHeaderTitle}>Sécurité</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Changer le mot de passe */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Changer le mot de passe</Text>
          
          <Text style={styles.label}>Mot de passe actuel</Text>
          <TextInput
            style={styles.input}
            placeholder="Votre mot de passe actuel"
            secureTextEntry
            value={currentPassword}
            onChangeText={setCurrentPassword}
          />

          <Text style={styles.label}>Nouveau mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Au moins 6 caractères"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />

          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <TextInput
            style={styles.input}
            placeholder="Répétez le nouveau mot de passe"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleChangePassword}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>Changer le mot de passe</Text>
          </TouchableOpacity>
        </View>

        {/* Authentification à deux facteurs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Authentification à deux facteurs</Text>
          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Activer 2FA</Text>
              <Text style={styles.settingDescription}>
                Sécurité renforcée (Bientôt disponible)
              </Text>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={setTwoFactorEnabled}
              disabled={true}
            />
          </View>
        </View>

        {/* Paramètres de session */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Paramètres de session</Text>
          
          <Text style={styles.label}>Délai d'inactivité (minutes)</Text>
          <TextInput
            style={styles.input}
            placeholder="30"
            keyboardType="numeric"
            value={sessionTimeout}
            onChangeText={setSessionTimeout}
          />

          <View style={styles.settingRow}>
            <View style={styles.settingInfo}>
              <Text style={styles.settingLabel}>Mot de passe pour actions sensibles</Text>
              <Text style={styles.settingDescription}>
                Demander le mot de passe pour supprimer, etc.
              </Text>
            </View>
            <Switch
              value={requirePassword}
              onValueChange={setRequirePassword}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleSaveSecuritySettings}
            disabled={submitting}
          >
            <Text style={styles.buttonText}>Enregistrer les paramètres</Text>
          </TouchableOpacity>
        </View>

        {/* Conseils de sécurité */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🔒</Text>
          <Text style={styles.infoTitle}>Conseils de sécurité</Text>
          <Text style={styles.infoText}>
            • Utilisez un mot de passe fort{'\n'}
            • Ne partagez jamais votre mot de passe{'\n'}
            • Déconnectez-vous sur les appareils publics{'\n'}
            • Vérifiez régulièrement vos appareils connectés
          </Text>
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
  section: { 
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
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
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8, marginTop: 12 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    fontSize: 16,
    color: '#111',
  },
  button: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  settingInfo: { flex: 1, marginRight: 16 },
  settingLabel: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 4 },
  settingDescription: { fontSize: 13, color: '#6b7280' },
  infoCard: {
    backgroundColor: '#eff6ff',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
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
  infoTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 12 },
  infoText: { fontSize: 14, color: '#6b7280', textAlign: 'center', lineHeight: 24 },
});

export default SecuritySettingsScreen;


