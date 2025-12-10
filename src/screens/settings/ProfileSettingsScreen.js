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
  Image,
  Platform,
} from 'react-native';
import { useSettings } from '../../hooks/useSettings';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';

const ProfileSettingsScreen = ({ navigation }) => {
  const { settings, updateSettings, uploadLogo, loading } = useSettings();

  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [taxId, setTaxId] = useState('');
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const businessTypes = [
    { value: 'salon', label: 'Salon de coiffure' },
    { value: 'boutique', label: 'Boutique / Commerce' },
    { value: 'ferme', label: 'Ferme / Élevage' },
    { value: 'mobile_money', label: 'Point Mobile Money' },
    { value: 'restaurant', label: 'Restaurant / Maquis' },
    { value: 'service', label: 'Service' },
    { value: 'autre', label: 'Autre' },
  ];

  useEffect(() => {
    if (settings?.businessInfo) {
      const { businessInfo } = settings;
      setBusinessName(businessInfo.businessName || '');
      setBusinessType(businessInfo.businessType || '');
      setTaxId(businessInfo.taxId || '');
      setRegistrationNumber(businessInfo.registrationNumber || '');
      setAddress(businessInfo.address || '');
      setPhone(businessInfo.phone || '');
      setEmail(businessInfo.email || '');
      setWebsite(businessInfo.website || '');
    }
  }, [settings]);

  const handleSave = async () => {
    setSubmitting(true);

    const updates = {
      'businessInfo.businessName': businessName.trim(),
      'businessInfo.businessType': businessType,
      'businessInfo.taxId': taxId.trim(),
      'businessInfo.registrationNumber': registrationNumber.trim(),
      'businessInfo.address': address.trim(),
      'businessInfo.phone': phone.trim(),
      'businessInfo.email': email.trim(),
      'businessInfo.website': website.trim(),
    };

    const result = await updateSettings(updates);

    setSubmitting(false);

    if (result.success) {
      Alert.alert('Succès', 'Informations mises à jour avec succès');
    } else {
      Alert.alert('Erreur', result.error);
    }
  };

  const handlePickLogo = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission requise', 'Nous avons besoin d\'accéder à vos photos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSubmitting(true);
      const uploadResult = await uploadLogo(result.assets[0].uri);
      setSubmitting(false);

      if (uploadResult.success) {
        Alert.alert('Succès', 'Logo mis à jour avec succès');
      } else {
        Alert.alert('Erreur', uploadResult.error);
      }
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
      <View style={styles.newHeader}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Settings')}
          style={styles.newBackButton}
        >
          <Ionicons name="chevron-back" size={18} color="#ffffff" />
          <Text style={styles.newBackButtonText}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.newHeaderTitle}>Informations professionnelles</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Logo */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Logo de l'entreprise</Text>
          <View style={styles.logoContainer}>
            {settings?.businessInfo?.logo ? (
              <Image 
                source={{ uri: settings.businessInfo.logo }} 
                style={styles.logoImage}
              />
            ) : (
              <View style={styles.logoPlaceholder}>
                <Text style={styles.logoPlaceholderText}>📷</Text>
              </View>
            )}
            <TouchableOpacity style={styles.changeLogoButton} onPress={handlePickLogo}>
              <Text style={styles.changeLogoText}>Changer le logo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Informations de base */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations de base</Text>
          
          <Text style={styles.label}>Nom de l'entreprise *</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: Salon Beauté Plus"
            value={businessName}
            onChangeText={setBusinessName}
          />

          <Text style={styles.label}>Type d'activité</Text>
          <View style={styles.chipContainer}>
            {businessTypes.map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.chip,
                  businessType === type.value && styles.chipSelected,
                ]}
                onPress={() => setBusinessType(type.value)}
              >
                <Text
                  style={[
                    styles.chipText,
                    businessType === type.value && styles.chipTextSelected,
                  ]}
                >
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Coordonnées */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Coordonnées</Text>
          
          <Text style={styles.label}>Adresse</Text>
          <TextInput
            style={styles.input}
            placeholder="Adresse complète"
            value={address}
            onChangeText={setAddress}
            multiline
          />

          <Text style={styles.label}>Téléphone</Text>
          <TextInput
            style={styles.input}
            placeholder="+225 XX XX XX XX XX"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="contact@entreprise.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />

          <Text style={styles.label}>Site web / Boutique en ligne</Text>
          <TextInput
            style={styles.input}
            placeholder="https://monsite.com"
            keyboardType="url"
            autoCapitalize="none"
            value={website}
            onChangeText={setWebsite}
          />
        </View>

        {/* Informations légales */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Informations légales (optionnel)</Text>
          
          <Text style={styles.label}>Numéro d'immatriculation</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: CI-ABJ-2023-XXXXX"
            value={registrationNumber}
            onChangeText={setRegistrationNumber}
          />

          <Text style={styles.label}>Numéro fiscal / NIF</Text>
          <TextInput
            style={styles.input}
            placeholder="Ex: 00XXXXXXXXX"
            value={taxId}
            onChangeText={setTaxId}
          />
        </View>

        {/* Bouton Enregistrer */}
        <TouchableOpacity
          style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer les modifications</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
  },
  // Anciens styles header - Commentés
  /*
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    minHeight: 60,
  },
  backButton: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    flex: 1,
    textAlign: 'center',
  },
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 600,
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 16,
  },
  logoContainer: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 4,
  },
  logoImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  logoPlaceholder: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  logoPlaceholderText: {
    fontSize: 32,
  },
  changeLogoButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#eff6ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3b82f6',
    alignItems: 'center',
  },
  changeLogoText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    fontSize: 16,
    color: '#111',
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  chipSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  chipText: {
    fontSize: 14,
    color: '#6b7280',
  },
  chipTextSelected: {
    color: '#fff',
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 32,
    width: '100%',
    maxWidth: 600,
    ...Platform.select({
      ios: {
        shadowColor: '#3b82f6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileSettingsScreen;