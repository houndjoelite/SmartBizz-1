import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  StyleSheet,
  Animated,
} from 'react-native';
import AuthService from '../services/authService';

const RegisterScreen = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    businessType: '',
    businessName: '',
  });
  const [loading, setLoading] = useState(false);
  const [showBusinessTypePicker, setShowBusinessTypePicker] = useState(false);

  const businessTypes = [
    'Commerçant',
    'Artisan',
    'Gérant Mobile Money',
    'Boutiquier',
    'Éleveur',
    'Salon de coiffure',
    'Restaurant',
    'Autre',
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = () => {
    switch (currentStep) {
      case 1:
        if (!formData.firstName.trim()) {
          Alert.alert('Erreur', 'Le prénom est requis');
          return false;
        }
        if (!formData.lastName.trim()) {
          Alert.alert('Erreur', 'Le nom est requis');
          return false;
        }
        return true;

      case 2:
        if (!formData.email.trim()) {
          Alert.alert('Erreur', 'L\'email est requis');
          return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          Alert.alert('Erreur', 'Veuillez entrer un email valide');
          return false;
        }
        return true;

      case 3:
        if (!formData.businessType) {
          Alert.alert('Erreur', 'Le type d\'activité est requis');
          return false;
        }
        if (!formData.businessName.trim()) {
          Alert.alert('Erreur', 'Le nom de l\'entreprise est requis');
          return false;
        }
        return true;

      case 4:
        if (!formData.password) {
          Alert.alert('Erreur', 'Le mot de passe est requis');
          return false;
        }
        if (formData.password.length < 6) {
          Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
          return false;
        }
        if (!formData.confirmPassword) {
          Alert.alert('Erreur', 'Veuillez confirmer votre mot de passe');
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
          return false;
        }
        return true;

      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleRegister = async () => {
    if (!validateStep()) return;

    setLoading(true);
    
    try {
      console.log('Début de l\'inscription...', formData.email);
      const result = await AuthService.signUp(formData);
      console.log('Résultat inscription:', result);

      if (result.success) {
        // Rediriger vers l'écran de vérification
        navigation.navigate('VerifyEmail', { 
          email: result.email,
          fromRegistration: true
        });
        
        // Afficher un message de succès
        setTimeout(() => {
          Alert.alert(
            'Compte Créé !', 
            'Un email de vérification a été envoyé à ' + result.email + '\n\nVeuillez vérifier votre boîte mail (et les spams) et cliquer sur le lien pour activer votre compte.',
            [{ text: 'OK' }]
          );
        }, 500);
      } else {
        Alert.alert('Erreur d\'inscription', result.error);
      }
    } catch (error) {
      console.error('Erreur dans handleRegister:', error);
      Alert.alert('Erreur', 'Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Informations personnelles</Text>
            <Text style={styles.stepSubtitle}>Commençons par votre identité</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Prénom *</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre prénom"
                value={formData.firstName}
                onChangeText={value => handleInputChange('firstName', value)}
                autoFocus
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nom *</Text>
              <TextInput
                style={styles.input}
                placeholder="Entrez votre nom"
                value={formData.lastName}
                onChangeText={value => handleInputChange('lastName', value)}
              />
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Adresse email</Text>
            <Text style={styles.stepSubtitle}>Pour vous contacter</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Email *</Text>
              <TextInput
                style={styles.input}
                placeholder="exemple@email.com"
                value={formData.email}
                onChangeText={value => handleInputChange('email', value)}
                keyboardType="email-address"
                autoCapitalize="none"
                autoFocus
              />
            </View>
          </View>
        );

      case 3:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Votre activité</Text>
            <Text style={styles.stepSubtitle}>Parlez-nous de votre entreprise</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Type d'activité *</Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => setShowBusinessTypePicker(true)}>
                <Text
                  style={[
                    styles.selectButtonText,
                    !formData.businessType && styles.placeholder,
                  ]}>
                  {formData.businessType || 'Sélectionnez votre activité'}
                </Text>
                <Text style={styles.selectArrow}>▼</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Nom de l'entreprise *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nom de votre activité"
                value={formData.businessName}
                onChangeText={value => handleInputChange('businessName', value)}
              />
            </View>
          </View>
        );

      case 4:
        return (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Sécurité</Text>
            <Text style={styles.stepSubtitle}>Choisissez un mot de passe sécurisé</Text>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Mot de passe *</Text>
              <TextInput
                style={styles.input}
                placeholder="Au moins 6 caractères"
                secureTextEntry
                value={formData.password}
                onChangeText={value => handleInputChange('password', value)}
                autoFocus
              />
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.label}>Confirmer le mot de passe *</Text>
              <TextInput
                style={styles.input}
                placeholder="Répétez votre mot de passe"
                secureTextEntry
                value={formData.confirmPassword}
                onChangeText={value => handleInputChange('confirmPassword', value)}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={true}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Créer un compte</Text>
          
          {/* Indicateur de progression */}
          <View style={styles.progressContainer}>
            {[1, 2, 3, 4].map(step => (
              <View
                key={step}
                style={[
                  styles.progressDot,
                  currentStep >= step && styles.progressDotActive,
                ]}
              />
            ))}
          </View>
          <Text style={styles.progressText}>Étape {currentStep} sur 4</Text>
        </View>

        <View style={styles.form}>
          {renderStep()}

          {/* Boutons de navigation */}
          <View style={styles.buttonContainer}>
            {currentStep > 1 && (
              <TouchableOpacity
                style={styles.buttonSecondary}
                onPress={handlePrevious}>
                <Text style={styles.buttonSecondaryText}>Précédent</Text>
              </TouchableOpacity>
            )}

            {currentStep < 4 ? (
              <TouchableOpacity
                style={[styles.button, currentStep === 1 && styles.buttonFull]}
                onPress={handleNext}>
                <Text style={styles.buttonText}>Suivant</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={handleRegister}
                disabled={loading}>
                <Text style={styles.buttonText}>
                  {loading ? 'Création...' : 'Créer mon compte'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity
            style={styles.loginLink}
            onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginLinkText}>
              Vous avez déjà un compte ? Connectez-vous
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Modal type d'activité */}
      <Modal
        visible={showBusinessTypePicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowBusinessTypePicker(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowBusinessTypePicker(false)}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Type d'activité</Text>
              <TouchableOpacity
                onPress={() => setShowBusinessTypePicker(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <ScrollView>
              {businessTypes.map((type, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.modalItem}
                  onPress={() => {
                    handleInputChange('businessType', type);
                    setShowBusinessTypePicker(false);
                  }}>
                  <Text style={styles.modalItemText}>{type}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scrollContent: { 
    flexGrow: 1, 
    paddingBottom: 30,
    alignItems: 'center',
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#111',
    marginBottom: 30,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  progressDot: {
    width: 40,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#e5e7eb',
  },
  progressDotActive: {
    backgroundColor: '#111',
  },
  progressText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  form: { 
    paddingHorizontal: 24,
    width: '100%',
    maxWidth: 500,
  },
  stepContainer: {
    marginBottom: 30,
  },
  stepTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
  },
  stepSubtitle: {
    fontSize: 15,
    color: '#6b7280',
    marginBottom: 30,
  },
  fieldContainer: { marginBottom: 20 },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#111',
    backgroundColor: '#fff',
  },
  selectButton: {
    height: 50,
    paddingHorizontal: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectButtonText: { fontSize: 16, color: '#111' },
  placeholder: { color: '#9ca3af' },
  selectArrow: { fontSize: 12, color: '#6b7280' },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  button: {
    flex: 1,
    height: 52,
    backgroundColor: '#111',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonFull: {
    width: '100%',
  },
  buttonSecondary: {
    flex: 1,
    height: 52,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { 
    color: '#fff', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  buttonSecondaryText: { 
    color: '#111', 
    fontSize: 16, 
    fontWeight: '600' 
  },
  loginLink: { marginTop: 24, alignItems: 'center' },
  loginLinkText: { fontSize: 14, color: '#6b7280' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: '#111' },
  modalClose: { fontSize: 22, color: '#6b7280' },
  modalItem: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  modalItemText: { fontSize: 16, color: '#111' },
});

export default RegisterScreen;