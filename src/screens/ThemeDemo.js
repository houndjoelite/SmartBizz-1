import React from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  StyleSheet, 
  TouchableOpacity,
  Platform 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../styles/theme';
import { 
  ArchitectUIStatCard, 
  ArchitectUICard, 
  ArchitectUISectionHeader,
  ArchitectUIBadge 
} from '../components/ArchitectUICard';

/**
 * Page de Démonstration du Thème ArchitectUI
 * Affiche tous les éléments de design : couleurs, typographie, composants
 */
export default function ThemeDemo() {
  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thème ArchitectUI</Text>
        <Text style={styles.headerSubtitle}>
          Design moderne et professionnel
        </Text>
      </View>

      {/* Palette de Couleurs */}
      <ArchitectUISectionHeader 
        title="Palette de Couleurs"
        subtitle="Couleurs principales du thème"
      />

      <View style={styles.colorGrid}>
        <ColorBox 
          title="Primary" 
          color={theme.colors.primary} 
          code="#5B5FED"
        />
        <ColorBox 
          title="Success" 
          color={theme.colors.success} 
          code="#00C48C"
        />
        <ColorBox 
          title="Danger" 
          color={theme.colors.danger} 
          code="#F85C7F"
        />
        <ColorBox 
          title="Warning" 
          color={theme.colors.warning} 
          code="#FDB022"
        />
      </View>

      {/* Cartes de Statistiques */}
      <ArchitectUISectionHeader 
        title="Cartes de Statistiques"
        subtitle="Style ArchitectUI avec icônes colorées"
      />

      <View style={styles.statsGrid}>
        <ArchitectUIStatCard
          title="Dépôts en espèces"
          value="1,7 M"
          icon="cash-outline"
          iconColor={theme.colors.iconYellow}
          percentage={-54.1}
        />
        
        <ArchitectUIStatCard
          title="Dividendes investis"
          value="9M"
          icon="trending-up-outline"
          iconColor={theme.colors.iconPink}
          subtitle="Taux de croissance: ↗ 14,1 %"
        />
        
        <ArchitectUIStatCard
          title="Gains en capital"
          value="563 $"
          icon="business-outline"
          iconColor={theme.colors.iconGreen}
          percentage={7.35}
        />
        
        <ArchitectUIStatCard
          title="Revenus totaux"
          value="24,8K"
          icon="wallet-outline"
          iconColor={theme.colors.iconBlue}
          percentage={12.5}
        />
      </View>

      {/* Typographie */}
      <ArchitectUISectionHeader 
        title="Typographie"
        subtitle="Hiérarchie des textes"
      />

      <ArchitectUICard>
        <Text style={styles.typoH1}>Titre Principal (32px)</Text>
        <Text style={styles.typoH2}>Sous-titre (26px)</Text>
        <Text style={styles.typoH3}>Titre de Section (22px)</Text>
        <Text style={styles.typoBody}>
          Texte normal (15px) - Lorem ipsum dolor sit amet, consectetur 
          adipiscing elit. Vivamus lacinia odio vitae vestibulum.
        </Text>
        <Text style={styles.typoSmall}>
          Petit texte (13px) - Informations secondaires
        </Text>
      </ArchitectUICard>

      {/* Boutons */}
      <ArchitectUISectionHeader 
        title="Boutons"
        subtitle="Différentes variantes"
      />

      <ArchitectUICard>
        <TouchableOpacity style={styles.buttonPrimary}>
          <Text style={styles.buttonPrimaryText}>Bouton Principal</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSecondary}>
          <Text style={styles.buttonSecondaryText}>Bouton Secondaire</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonSuccess}>
          <Ionicons name="checkmark-circle" size={20} color="white" />
          <Text style={styles.buttonSuccessText}>Bouton Succès</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.buttonOutline}>
          <Text style={styles.buttonOutlineText}>Bouton Outline</Text>
        </TouchableOpacity>
      </ArchitectUICard>

      {/* Badges */}
      <ArchitectUISectionHeader 
        title="Badges"
        subtitle="Indicateurs et étiquettes"
      />

      <ArchitectUICard>
        <View style={styles.badgeRow}>
          <ArchitectUIBadge text="Primary" color="primary" />
          <ArchitectUIBadge text="Success" color="success" />
          <ArchitectUIBadge text="Danger" color="danger" />
          <ArchitectUIBadge text="Warning" color="warning" />
        </View>
        
        <View style={styles.badgeRow}>
          <ArchitectUIBadge text="Small" color="primary" small />
          <ArchitectUIBadge text="Small" color="success" small />
          <ArchitectUIBadge text="Small" color="danger" small />
        </View>
      </ArchitectUICard>

      {/* Icônes avec Background */}
      <ArchitectUISectionHeader 
        title="Icônes"
        subtitle="Icônes avec background coloré"
      />

      <ArchitectUICard>
        <View style={styles.iconRow}>
          <IconWithBackground 
            name="wallet-outline" 
            color={theme.colors.iconBlue} 
          />
          <IconWithBackground 
            name="trending-up-outline" 
            color={theme.colors.iconGreen} 
          />
          <IconWithBackground 
            name="alert-circle-outline" 
            color={theme.colors.iconPink} 
          />
          <IconWithBackground 
            name="star-outline" 
            color={theme.colors.iconYellow} 
          />
        </View>
      </ArchitectUICard>

      {/* Espacements */}
      <ArchitectUISectionHeader 
        title="Espacements"
        subtitle="Système d'espacement cohérent"
      />

      <ArchitectUICard>
        <View style={styles.spacingExample}>
          <View style={[styles.spacingBox, { width: theme.spacing.xs }]}>
            <Text style={styles.spacingLabel}>XS (4)</Text>
          </View>
          <View style={[styles.spacingBox, { width: theme.spacing.sm }]}>
            <Text style={styles.spacingLabel}>SM (8)</Text>
          </View>
          <View style={[styles.spacingBox, { width: theme.spacing.md }]}>
            <Text style={styles.spacingLabel}>MD (12)</Text>
          </View>
          <View style={[styles.spacingBox, { width: theme.spacing.lg }]}>
            <Text style={styles.spacingLabel}>LG (16)</Text>
          </View>
          <View style={[styles.spacingBox, { width: theme.spacing.xl }]}>
            <Text style={styles.spacingLabel}>XL (20)</Text>
          </View>
        </View>
      </ArchitectUICard>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

