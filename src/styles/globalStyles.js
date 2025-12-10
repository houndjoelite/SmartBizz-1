import { StyleSheet } from 'react-native';

export const globalStyles = StyleSheet.create({
  // Container principal - fond blanc
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    // IMPORTANT pour le scroll sur web
    overflow: 'auto',
    height: '100%',
  },

  // Header du dashboard
  header: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  // Carte de contenu
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
 
  // Layout en deux colonnes
  twoColumnLayout: {
    flex: 1,
    flexDirection: 'row',
    height: '100vh', // Hauteur pleine sur web
    overflow: 'hidden',
  },

  // Layout mobile (une colonne)
  mobileLayout: {
    flex: 1,
    flexDirection: 'column',
    minHeight: '100vh', // Hauteur minimale sur web
    overflow: 'auto',
  },

  // Section droite avec image de fond (PC uniquement)
  rightSectionWithImage: {
    flex: 1,
    backgroundColor: '#8b5cf6',
    paddingHorizontal: 40,
    paddingVertical: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 24,
    margin: 16,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },

  // Overlay pour l'image
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(139, 92, 246, 0.7)',
    borderRadius: 24,
  },
 
  // Section gauche (formulaire)
  leftSection: {
    flex: 1,
    backgroundColor: '#ffffff',
    // Padding retiré car maintenant dans ScrollView contentContainerStyle
  },
 
  // Section droite (illustration)
  rightSection: {
    flex: 1,
    backgroundColor: '#8b5cf6', // Violet comme dans l'image
    paddingHorizontal: 40,
    paddingVertical: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
 
  // Logo et titre
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
 
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
  },
 
  logoIcon: {
    fontSize: 24,
    marginRight: 8,
  },
 
  // Titre principal
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 8,
    textAlign: 'center',
  },
 
  // Sous-titre
  subtitle: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 40,
  },
 
  // Formulaire
  form: {
    width: '100%',
  },
 
  // Labels
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
 
  // Inputs modernes
  input: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    marginBottom: 20,
    color: '#1f2937',
  },
 
  inputFocus: {
    borderColor: '#3b82f6',
    borderWidth: 2,
  },
 
  // Lien mot de passe oublié
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
 
  forgotPasswordText: {
    color: '#3b82f6',
    fontSize: 14,
    fontWeight: '500',
  },
 
  // Bouton principal
  button: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
 
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
 
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
 
  // Séparateur
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
 
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e5e7eb',
  },
 
  separatorText: {
    marginHorizontal: 16,
    color: '#6b7280',
    fontSize: 14,
  },
 
  // Lien inscription
  signupLink: {
    alignItems: 'center',
  },
 
  signupText: {
    color: '#6b7280',
    fontSize: 14,
  },
 
  signupLinkText: {
    color: '#3b82f6',
    fontWeight: '500',
  },
 
  // Section illustration
  illustrationContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
 
  illustrationTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 16,
  },
 
  illustrationSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    lineHeight: 24,
  },
 
  // Messages d'erreur
  errorText: {
    color: '#ef4444',
    fontSize: 14,
    marginBottom: 8,
  },
 
  successText: {
    color: '#10b981',
    fontSize: 14,
    marginBottom: 8,
  },
});

export default globalStyles;
