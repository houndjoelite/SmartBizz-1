import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSettings } from '../../hooks/useSettings';
import { Ionicons } from '@expo/vector-icons';

const PaymentSettingsScreen = ({ navigation }) => {
  const { settings, updateSettings, loading } = useSettings();
  
  const [preferredMethods, setPreferredMethods] = useState([]);
  const [mobileMoneyPhone, setMobileMoneyPhone] = useState('');
  const [bankAccount, setBankAccount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const paymentMethods = [
    { value: 'cash', label: 'Espèces', icon: '💵' },
    { value: 'mobile_money', label: 'Mobile Money', icon: '📱' },
    { value: 'card', label: 'Carte bancaire', icon: '💳' },
    { value: 'other', label: 'Autre', icon: '💼' },
  ];

  useEffect(() => {
    if (settings?.paymentMethods) {
      setPreferredMethods(settings.paymentMethods.preferred || []);
      setMobileMoneyPhone(settings.paymentMethods.mobileMoneyAccounts?.[0] || '');
      setBankAccount(settings.paymentMethods.bankAccount || '');
    }
  }, [settings]);

  const toggleMethod = (method) => {
    if (preferredMethods.includes(method)) {
      setPreferredMethods(preferredMethods.filter(m => m !== method));
    } else {
      setPreferredMethods([...preferredMethods, method]);
    }
  };

  const handleSave = async () => {
    setSubmitting(true);

    const updates = {
      'paymentMethods.preferred': preferredMethods,
      'paymentMethods.mobileMoneyAccounts': mobileMoneyPhone.trim() ? [mobileMoneyPhone.trim()] : [],
      'paymentMethods.bankAccount': bankAccount.trim() || null,
    };

    const result = await updateSettings(updates);
    setSubmitting(false);

    if (result.success) {
      Alert.alert('Succès', 'Modes de paiement mis à jour');
    } else {
      Alert.alert('Erreur', result.error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Ancien header - Commenté
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Modes de paiement</Text>
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
        <Text style={styles.newHeaderTitle}>Modes de paiement</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Modes de paiement préférés</Text>
          <Text style={styles.sectionSubtitle}>
            Sélectionnez les modes que vous acceptez
          </Text>
          <View style={styles.methodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.value}
                style={[
                  styles.methodOption,
                  preferredMethods.includes(method.value) && styles.methodOptionSelected,
                ]}
                onPress={() => toggleMethod(method.value)}
              >
                <Text style={styles.methodIcon}>{method.icon}</Text>
                <Text style={[
                  styles.methodLabel,
                  preferredMethods.includes(method.value) && styles.methodLabelSelected,
                ]}>
                  {method.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mobile Money</Text>
          <Text style={styles.label}>Numéro Mobile Money</Text>
          <TextInput
            style={styles.input}
            placeholder="+225 XX XX XX XX XX"
            keyboardType="phone-pad"
            value={mobileMoneyPhone}
            onChangeText={setMobileMoneyPhone}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Compte bancaire</Text>
          <Text style={styles.label}>IBAN ou numéro de compte</Text>
          <TextInput
            style={styles.input}
            placeholder="Compte bancaire pour virements"
            value={bankAccount}
            onChangeText={setBankAccount}
          />
        </View>

        <TouchableOpacity
          style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
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
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 8 },
  sectionSubtitle: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  methodsContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  methodOption: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  methodOptionSelected: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  methodIcon: { fontSize: 32, marginBottom: 8 },
  methodLabel: { fontSize: 14, color: '#6b7280' },
  methodLabelSelected: { color: '#3b82f6', fontWeight: '600' },
  label: { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 8 },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    fontSize: 16,
    color: '#111',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonDisabled: { opacity: 0.5 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});

export default PaymentSettingsScreen;


