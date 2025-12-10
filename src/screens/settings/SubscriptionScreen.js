import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSettings } from '../../hooks/useSettings';
import { Ionicons } from '@expo/vector-icons';

const SubscriptionScreen = ({ navigation }) => {
  const { settings, updateSettings } = useSettings();
  const [selectedPlan, setSelectedPlan] = useState(settings?.subscription?.plan || 'free');

  const plans = [
    {
      id: 'free',
      name: 'Gratuit',
      price: '0 FCFA',
      period: 'par mois',
      icon: '🆓',
      color: '#6b7280',
      features: [
        '✅ 50 produits maximum',
        '✅ Ventes illimitées',
        '✅ 1 utilisateur',
        '✅ Statistiques de base',
        '✅ Sauvegarde manuelle',
        '❌ Multi-boutiques',
        '❌ Gestion employés',
        '❌ Intégrations avancées',
      ],
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '5,000 FCFA',
      period: 'par mois',
      icon: '👑',
      color: '#f59e0b',
      popular: true,
      features: [
        '✅ Produits illimités',
        '✅ Ventes illimitées',
        '✅ Jusqu\'à 5 utilisateurs',
        '✅ Statistiques avancées',
        '✅ Sauvegarde automatique',
        '✅ Multi-boutiques (3 max)',
        '✅ Gestion employés',
        '✅ Support prioritaire',
      ],
    },
    {
      id: 'enterprise',
      name: 'Entreprise',
      price: '15,000 FCFA',
      period: 'par mois',
      icon: '🚀',
      color: '#8b5cf6',
      features: [
        '✅ Tout illimité',
        '✅ Utilisateurs illimités',
        '✅ Boutiques illimitées',
        '✅ API complète',
        '✅ Intégrations avancées',
        '✅ WhatsApp Business',
        '✅ Mobile Money API',
        '✅ Support dédié 24/7',
      ],
    },
  ];

  const handleUpgrade = async (planId) => {
    if (planId === 'free') {
      Alert.alert('Info', 'Vous êtes déjà sur le plan gratuit');
      return;
    }

    Alert.alert(
      'Passer à ' + plans.find(p => p.id === planId).name,
      'Cette fonctionnalité sera bientôt disponible. Contactez-nous pour plus d\'informations.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Contacter',
          onPress: () => {
            Alert.alert('Contact', 'Email: support@votreapp.com\nTéléphone: +225 XX XX XX XX XX');
          },
        },
      ]
    );
  };

  const currentPlan = plans.find(p => p.id === selectedPlan);

  return (
    <View style={styles.container}>
      {/* Ancien header - Commenté
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Abonnement</Text>
        <View style={{ width: 80 }} />
      </View>
      */}

      {/* Nouveau header visible */}
      <View style={styles.newHeader}>
        <TouchableOpacity 
          onPress={() => navigation.navigate('Settings')}
          style={styles.newBackButton}
        >
          <Ionicons name="chevron-back" size={18} color="#ffffff" />
          <Text style={styles.newBackButtonText}>Retour</Text>
        </TouchableOpacity>
        <Text style={styles.newHeaderTitle}>Abonnement</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Plan actuel */}
        <View style={styles.currentPlanCard}>
          <Text style={styles.currentPlanIcon}>{currentPlan?.icon}</Text>
          <Text style={styles.currentPlanTitle}>Plan Actuel</Text>
          <Text style={styles.currentPlanName}>{currentPlan?.name}</Text>
          <Text style={styles.currentPlanPrice}>{currentPlan?.price}</Text>
          <Text style={styles.currentPlanPeriod}>{currentPlan?.period}</Text>
        </View>

        {/* Plans disponibles */}
        <Text style={styles.sectionTitle}>Choisissez votre plan</Text>
        
        {plans.map((plan) => (
          <View
            key={plan.id}
            style={[
              styles.planCard,
              selectedPlan === plan.id && styles.planCardActive,
            ]}
          >
            {plan.popular && (
              <View style={styles.popularBadge}>
                <Text style={styles.popularText}>⭐ POPULAIRE</Text>
              </View>
            )}

            <View style={styles.planHeader}>
              <Text style={styles.planIcon}>{plan.icon}</Text>
              <Text style={styles.planName}>{plan.name}</Text>
            </View>

            <View style={styles.planPricing}>
              <Text style={[styles.planPrice, { color: plan.color }]}>
                {plan.price}
              </Text>
              <Text style={styles.planPeriod}>{plan.period}</Text>
            </View>

            <View style={styles.planFeatures}>
              {plan.features.map((feature, index) => (
                <Text key={index} style={styles.planFeature}>
                  {feature}
                </Text>
              ))}
            </View>

            {selectedPlan === plan.id ? (
              <View style={styles.currentBadge}>
                <Text style={styles.currentText}>✓ Plan actuel</Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.upgradeButton, { backgroundColor: plan.color }]}
                onPress={() => handleUpgrade(plan.id)}
              >
                <Text style={styles.upgradeButtonText}>
                  {plan.id === 'free' ? 'Rétrograder' : 'Passer à ' + plan.name}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        {/* FAQ */}
        <View style={styles.faqSection}>
          <Text style={styles.sectionTitle}>Questions Fréquentes</Text>
          
          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>💳 Comment payer ?</Text>
            <Text style={styles.faqAnswer}>
              Paiement par Mobile Money (Orange, MTN, Moov) ou virement bancaire.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>🔄 Puis-je changer de plan ?</Text>
            <Text style={styles.faqAnswer}>
              Oui, vous pouvez upgrader ou downgrader à tout moment.
            </Text>
          </View>

          <View style={styles.faqItem}>
            <Text style={styles.faqQuestion}>❌ Puis-je annuler ?</Text>
            <Text style={styles.faqAnswer}>
              Oui, sans engagement. Annulation possible à tout moment.
            </Text>
          </View>
        </View>

        {/* Support */}
        <View style={styles.supportCard}>
          <Text style={styles.supportIcon}>📧</Text>
          <Text style={styles.supportTitle}>Besoin d'aide ?</Text>
          <Text style={styles.supportText}>
            Notre équipe est là pour vous aider à choisir le bon plan
          </Text>
          <TouchableOpacity
            style={styles.contactButton}
            onPress={() => Alert.alert('Contact', 'support@votreapp.com')}
          >
            <Text style={styles.contactButtonText}>Nous contacter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  // Anciens styles header - Commentés
  /*
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: { fontSize: 16, color: '#3b82f6', fontWeight: '500' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
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
  content: { flex: 1, padding: 20 },
  currentPlanCard: {
    backgroundColor: '#3b82f6',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 24,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  currentPlanIcon: { fontSize: 48, marginBottom: 8 },
  currentPlanTitle: { fontSize: 14, color: '#bfdbfe', marginBottom: 4 },
  currentPlanName: { fontSize: 24, fontWeight: '700', color: '#fff', marginBottom: 8 },
  currentPlanPrice: { fontSize: 32, fontWeight: '700', color: '#fff' },
  currentPlanPeriod: { fontSize: 14, color: '#bfdbfe' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 16 },
  planCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    position: 'relative',
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  planCardActive: { borderColor: '#3b82f6', backgroundColor: '#eff6ff' },
  popularBadge: {
    position: 'absolute',
    top: -12,
    right: 20,
    backgroundColor: '#f59e0b',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularText: { fontSize: 11, fontWeight: '700', color: '#fff' },
  planHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  planIcon: { fontSize: 32, marginRight: 12 },
  planName: { fontSize: 22, fontWeight: '700', color: '#111' },
  planPricing: { marginBottom: 16 },
  planPrice: { fontSize: 28, fontWeight: '700', marginBottom: 4 },
  planPeriod: { fontSize: 14, color: '#6b7280' },
  planFeatures: { marginBottom: 16 },
  planFeature: { fontSize: 14, color: '#374151', marginBottom: 8, lineHeight: 20 },
  currentBadge: {
    backgroundColor: '#10b981',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  currentText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  upgradeButton: {
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  upgradeButtonText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  faqSection: { marginTop: 24, marginBottom: 24 },
  faqItem: { backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 12 },
  faqQuestion: { fontSize: 16, fontWeight: '600', color: '#111', marginBottom: 8 },
  faqAnswer: { fontSize: 14, color: '#6b7280', lineHeight: 20 },
  supportCard: {
    backgroundColor: '#eff6ff',
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 40,
  },
  supportIcon: { fontSize: 48, marginBottom: 12 },
  supportTitle: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 8 },
  supportText: { fontSize: 14, color: '#6b7280', textAlign: 'center', marginBottom: 16 },
  contactButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  contactButtonText: { fontSize: 14, fontWeight: '600', color: '#fff' },
});

export default SubscriptionScreen;


