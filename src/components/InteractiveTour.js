import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Platform,
  Modal,
  Animated,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import SettingsService from '../services/settingsService';

const { width, height } = Dimensions.get('window');
const isWeb = Platform.OS === 'web';
const isMobile = width < 768;

// Fonction helper pour calculer une position safe (qui ne sort pas de l'écran)
const getSafePosition = (position, tooltipWidth = 380, tooltipHeight = 250) => {
  let { top, left } = position;
  
  // Convertir les pourcentages en pixels si nécessaire
  if (typeof top === 'string' && top.includes('%')) {
    top = (parseFloat(top) / 100) * height;
  } else if (typeof top === 'string') {
    top = parseFloat(top);
  }
  
  if (typeof left === 'string' && left.includes('%')) {
    left = (parseFloat(left) / 100) * width;
  } else if (typeof left === 'string') {
    left = parseFloat(left);
  }
  
  // Marges de sécurité
  const margin = 20;
  
  // Vérifier et ajuster top
  if (top < margin) top = margin;
  if (top + tooltipHeight > height - margin) {
    top = height - tooltipHeight - margin;
  }
  
  // Vérifier et ajuster left
  if (left < margin) left = margin;
  if (left + tooltipWidth > width - margin) {
    left = width - tooltipWidth - margin;
  }
  
  return { top, left };
};

/**
 * InteractiveTour - Guide interactif avec pointeurs vers les vrais éléments
 * Chaque étape pointe vers un élément réel de l'interface
 */
