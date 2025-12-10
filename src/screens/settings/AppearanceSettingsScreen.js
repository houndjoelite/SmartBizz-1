import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSettings } from '../../hooks/useSettings';
import { Ionicons } from '@expo/vector-icons';

const AppearanceSettingsScreen = ({ navigation }) => {
  const { settings, updateSettings, loading } = useSettings();
  
  const [theme, setTheme] = useState('light');
  const [primaryColor, setPrimaryColor] = useState('#3b82f6');
  const [submitting, setSubmitting] = useState(false);

  const themes = [
    { value: 'light', label: 'Clair', icon: '☀️' },
    { value: 'dark', label: 'Sombre', icon: '🌙' },
    { value: 'auto', label: 'Automatique', icon: '⚡' },
  ];

  const colors = [
    { value: '#3b82f6', label: 'Bleu' },
    { value: '#10b981', label: 'Vert' },
    { value: '#f59e0b', label: 'Orange' },
    { value: '#ef4444', label: 'Rouge' },
    { value: '#8b5cf6', label: 'Violet' },
    { value: '#ec4899', label: 'Rose' },
  ];

  useEffect(() => {
    if (settings?.appearance) {
      setTheme(settings.appearance.theme || 'light');
      setPrimaryColor(settings.appearance.primaryColor || '#3b82f6');
    }
  }, [settings]);

  const handleSave = async () => {
    setSubmitting(true);

    const result = await updateSettings({
      'appearance.theme': theme,
      'appearance.primaryColor': primaryColor,
    });

    setSubmitting(false);

    if (result.success) {
      Alert.alert('Succès', 'Apparence mise à jour avec succès');
    } else {
      Alert.alert('Erreur', result.error);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Ancien header - Commenté
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
          <Text style={styles.backButton}>← Retour</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Apparence</Text>
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
        <Text style={styles.newHeaderTitle}>Apparence</Text>
      </View>

      <ScrollView style={styles.content}>
        {/* Thème */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Thème</Text>
          <View style={styles.themeContainer}>
            {themes.map((t) => (
              <TouchableOpacity
                key={t.value}
                style={[
                  styles.themeOption,
                  theme === t.value && styles.themeOptionSelected,
                ]}
                onPress={() => setTheme(t.value)}
              >
                <Text style={styles.themeIcon}>{t.icon}</Text>
                <Text
                  style={[
                    styles.themeLabel,
                    theme === t.value && styles.themeLabelSelected,
                  ]}
                >
                  {t.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Couleur principale */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Couleur principale</Text>
          <View style={styles.colorContainer}>
            {colors.map((c) => (
              <TouchableOpacity
                key={c.value}
                style={[
                  styles.colorOption,
                  { backgroundColor: c.value },
                  primaryColor === c.value && styles.colorOptionSelected,
                ]}
                onPress={() => setPrimaryColor(c.value)}
              >
                {primaryColor === c.value && (
                  <Text style={styles.checkIcon}>✓</Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Prévisualisation */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Prévisualisation</Text>
          <View style={[styles.previewCard, { borderTopColor: primaryColor }]}>
            <Text style={styles.previewTitle}>Exemple de carte</Text>
            <Text style={styles.previewText}>
              Voici à quoi ressemblera l'application avec votre thème
            </Text>
            <TouchableOpacity
              style={[styles.previewButton, { backgroundColor: primaryColor }]}
            >
              <Text style={styles.previewButtonText}>Bouton d'action</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, submitting && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>Enregistrer</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
  backButton: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '500',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
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
  content: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 16,
  },
  themeContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  themeOption: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  themeOptionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  themeIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  themeLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  themeLabelSelected: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  colorContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  colorOption: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorOptionSelected: {
    borderWidth: 4,
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  checkIcon: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
  },
  previewCard: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    borderTopWidth: 4,
  },
  previewTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  previewText: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
  },
  previewButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  previewButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 40,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default AppearanceSettingsScreen;