// Composant Box de Couleur
const ColorBox = ({ title, color, code }) => (
  <View style={styles.colorBox}>
    <View style={[styles.colorSwatch, { backgroundColor: color }]} />
    <Text style={styles.colorTitle}>{title}</Text>
    <Text style={styles.colorCode}>{code}</Text>
  </View>
);

// Composant Icône avec Background
const IconWithBackground = ({ name, color }) => (
  <View style={[
    styles.iconBackground,
    { backgroundColor: color + '20' }
  ]}>
    <Ionicons name={name} size={24} color={color} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  contentContainer: {
    padding: theme.spacing.lg,
    paddingTop: Platform.OS === 'web' ? theme.spacing.lg : 60,
  },

  // Header
  header: {
    marginBottom: theme.spacing['3xl'],
  },

  headerTitle: {
    fontSize: theme.fonts.sizes['4xl'],
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.sm,
  },

  headerSubtitle: {
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.textSecondary,
  },

  // Grille de Couleurs
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing['3xl'],
    gap: theme.spacing.md,
  },

  colorBox: {
    width: Platform.OS === 'web' ? 'calc(25% - 12px)' : '48%',
    minWidth: 150,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
  },

  colorSwatch: {
    width: 60,
    height: 60,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },

  colorTitle: {
    fontSize: theme.fonts.sizes.base,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },

  colorCode: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textTertiary,
    fontFamily: Platform.OS === 'web' ? 'monospace' : 'Courier',
  },

  // Grille de Stats
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.md,
    marginBottom: theme.spacing['3xl'],
  },

  // Typographie
  typoH1: {
    fontSize: theme.fonts.sizes['3xl'],
    fontWeight: theme.fonts.weights.bold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },

  typoH2: {
    fontSize: theme.fonts.sizes['2xl'],
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },

  typoH3: {
    fontSize: theme.fonts.sizes.xl,
    fontWeight: theme.fonts.weights.semibold,
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.md,
  },

  typoBody: {
    fontSize: theme.fonts.sizes.base,
    color: theme.colors.textSecondary,
    lineHeight: theme.fonts.sizes.base * theme.fonts.lineHeights.relaxed,
    marginBottom: theme.spacing.md,
  },

  typoSmall: {
    fontSize: theme.fonts.sizes.sm,
    color: theme.colors.textTertiary,
  },

  // Boutons
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  buttonPrimaryText: {
    color: theme.colors.textInverse,
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.semibold,
  },

  buttonSecondary: {
    backgroundColor: theme.colors.secondary,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },

  buttonSecondaryText: {
    color: theme.colors.textInverse,
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.semibold,
  },

  buttonSuccess: {
    backgroundColor: theme.colors.success,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },

  buttonSuccessText: {
    color: theme.colors.textInverse,
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.semibold,
  },

  buttonOutline: {
    backgroundColor: 'transparent',
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.primary,
    alignItems: 'center',
  },

  buttonOutlineText: {
    color: theme.colors.primary,
    fontSize: theme.fonts.sizes.md,
    fontWeight: theme.fonts.weights.semibold,
  },

  // Badges
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },

  // Icônes
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  iconBackground: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Espacements
  spacingExample: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: theme.spacing.sm,
  },

  spacingBox: {
    backgroundColor: theme.colors.primary,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },

  spacingLabel: {
    fontSize: theme.fonts.sizes.xs,
    color: theme.colors.textInverse,
    fontWeight: theme.fonts.weights.semibold,
  },
});


