import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Platform } from 'react-native';
import AuthService from './src/services/authService';

// Import des écrans d'authentification
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import VerifyEmailScreen from './src/screens/VerifyEmailScreen';

// Import du MainLayout - Contient tous les écrans principaux avec Sidebar et TopBar fixes
import { MainLayout } from './src/components/MainLayout';

const Stack = createStackNavigator();

export default function App() {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (user) => {
      if (user) {
        // IMPORTANT : Toujours rafraîchir le statut de vérification
        console.log('👤 Utilisateur détecté, rechargement du statut...');
        await user.reload();
        
        console.log('📧 Statut emailVerified Firebase Auth:', user.emailVerified);
        
        // Récupérer les données de l'utilisateur depuis Firestore
        const result = await AuthService.getUserData(user.uid);
        if (result.success) {
          // Pour les comptes existants : si emailVerified est undefined, on considère comme vérifié
          // Pour les nouveaux comptes : on utilise TOUJOURS le statut Firebase Auth (source de vérité)
          const isEmailVerified = result.data.emailVerified === false 
            ? user.emailVerified  // Nouveau compte : vérifier avec Firebase Auth
            : (result.data.emailVerified ?? true); // Ancien compte sans le champ : considérer comme vérifié
          
          console.log('✅ Email vérifié final:', isEmailVerified);
          setUserData({ ...result.data, emailVerified: isEmailVerified });
        } else {
          // Si pas de données dans Firestore, utiliser le statut Firebase
          setUserData({ emailVerified: user.emailVerified, isActive: true });
        }
      } else {
        console.log('👋 Aucun utilisateur connecté');
        setUserData(null);
      }
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Configurer le scroll sur Web (une seule fois au montage)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      // Configurer le scroll une seule fois
      const html = document.documentElement;
      const body = document.body;
      const root = document.getElementById('root');
      
      // Sauvegarder les styles originaux
      const originalStyles = {
        htmlOverflow: html.style.overflow,
        bodyOverflow: body.style.overflow,
        rootOverflow: root?.style.overflow,
      };
      
      // Appliquer les styles de scroll
      html.style.overflow = 'auto';
      html.style.height = '100%';
      body.style.overflow = 'auto';
      body.style.height = '100%';
      if (root) {
        root.style.overflow = 'visible';
        root.style.minHeight = '100%';
      }
      
      // Nettoyer au démontage (optionnel)
      return () => {
        html.style.overflow = originalStyles.htmlOverflow || '';
        body.style.overflow = originalStyles.bodyOverflow || '';
        if (root) {
          root.style.overflow = originalStyles.rootOverflow || '';
        }
      };
    }
  }, []);

  if (loading) {
    return null; // Tu peux ajouter un écran de chargement ici
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: Platform.OS !== 'web',
        }}
      >
        {!user ? (
          // Écrans d'authentification
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
            <Stack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
          </>
        ) : (
          // Écran principal avec la navigation personnalisée
          <Stack.Screen name="Main">
            {() => <MainLayout user={user} userData={userData} />}
          </Stack.Screen>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
