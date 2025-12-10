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

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    // Validation locale
    if (!email || !email.trim()) {
      Alert.alert('Champ requis', 'Veuillez entrer votre adresse email');
      return;
    }
    
    if (!password) {
      Alert.alert('Champ requis', 'Veuillez entrer votre mot de passe');
      return;
    }

    setLoading(true);
    
    try {
      const result = await AuthService.signIn(email, password);
      
      if (!result.success) {
        Alert.alert('Erreur de connexion', result.error);
      }
      // Si succès, App.js gérera automatiquement la navigation
      // vers Dashboard (si vérifié) ou VerifyEmail (si non vérifié)
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur inattendue est survenue. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

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
            {/* Logo */}
          

            {/* Titre */}
            <Text style={globalStyles.title}>Content de te revoir!</Text>
            <Text style={globalStyles.subtitle}>Veuillez saisir vos informations de connexion ci-dessous</Text>

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

              <Text style={globalStyles.label}>Mot de passe</Text>
              <TextInput
                style={globalStyles.input}
                placeholder="Entrer votre mot de passe"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />

              {/* Mot de passe oublié */}
              <TouchableOpacity 
                style={globalStyles.forgotPassword}
                onPress={() => navigation.navigate('ForgotPassword')}
              >
                <Text style={globalStyles.forgotPasswordText}> Mot de passe oublié?</Text>
              </TouchableOpacity>

              {/* Bouton de connexion */}
              <TouchableOpacity
                style={[globalStyles.button, loading && globalStyles.buttonDisabled]}
                onPress={handleLogin}
                disabled={loading}
              >
                <Text style={globalStyles.buttonText}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </Text>
              </TouchableOpacity>

              {/* Lien d'inscription */}
              <TouchableOpacity 
                style={globalStyles.signupLink}
                onPress={() => navigation.navigate('Register')}
              >
                <Text style={globalStyles.signupText}>
                 Vous n'avez pas de compte ?<Text style={globalStyles.signupLinkText}>S'inscrire</Text>
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
Gérez votre entreprise de manière simple et plus efficace avec SmartBizz...              </Text>
            </View>
          </BackgroundImage>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
