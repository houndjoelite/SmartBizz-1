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
  Dimensions,
} from 'react-native';
import AuthService from '../services/authService';
import globalStyles from '../styles/globalStyles';
import BackgroundImage from '../components/BackgroundImage';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const ForgotPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleResetPassword = async () => {
    // Validation
    if (!email || !email.trim()) {
      Alert.alert('Champ requis', 'Veuillez entrer votre adresse email');
      return;
    }

    // Validation format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Email invalide', 'Veuillez entrer une adresse email valide');
      return;
    }

    setLoading(true);
    console.log('🔐 Envoi du lien de réinitialisation à:', email);
    
    const result = await AuthService.resetPassword(email.trim());
    
    if (result.success) {
      console.log('✅ Email de réinitialisation envoyé');
      // Afficher l'écran de confirmation
      setEmailSent(true);
    } else {
      console.error('❌ Erreur:', result.error);
      Alert.alert('Erreur', result.error);
    }
    
    setLoading(false);
  };

  // Si l'email a été envoyé, afficher l'écran de confirmation
  if (emailSent) {
    return (
      <KeyboardAvoidingView 
        style={globalStyles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={isMobile ? globalStyles.mobileLayout : globalStyles.twoColumnLayout}>
          <View style={[globalStyles.leftSection, isMobile && { flex: 0, paddingVertical: 40 }]}>
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}>
              {/* Icône de succès */}
              <View style={{ alignItems: 'center', marginBottom: 32 }}>
                <View style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: '#10b981',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 24
                }}>
                  <Text style={{ fontSize: 40 }}>✓</Text>
                </View>
                
                <Text style={[globalStyles.title, { textAlign: 'center' }]}>
                  Email Envoyé !
                </Text>
                <Text style={[globalStyles.subtitle, { textAlign: 'center', marginTop: 8 }]}>
                  Un lien de réinitialisation a été envoyé à{'\n'}
                  <Text style={{ fontWeight: '600', color: '#111' }}>{email}</Text>
                </Text>
              </View>

              {/* Instructions */}
              <View style={{
                backgroundColor: '#f9fafb',
                borderRadius: 12,
                padding: 20,
                marginBottom: 24
              }}>
                <Text style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: '#111',
                  marginBottom: 16
                }}>
                  Suivez ces étapes :
                </Text>

                {[
                  'Ouvrez votre boîte mail',
                  'Cherchez un email de Firebase (vérifiez aussi les spams)',
                  'Cliquez sur le lien de réinitialisation',
                  'Définissez votre nouveau mot de passe',
                  'Revenez ici et connectez-vous avec votre nouveau mot de passe'
                ].map((step, index) => (
                  <View key={index} style={{
                    flexDirection: 'row',
                    marginBottom: 12,
                    alignItems: 'flex-start'
                  }}>
                    <View style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: '#10b981',
                      justifyContent: 'center',
                      alignItems: 'center',
                      marginRight: 12
                    }}>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>
                        {index + 1}
                      </Text>
                    </View>
                    <Text style={{
                      flex: 1,
                      fontSize: 14,
                      color: '#374151',
                      lineHeight: 20
                    }}>
                      {step}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Bouton retour à la connexion */}
              <TouchableOpacity
                style={globalStyles.button}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={globalStyles.buttonText}>
                  Retour à la Connexion
                </Text>
              </TouchableOpacity>

              {/* Renvoyer l'email */}
              <TouchableOpacity
                style={[globalStyles.signupLink, { marginTop: 16 }]}
                onPress={() => setEmailSent(false)}
              >
                <Text style={globalStyles.signupText}>
                  Vous n'avez pas reçu l'email ? <Text style={globalStyles.signupLinkText}>Renvoyer</Text>
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>

          {/* Section droite - Illustration (PC uniquement) */}
          {!isMobile && (
            <BackgroundImage
              imageSource="/public/unnamed.png"
              style={globalStyles.rightSectionWithImage}
            >
              <View style={globalStyles.illustrationContainer}>
                <Text style={globalStyles.illustrationTitle}>
                  Gérez votre entreprise de manière simple et plus efficace avec SmartBizz...
                </Text>
              </View>
            </BackgroundImage>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  }

  // Formulaire de saisie de l'email
  return (
    <KeyboardAvoidingView 
      style={globalStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={isMobile ? globalStyles.mobileLayout : globalStyles.twoColumnLayout}>
        {/* Section gauche - Formulaire */}
        <ScrollView 
          style={[globalStyles.leftSection, isMobile && { flex: 0, paddingVertical: 40 }]}
          contentContainerStyle={{ paddingVertical: 60, paddingHorizontal: 40, minHeight: '100%', justifyContent: 'center' }}
          showsVerticalScrollIndicator={true}
        >
            {/* Titre */}
            <Text style={globalStyles.title}>Mot de passe oublié ?</Text>
            <Text style={globalStyles.subtitle}>
              Entrez votre adresse email et nous vous enverrons un lien pour réinitialiser votre mot de passe
            </Text>

            {/* Formulaire */}
            <View style={globalStyles.form}>
              <Text style={globalStyles.label}>Email</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Entrez votre adresse mail"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />

              {/* Bouton de réinitialisation */}
              <TouchableOpacity
                style={[globalStyles.button, loading && globalStyles.buttonDisabled]}
                onPress={handleResetPassword}
                disabled={loading}
              >
                <Text style={globalStyles.buttonText}>
                  {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
                </Text>
              </TouchableOpacity>

              {/* Lien de retour à la connexion */}
              <TouchableOpacity 
                style={globalStyles.signupLink}
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={globalStyles.signupText}>
                  Retour à la <Text style={globalStyles.signupLinkText}>Connexion</Text>
                </Text>
              </TouchableOpacity>
            </View>
        </ScrollView>

        {/* Section droite - Illustration avec image de fond (PC uniquement) */}
        {!isMobile && (
          <BackgroundImage
            imageSource="/public/unnamed.png"
            style={globalStyles.rightSectionWithImage}
          >
            <View style={globalStyles.illustrationContainer}>
              <Text style={globalStyles.illustrationTitle}>
                Gérez votre entreprise de manière simple et plus efficace avec SmartBizz...
              </Text>
            </View>
          </BackgroundImage>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default ForgotPasswordScreen;

