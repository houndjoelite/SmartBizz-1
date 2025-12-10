/**
 * Thème ArchitectUI - Design Moderne et Professionnel
 * Inspiré du template ArchitectUI - Dashboard Analytics
 * Palette élégante et professionnelle
 */

export const theme = {
  // Couleurs Primaires - ArchitectUI Style
  colors: {
    // Bleu Primaire - Couleur principale (Boutons, Actions)
    primary: '#5B5FED',
    primaryLight: '#7D81F2',
    primaryDark: '#4548C4',
    primaryGradient: ['#5B5FED', '#7D81F2'],
    
    // Bleu Secondaire - Variations
    secondary: '#4A90E2',
    secondaryLight: '#6FA8F0',
    secondaryDark: '#3A7BC8',
    secondaryGradient: ['#4A90E2', '#6FA8F0'],
    
    // Vert - Succès / Gains / Revenus
    success: '#00C48C',
    successLight: '#33D1A3',
    successDark: '#00A876',
    
    // Rose/Rouge - Danger / Alertes / Dépenses
    danger: '#F85C7F',
    dangerLight: '#FA7D9A',
    dangerDark: '#E74467',
    
    // Jaune/Or - Avertissements / Highlights
    warning: '#FDB022',
    warningLight: '#FDC04B',
    warningDark: '#E49E1E',
    
    // Violet - Accent (conservé pour compatibilité)
    accent: '#8B5CF6',
    accentLight: '#A78BFA',
    accentDark: '#7C3AED',
    
    // Fond et Surfaces - Gris très clair ArchitectUI
    background: '#F8F9FB',
    backgroundDark: '#EDF0F5',
    surface: '#FFFFFF',
    surfaceLight: '#FAFBFC',
    
    // Textes - Plus foncés et contrastés
    textPrimary: '#2C3E50',
    textSecondary: '#546E7A',
    textTertiary: '#90A4AE',
    textInverse: '#FFFFFF',
    
    // Bordures - Subtiles
    border: '#E8ECF1',
    borderLight: '#F0F3F7',
    borderDark: '#CFD8DC',
    
    // États
    overlay: 'rgba(44, 62, 80, 0.5)',
    disabled: '#B0BEC5',
    placeholder: '#90A4AE',
    
    // Couleurs des icônes (comme dans ArchitectUI)
    iconYellow: '#FDB022',
    iconPink: '#F85C7F',
    iconGreen: '#00C48C',
    iconBlue: '#5B5FED',
  },
  
  // Dégradés Modernes - ArchitectUI
  gradients: {
    primary: ['#5B5FED', '#7D81F2'],
    secondary: ['#4A90E2', '#6FA8F0'],
    success: ['#00C48C', '#33D1A3'],
    danger: ['#F85C7F', '#FA7D9A'],
    warning: ['#FDB022', '#FDC04B'],
    accent: ['#8B5CF6', '#A78BFA'],
    dark: ['#2C3E50', '#34495E'],
  },
  
  // Typographie - Style ArchitectUI
  fonts: {
    // Famille de police (React Native utilisera la police système)
    regular: 'System',
    medium: 'System',
    bold: 'System',
    
    // Tailles - Hiérarchie claire
    sizes: {
      xs: 11,
      sm: 13,
      base: 15,
      md: 16,
      lg: 18,
      xl: 22,
      '2xl': 26,
      '3xl': 32,
      '4xl': 40,
      '5xl': 48,
    },
    
    // Poids - Plus de variété
    weights: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    
    // Hauteurs de ligne
    lineHeights: {
      tight: 1.2,
      normal: 1.5,
      relaxed: 1.75,
      loose: 2,
    },
  },
  
  // Espacements
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    '4xl': 40,
    '5xl': 48,
  },
  
  // Rayons de Bordure
  borderRadius: {
    sm: 6,
    md: 8,
    lg: 12,
    xl: 16,
    '2xl': 20,
    '3xl': 24,
    full: 9999,
  },
  
  // Ombres
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 5,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
  },
  
  // Ombres Web (pour Platform.select)
  shadowsWeb: {
    sm: '0 1px 2px rgba(0, 0, 0, 0.05)',
    md: '0 2px 4px rgba(0, 0, 0, 0.1)',
    lg: '0 4px 8px rgba(0, 0, 0, 0.15)',
    xl: '0 8px 16px rgba(0, 0, 0, 0.2)',
  },
};

// Helper pour créer des styles avec le thème
export const createThemedStyles = (styleFunc) => {
  return styleFunc(theme);
};

export default theme;

