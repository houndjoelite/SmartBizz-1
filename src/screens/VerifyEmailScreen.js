import React, { useState, useEffect } from 'react';
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
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import AuthService from '../services/authService';
import globalStyles from '../styles/globalStyles';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const VerifyEmailScreen = ({ route, navigation }) => {
  const params = route?.params || {};
  const email = params.email || AuthService.getCurrentUser()?.email;
  
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  // Countdown timer pour le renvoi de l'email
  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1);
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  // Vérifier automatiquement le statut toutes les 2 secondes
  useEffect(() => {
    console.log('🔄 Démarrage de la vérification automatique toutes les 2 secondes');
    
    let isChecking = false; // Pour éviter les vérifications concurrentes
    
    const checkInterval = setInterval(async () => {
      if (isChecking) {
        console.log('⏭️  Vérification en cours, skip...');
        return;
      }
      
      isChecking = true;
      console.log('⏰ Vérification automatique...');
      
      try {
        const result = await AuthService.checkEmailVerified();
        
        if (result.success && result.verified) {
          console.log('🎉 Email vérifié automatiquement !');
          clearInterval(checkInterval);
          
          // IMPORTANT : Forcer le rechargement complet pour que App.js détecte le changement
          console.log('🔄 Rechargement de l\'application...');
          
          if (typeof window !== 'undefined' && window.location) {
            // Sur web : recharger complètement
            window.location.reload();
          } else {
            // Sur mobile : tenter une navigation forcée
            try {
              await AuthService.signOut();
              // Attendre un peu
              setTimeout(() => {
                Alert.alert(
                  'Email Vérifié !',
                  'Votre email a été vérifié avec succès ! Reconnectez-vous pour accéder au Dashboard.',
                  [{ text: 'OK' }]
                );
              }, 500);
            } catch (error) {
              console.error('Erreur lors de la déconnexion:', error);
            }
          }
        }
      } catch (error) {
        console.error('Erreur lors de la vérification:', error);
      } finally {
        isChecking = false;
      }
    }, 2000); // Vérifier toutes les 2 secondes au lieu de 3

    return () => {
      console.log('🛑 Arrêt de la vérification automatique');
      clearInterval(checkInterval);
    };
  }, []);

  const handleCheckNow = async () => {
    console.log('🔘 Bouton "J\'ai vérifié mon email" cliqué');
    setLoading(true);
    
    try {
      const result = await AuthService.checkEmailVerified();
      console.log('📊 Résultat de la vérification:', result);
      
      if (result.success) {
        if (result.verified) {
          console.log('🎉 Email vérifié avec succès !');
          
          // Afficher un message rapide puis recharger
          Alert.alert(
            'Email Vérifié !',
            'Redirection vers le Dashboard...',
            [{ text: 'OK', onPress: () => {
              if (typeof window !== 'undefined' && window.location) {
                window.location.reload();
              }
            }}]
          );
          
          // Recharger automatiquement après 1 seconde même si l'utilisateur ne clique pas
          setTimeout(() => {
            if (typeof window !== 'undefined' && window.location) {
              console.log('🔄 Rechargement automatique...');
              window.location.reload();
            }
          }, 1000);
        } else {
          console.log('⏳ Email pas encore vérifié');
          Alert.alert(
            'Pas encore vérifié',
            'Veuillez cliquer sur le lien dans l\'email que nous vous avons envoyé.\n\nAprès avoir cliqué sur le lien, attendez quelques secondes et l\'application se mettra à jour automatiquement.',
            [{ text: 'OK' }]
          );
        }
      } else {
        console.log('❌ Erreur:', result.error);
        Alert.alert('Erreur', result.error);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification:', error);
      Alert.alert('Erreur', 'Une erreur est survenue lors de la vérification.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setResendLoading(true);
    const result = await AuthService.resendVerificationEmail();
    
    if (result.success) {
      Alert.alert('Email Envoyé', 'Un nouvel email de vérification a été envoyé.');
      setTimer(60);
      setCanResend(false);
    } else {
      Alert.alert('Erreur', result.error);
    }
    
    setResendLoading(false);
  };

  // Vérifier si on a un email
  if (!email) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center', padding: 24 }]}>
        <Text style={styles.title}>Erreur</Text>
        <Text style={styles.subtitle}>
          Impossible de récupérer votre adresse email.
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.buttonText}>Retour à la connexion</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={globalStyles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <Text style={styles.icon}>✉️</Text>
          </View>

          {/* Titre */}
          <Text style={styles.title}>Vérifiez votre email</Text>
          <Text style={styles.subtitle}>
            Nous avons envoyé un email de vérification à{'\n'}
            <Text style={styles.email}>{email}</Text>
          </Text>

          {/* Instructions */}
          <View style={styles.instructionsContainer}>
            <Text style={styles.instructionsTitle}>Comment vérifier votre email :</Text>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>1.</Text>
              <Text style={styles.instructionText}>
                Ouvrez votre boîte mail ({email})
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>2.</Text>
              <Text style={styles.instructionText}>
                Cherchez un email de Firebase (vérifiez aussi les spams)
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>3.</Text>
              <Text style={styles.instructionText}>
                Cliquez sur le lien de vérification dans l'email
              </Text>
            </View>
            <View style={styles.instructionItem}>
              <Text style={styles.instructionNumber}>4.</Text>
              <Text style={styles.instructionText}>
                Revenez ici et cliquez sur "J'ai vérifié mon email"
              </Text>
            </View>
          </View>

          {/* Bouton de vérification */}
          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleCheckNow}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>J'ai vérifié mon email</Text>
            )}
          </TouchableOpacity>

          {/* Renvoyer l'email */}
          <View style={styles.resendContainer}>
            <Text style={styles.resendText}>
              Vous n'avez pas reçu l'email?
            </Text>
            {canResend ? (
              <TouchableOpacity
                onPress={handleResendEmail}
                disabled={resendLoading}
              >
                <Text style={styles.resendLink}>
                  {resendLoading ? 'Envoi...' : 'Renvoyer'}
                </Text>
              </TouchableOpacity>
            ) : (
              <Text style={styles.timerText}>
                Renvoyer dans {timer}s
              </Text>
            )}
          </View>

          {/* Retour à la connexion */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              Alert.alert(
                'Se déconnecter ?',
                'Votre compte a été créé mais ne sera pas activé tant que vous ne vérifiez pas votre email.\n\nVous pourrez revenir vérifier votre email en vous reconnectant.',
                [
                  { text: 'Annuler', style: 'cancel' },
                  {
                    text: 'Se déconnecter',
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        console.log('🚪 Déconnexion de l\'utilisateur...');
                        const result = await AuthService.signOut();
                        
                        if (result.success) {
                          console.log('✅ Déconnecté avec succès');
                          
                          // Forcer le rechargement pour revenir à l'écran de connexion
                          setTimeout(() => {
                            if (typeof window !== 'undefined' && window.location) {
                              window.location.reload();
                            }
                          }, 100);
                        } else {
                          Alert.alert('Erreur', 'Impossible de se déconnecter. Veuillez réessayer.');
                        }
                      } catch (error) {
                        console.error('❌ Erreur lors de la déconnexion:', error);
                        Alert.alert('Erreur', 'Une erreur est survenue lors de la déconnexion.');
                      }
                    }
                  }
                ]
              );
            }}
          >
            <Text style={styles.backButtonText}>
              Se déconnecter
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  content: {
    alignItems: 'center',
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    fontSize: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 40,
    lineHeight: 22,
  },
  email: {
    fontWeight: '600',
    color: '#111',
  },
  instructionsContainer: {
    width: '100%',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 16,
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  instructionNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#10b981',
    marginRight: 12,
    width: 24,
  },
  instructionText: {
    fontSize: 14,
    color: '#374151',
    flex: 1,
    lineHeight: 20,
  },
  button: {
    width: '100%',
    height: 52,
    backgroundColor: '#111',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 24,
  },
  resendText: {
    fontSize: 14,
    color: '#6b7280',
  },
  resendLink: {
    fontSize: 14,
    color: '#111',
    fontWeight: '600',
  },
  timerText: {
    fontSize: 14,
    color: '#9ca3af',
  },
  backButton: {
    marginTop: 12,
  },
  backButtonText: {
    fontSize: 14,
    color: '#6b7280',
    textDecorationLine: 'underline',
  },
});

export default VerifyEmailScreen;