export const InteractiveTour = ({ userId, onComplete }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [visible, setVisible] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    checkTourStatus();
  }, [userId]);

  useEffect(() => {
    if (visible) {
      // Animation de pulsation pour la main/flèche
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.2,
            duration: 800,
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [visible]);

  const checkTourStatus = async () => {
    if (!userId) return;
    
    const result = await SettingsService.getBusinessInfo(userId);
    if (result.success) {
      const hasCompletedTour = result.data?.hasCompletedInteractiveTour;
      if (!hasCompletedTour) {
        // Afficher le guide après un délai
        setTimeout(() => setVisible(true), 1500);
      }
    } else {
      // Nouveau compte, afficher le guide
      setTimeout(() => setVisible(true), 1500);
    }
  };

  // Définition des étapes du tour avec positions RÉELLES
  const tourSteps = [
    {
      id: 'welcome',
      title: '👋 Bienvenue sur SmartBizz !',
      description: 'Je vais vous faire découvrir toutes les fonctionnalités. Suivez les flèches et cliquez où je vous indique !',
      position: { top: '35%', left: '50%' },
      translateX: '-50%',
      arrowPosition: null,
      highlightElement: null,
      showHand: false,
    },
    {
      id: 'sidebar-logo',
      title: '🏢 Votre Espace SmartBizz',
      description: 'C\'est ici que tout commence ! Le logo de votre application de gestion.',
      position: { top: '80px', left: '320px' },
      translateX: '0%',
      arrowPosition: 'left',
      highlightElement: { top: 20, left: 20, width: 240, height: 80 },
      showHand: true,
      handPosition: { top: 40, left: 140 },
    },
    {
      id: 'dashboard-menu',
      title: '📊 Tableau de Bord',
      description: 'Cliquez ici pour voir vos statistiques : revenus, ventes, inventaire en temps réel !',
      position: { top: '180px', left: '320px' },
      translateX: '0%',
      arrowPosition: 'left',
      highlightElement: { top: 140, left: 20, width: 240, height: 50 },
      showHand: true,
      handPosition: { top: 155, left: 140 },
    },
    {
      id: 'quicksale-menu',
      title: '⚡ Vente Rapide',
      description: 'Pour enregistrer une vente en quelques secondes ! Parfait pour les transactions au comptoir.',
      position: { top: '280px', left: '320px' },
      translateX: '0%',
      arrowPosition: 'left',
      highlightElement: { top: 240, left: 20, width: 240, height: 50 },
      showHand: true,
      handPosition: { top: 255, left: 140 },
    },
    {
      id: 'sales-menu',
      title: '📈 Statistiques de Ventes',
      description: 'Analysez vos performances avec des graphiques : revenus journaliers, produits populaires...',
      position: { top: '330px', left: '320px' },
      translateX: '0%',
      arrowPosition: 'left',
      highlightElement: { top: 290, left: 20, width: 240, height: 50 },
      showHand: true,
      handPosition: { top: 305, left: 140 },
    },
    {
      id: 'invoices-menu',
      title: '📄 Factures Professionnelles',
      description: 'Créez, gérez et imprimez des factures avec votre logo. Export Excel inclus !',
      position: { top: '380px', left: '320px' },
      translateX: '0%',
      arrowPosition: 'left',
      highlightElement: { top: 340, left: 20, width: 240, height: 50 },
      showHand: true,
      handPosition: { top: 355, left: 140 },
    },
    {
      id: 'inventory-menu',
      title: '📦 Gestion d\'Inventaire',
      description: 'Suivez votre stock, ajoutez des produits, gérez les alertes de rupture.',
      position: { top: '480px', left: '320px' },
      translateX: '0%',
      arrowPosition: 'left',
      highlightElement: { top: 440, left: 20, width: 240, height: 50 },
      showHand: true,
      handPosition: { top: 455, left: 140 },
    },
    {
      id: 'quick-actions',
      title: '🚀 Actions Rapides',
      description: 'Vos raccourcis favoris ! Nouvelle vente, créer facture, ajouter produit...',
      position: { top: '620px', left: '320px' },
      translateX: '0%',
      arrowPosition: 'left',
      highlightElement: { top: 580, left: 20, width: 240, height: 140 },
      showHand: true,
      handPosition: { top: 640, left: 140 },
    },
    {
      id: 'notifications',
      title: '🔔 Notifications',
      description: 'Cliquez sur la cloche pour voir vos alertes : nouvelles ventes, stock faible...',
      position: { top: '100px', left: width - 400 },
      translateX: '0%',
      arrowPosition: 'right',
      highlightElement: { top: 70, left: width - 250, width: 50, height: 50 },
      showHand: true,
      handPosition: { top: 85, left: width - 235 },
    },
    {
      id: 'search',
      title: '🔍 Recherche Globale',
      description: 'Trouvez rapidement un produit, une vente ou une facture en tapant ici.',
      position: { top: '100px', left: width - 600 },
      translateX: '0%',
      arrowPosition: 'top',
      highlightElement: { top: 70, left: width - 550, width: 200, height: 50 },
      showHand: true,
      handPosition: { top: 85, left: width - 460 },
    },
    {
      id: 'profile',
      title: '👤 Votre Profil',
      description: 'Accédez à vos paramètres, votre photo de profil et les options de compte.',
      position: { top: '100px', left: width - 200 },
      translateX: '0%',
      arrowPosition: 'right',
      highlightElement: { top: 70, left: width - 150, width: 120, height: 50 },
      showHand: true,
      handPosition: { top: 85, left: width - 100 },
    },
    {
      id: 'settings-menu',
      title: '⚙️ Paramètres',
      description: 'Personnalisez votre profil, ajoutez votre logo, configurez les notifications.',
      position: { top: '580px', left: '320px' },
      translateX: '0%',
      arrowPosition: 'left',
      highlightElement: { top: 540, left: 20, width: 240, height: 50 },
      showHand: true,
      handPosition: { top: 555, left: 140 },
    },
    {
      id: 'complete',
      title: '🎉 Félicitations !',
      description: 'Vous connaissez maintenant toutes les fonctionnalités ! Cliquez sur "Commencer" pour utiliser SmartBizz.',
      position: { top: '40%', left: '50%' },
      translateX: '-50%',
      arrowPosition: null,
      highlightElement: null,
      showHand: false,
    },
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = async () => {
    await markAsCompleted();
    setVisible(false);
    if (onComplete) onComplete();
  };

  const handleComplete = async () => {
    await markAsCompleted();
    setVisible(false);
    if (onComplete) onComplete();
  };

  const markAsCompleted = async () => {
    if (!userId) return;
    
    await SettingsService.updateBusinessInfo(userId, {
      hasCompletedInteractiveTour: true,
      tourCompletedAt: new Date().toISOString(),
    });
  };

  if (!visible) return null;

  const step = tourSteps[currentStep];
  const progress = ((currentStep + 1) / tourSteps.length) * 100;

  // Calculer la position safe pour la bulle
  const tooltipWidth = isMobile ? 320 : 380;
  const tooltipHeight = 280;
  const safePosition = getSafePosition(step.position, tooltipWidth, tooltipHeight);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleSkip}
    >
      {/* ScrollView pour permettre le scroll si nécessaire sur mobile */}
      <ScrollView 
        contentContainerStyle={{ minHeight: height }}
        scrollEnabled={isMobile}
        bounces={false}
      >
        {/* Overlay avec découpe - 4 rectangles qui laissent un trou */}
        <View style={[styles.overlayContainer, { minHeight: height }]}>
          {step.highlightElement && !isMobile ? (
            <>
              {/* Overlay TOP - Au-dessus de l'élément */}
              <View
                style={[
                  styles.overlaySection,
                  {
                    top: 0,
                    left: 0,
                    right: 0,
                    height: step.highlightElement.top,
                  },
                ]}
              />
              
              {/* Overlay BOTTOM - En dessous de l'élément */}
              <View
                style={[
                  styles.overlaySection,
                  {
                    top: step.highlightElement.top + step.highlightElement.height,
                    left: 0,
                    right: 0,
                    bottom: 0,
                  },
                ]}
              />
              
              {/* Overlay LEFT - À gauche de l'élément */}
              <View
                style={[
                  styles.overlaySection,
                  {
                    top: step.highlightElement.top,
                    left: 0,
                    width: step.highlightElement.left,
                    height: step.highlightElement.height,
                  },
                ]}
              />
              
              {/* Overlay RIGHT - À droite de l'élément */}
              <View
                style={[
                  styles.overlaySection,
                  {
                    top: step.highlightElement.top,
                    left: step.highlightElement.left + step.highlightElement.width,
                    right: 0,
                    height: step.highlightElement.height,
                  },
                ]}
              />
              
              {/* Bordure colorée autour de l'élément visible */}
              <View
                style={[
                  styles.spotlight,
                  {
                    top: step.highlightElement.top,
                    left: step.highlightElement.left,
                    width: step.highlightElement.width,
                    height: step.highlightElement.height,
                  },
                ]}
              />
            </>
          ) : (
            // Pas de spotlight, overlay complet
            <View style={styles.overlayFull} />
          )}

          {/* Main animée (pointeur) */}
          {step.showHand && step.handPosition && !isMobile && (
            <Animated.View
              style={[
                styles.handPointer,
                {
                  top: step.handPosition.top,
                  left: step.handPosition.left,
                  transform: [{ scale: pulseAnim }],
                },
              ]}
            >
              <Text style={styles.handEmoji}>👆</Text>
            </Animated.View>
          )}

          {/* Bulle de description avec flèche */}
          <View
            style={[
              styles.tooltip,
              {
                top: safePosition.top,
                left: safePosition.left,
                maxWidth: isMobile ? width - 40 : 380,
                minWidth: isMobile ? width - 40 : 320,
              },
            ]}
          >
          {/* Flèche directionnelle */}
          {step.arrowPosition && (
            <View style={[styles.arrow, styles[`arrow${step.arrowPosition.charAt(0).toUpperCase() + step.arrowPosition.slice(1)}`]]} />
          )}

          {/* Header */}
          <View style={styles.tooltipHeader}>
            <Text style={styles.stepCounter}>
              Étape {currentStep + 1} / {tourSteps.length}
            </Text>
            <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
              <Ionicons name="close" size={20} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Barre de progression */}
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>

          {/* Contenu */}
          <Text style={styles.title}>{step.title}</Text>
          <Text style={styles.description}>{step.description}</Text>

          {/* Navigation */}
          <View style={styles.navigation}>
            {currentStep > 0 && (
              <TouchableOpacity
                style={styles.navButton}
                onPress={handlePrevious}
              >
                <Ionicons name="arrow-back" size={18} color={theme.colors.textSecondary} />
                <Text style={styles.navButtonText}>Précédent</Text>
              </TouchableOpacity>
            )}

            <View style={styles.navSpacer} />

            <TouchableOpacity
              style={[
                styles.navButton,
                styles.navButtonPrimary,
                currentStep === tourSteps.length - 1 && styles.navButtonSuccess,
              ]}
              onPress={handleNext}
            >
              <Text style={styles.navButtonTextPrimary}>
                {currentStep === tourSteps.length - 1 ? 'Commencer 🚀' : 'Suivant'}
              </Text>
              <Ionicons
                name={currentStep === tourSteps.length - 1 ? 'checkmark' : 'arrow-forward'}
                size={18}
                color="#FFFFFF"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  // Container principal de l'overlay
  overlayContainer: {
    flex: 1,
    position: 'relative',
  },

  // Overlay complet (quand pas de spotlight)
  overlayFull: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
  },

  // Sections d'overlay (les 4 rectangles autour du spotlight)
  overlaySection: {
    position: 'absolute',
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    ...Platform.select({
      web: {
        pointerEvents: 'none', // Ne bloque pas les clics
      },
    }),
  },

  // Bordure du spotlight (autour de l'élément visible)
  spotlight: {
    position: 'absolute',
    backgroundColor: 'transparent',
    borderRadius: 12,
    borderWidth: 4,
    borderColor: theme.colors.primary,
    zIndex: 999,
    ...Platform.select({
      web: {
        pointerEvents: 'none',
        boxShadow: `0 0 30px 5px ${theme.colors.primary}, 
                    0 0 60px 15px rgba(91, 95, 237, 0.4)`,
      },
      ios: {
        shadowColor: theme.colors.primary,
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 1,
        shadowRadius: 20,
      },
      android: {
        elevation: 15,
      },
    }),
  },

  handPointer: {
    position: 'absolute',
    zIndex: 1000,
  },

  handEmoji: {
    fontSize: 40,
    ...Platform.select({
      web: {
        filter: 'drop-shadow(0 2px 8px rgba(0, 0, 0, 0.3))',
      },
    }),
  },

  tooltip: {
    position: 'absolute',
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: isMobile ? 16 : 20,
    zIndex: 999,
    ...Platform.select({
      web: {
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
      },
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
      },
      android: {
        elevation: 10,
      },
    }),
  },

  arrow: {
    position: 'absolute',
    width: 0,
    height: 0,
    borderStyle: 'solid',
  },

  arrowLeft: {
    left: -10,
    top: '50%',
    marginTop: -10,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: theme.colors.surface,
  },

  arrowRight: {
    right: -10,
    top: '50%',
    marginTop: -10,
    borderTopWidth: 10,
    borderTopColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: 'transparent',
    borderLeftWidth: 10,
    borderLeftColor: theme.colors.surface,
  },

  arrowTop: {
    top: -10,
    left: '50%',
    marginLeft: -10,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderBottomWidth: 10,
    borderBottomColor: theme.colors.surface,
  },

  arrowBottom: {
    bottom: -10,
    left: '50%',
    marginLeft: -10,
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: theme.colors.surface,
  },

  tooltipHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },

  stepCounter: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.primary,
  },

  skipButton: {
    padding: 4,
  },

  progressBar: {
    height: 3,
    backgroundColor: theme.colors.border,
    borderRadius: 2,
    marginBottom: 16,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
    borderRadius: 2,
  },

  title: {
    fontSize: isMobile ? 16 : 18,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },

  description: {
    fontSize: isMobile ? 13 : 14,
    lineHeight: isMobile ? 18 : 20,
    color: theme.colors.textSecondary,
    marginBottom: isMobile ? 16 : 20,
  },

  navigation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  navSpacer: {
    flex: 1,
  },

  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: isMobile ? 8 : 10,
    paddingHorizontal: isMobile ? 12 : 16,
    borderRadius: 8,
    gap: 6,
  },

  navButtonPrimary: {
    backgroundColor: theme.colors.primary,
  },

  navButtonSuccess: {
    backgroundColor: theme.colors.success,
  },

  navButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },

  navButtonTextPrimary: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default InteractiveTour;

