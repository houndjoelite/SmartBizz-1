import React, { useEffect, useMemo, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Switch, Alert, Platform } from 'react-native';
import { useSettings } from '../hooks/useSettings';
import { useProducts } from '../hooks/useProducts';
import ProductService from '../services/productService';
import theme from '../styles/theme';

const OnlineStoreScreen = ({ navigation }) => {
  const { settings, updateSettings, loading } = useSettings();
  const { allProducts, refreshProducts } = useProducts();

  const [storeName, setStoreName] = useState('');
  const [storeSlug, setStoreSlug] = useState('');
  const [currency, setCurrency] = useState('FCFA');
  const [themeName, setThemeName] = useState('modern');
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    const store = settings?.store || {};
    setStoreName(store.storeName || settings?.businessInfo?.businessName || 'Ma Boutique');
    setStoreSlug(store.storeSlug || (settings?.businessInfo?.businessName || 'ma-boutique')
      .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    setCurrency(store.currency || 'FCFA');
    setThemeName(store.theme || 'modern');
  }, [settings]);

  const publicUrl = useMemo(() => {
    if (!storeSlug) return '';
    return `https://smartbizz.store/${storeSlug}`;
  }, [storeSlug]);

  const handleSaveStore = async () => {
    const updates = {
      'store.storeName': storeName.trim(),
      'store.storeSlug': storeSlug.trim(),
      'store.currency': currency.trim(),
      'store.theme': themeName,
      'store.updatedAt': new Date().toISOString(),
    };
    const res = await updateSettings(updates);
    if (res.success) Alert.alert('Boutique', 'Paramètres enregistrés');
    else Alert.alert('Erreur', res.error || 'Enregistrement impossible');
  };

  const togglePublishProduct = async (productId, online) => {
    try {
      setPublishing(true);
      await ProductService.updateProduct(productId, { online });
      await refreshProducts();
    } catch (e) {
      Alert.alert('Erreur', 'Impossible de mettre à jour le produit');
    } finally {
      setPublishing(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Boutique en ligne</Text>
        <View style={{flexDirection:'row', gap:8}}>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleSaveStore}>
            <Text style={styles.primaryBtnText}>Enregistrer</Text>
          </TouchableOpacity>
          {publicUrl ? (
            <TouchableOpacity style={styles.linkBtn} onPress={() => {
              if (Platform.OS === 'web') window.open(publicUrl, '_blank');
              else Alert.alert('Lien', publicUrl);
            }}>
              <Text style={styles.linkBtnText}>Voir ma boutique</Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Paramètres généraux</Text>
          <Text style={styles.label}>Nom de la boutique</Text>
          <TextInput style={styles.input} value={storeName} onChangeText={setStoreName} placeholder="Ma Boutique" />

          <Text style={styles.label}>Identifiant (slug)</Text>
          <TextInput style={styles.input} value={storeSlug} onChangeText={setStoreSlug} placeholder="ma-boutique" />

          <Text style={styles.label}>Devise</Text>
          <TextInput style={styles.input} value={currency} onChangeText={setCurrency} placeholder="FCFA" />

          <Text style={styles.label}>Thème</Text>
          <View style={styles.themesRow}>
            {['modern','classic','dark'].map(t => (
              <TouchableOpacity key={t} style={[styles.themeBadge, themeName===t && styles.themeBadgeActive]} onPress={() => setThemeName(t)}>
                <Text style={[styles.themeBadgeText, themeName===t && styles.themeBadgeTextActive]}>{t}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {publicUrl ? (
            <View style={styles.urlRow}>
              <Text style={styles.urlLabel}>URL publique</Text>
              <Text style={styles.urlValue}>{publicUrl}</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Produits publiés</Text>
          {allProducts?.map(p => (
            <View key={p.id} style={styles.productRow}>
              <Text style={styles.productName}>{p.name}</Text>
              <View style={{flexDirection:'row', alignItems:'center', gap:8}}>
                <Text style={styles.productToggleLabel}>{p.online ? 'En ligne' : 'Hors ligne'}</Text>
                <Switch value={!!p.online} onValueChange={(v) => togglePublishProduct(p.id, v)} disabled={publishing} />
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex:1, backgroundColor: '#f9fafb' },
  header: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', padding:20 },
  headerTitle: { fontSize:18, fontWeight:'700', color: theme.colors.textPrimary },
  primaryBtn: { backgroundColor: theme.colors.primary, paddingVertical:10, paddingHorizontal:14, borderRadius:8 },
  primaryBtnText: { color:'#fff', fontWeight:'700' },
  linkBtn: { backgroundColor: theme.colors.surface, paddingVertical:10, paddingHorizontal:14, borderRadius:8, borderWidth:1, borderColor: theme.colors.border },
  linkBtnText: { color: theme.colors.textPrimary, fontWeight:'600' },
  content: { paddingHorizontal:20 },
  card: { backgroundColor:'#fff', borderRadius:12, padding:16, borderWidth:1, borderColor: theme.colors.border, marginBottom:16 },
  cardTitle: { fontSize:15, fontWeight:'700', color: theme.colors.textSecondary, marginBottom:12 },
  label: { fontSize:13, color: theme.colors.textSecondary, marginTop:8, marginBottom:6 },
  input: { backgroundColor: theme.colors.surfaceLight, borderWidth:1, borderColor: theme.colors.border, borderRadius:8, paddingHorizontal:12, paddingVertical:10 },
  themesRow: { flexDirection:'row', gap:8, marginTop:6 },
  themeBadge: { paddingVertical:8, paddingHorizontal:12, borderRadius:8, borderWidth:1, borderColor: theme.colors.border },
  themeBadgeActive: { backgroundColor: theme.colors.primary, borderColor: theme.colors.primary },
  themeBadgeText: { color: theme.colors.textSecondary, fontWeight:'600' },
  themeBadgeTextActive: { color:'#fff' },
  urlRow: { marginTop:12, padding:10, backgroundColor: theme.colors.surfaceLight, borderRadius:8, borderWidth:1, borderColor: theme.colors.border },
  urlLabel: { fontSize:12, color: theme.colors.textSecondary, marginBottom:4 },
  urlValue: { fontSize:13, color: theme.colors.textPrimary },
  productRow: { flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingVertical:10, borderBottomWidth:1, borderBottomColor: theme.colors.borderLight },
  productName: { fontSize:14, color: theme.colors.textPrimary, fontWeight:'600' },
  productToggleLabel: { fontSize:12, color: theme.colors.textSecondary },
});

export default OnlineStoreScreen;


