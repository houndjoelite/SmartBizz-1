import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import ProductService from '../services/productService';

const ProductModalAdvanced = ({ 
  visible, 
  onClose, 
  onSubmit, 
  product = null, 
  loading = false,
  categories = []
}) => {
  const isEdit = !!product;
  const fileInputRef = useRef(null);

  // Catégories par défaut + catégories utilisateur
  const allCategories = [
    ...ProductService.getDefaultCategories(),
    ...categories.filter(c => !ProductService.getDefaultCategories().includes(c))
  ];

  const units = ProductService.getUnits();

  const [formData, setFormData] = useState({
    name: '',
    category: allCategories[0],
    customCategory: '',
    description: '',
    purchasePrice: '',
    sellingPrice: '',
    quantity: '',
    unit: 'pièce',
    stockThreshold: '5',
    online: false,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [showCustomCategory, setShowCustomCategory] = useState(false);

  // Pré-remplir le formulaire si c'est une modification
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || allCategories[0],
        customCategory: '',
        description: product.description || '',
        purchasePrice: product.purchasePrice?.toString() || '',
        sellingPrice: product.sellingPrice?.toString() || '',
        quantity: product.quantity?.toString() || '',
        unit: product.unit || 'pièce',
        stockThreshold: product.stockThreshold?.toString() || '5',
        online: product.online || false,
      });
      setImagePreview(product.imageUrl || null);
    } else {
      resetForm();
    }
  }, [product, visible]);

  const resetForm = () => {
    setFormData({
      name: '',
      category: allCategories[0],
      customCategory: '',
      description: '',
      purchasePrice: '',
      sellingPrice: '',
      quantity: '',
      unit: 'pièce',
      stockThreshold: '5',
      online: false,
    });
    setImageFile(null);
    setImagePreview(null);
    setErrors({});
    setShowCustomCategory(false);
  };

  /**
   * Gérer la sélection d'image
   */
  const handleImageSelect = (event) => {
    if (Platform.OS === 'web') {
      const file = event.target.files[0];
      if (file) {
        // Vérifier la taille (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          Alert.alert('Erreur', 'L\'image ne doit pas dépasser 5MB');
          return;
        }

        // Vérifier le type
        if (!file.type.startsWith('image/')) {
          Alert.alert('Erreur', 'Le fichier doit être une image');
          return;
        }

        setImageFile(file);
        
        // Créer un aperçu
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  /**
   * Supprimer l'image
   */
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(isEdit ? product.imageUrl : null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Calculer la marge bénéficiaire
   */
  const calculateMargin = () => {
    const purchase = parseFloat(formData.purchasePrice) || 0;
    const selling = parseFloat(formData.sellingPrice) || 0;
    if (purchase === 0) return 0;
    return (((selling - purchase) / purchase) * 100).toFixed(1);
  };

  /**
   * Calculer le bénéfice unitaire
   */
  const calculateProfit = () => {
    const purchase = parseFloat(formData.purchasePrice) || 0;
    const selling = parseFloat(formData.sellingPrice) || 0;
    return selling - purchase;
  };

  /**
   * Valider le formulaire
   */
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du produit est requis';
    }

    if (formData.category === 'Autre' && !formData.customCategory.trim()) {
      newErrors.customCategory = 'Spécifiez la catégorie';
    }

    const purchasePrice = parseFloat(formData.purchasePrice);
    if (!purchasePrice || purchasePrice < 0) {
      newErrors.purchasePrice = 'Prix d\'achat invalide';
    }

    const sellingPrice = parseFloat(formData.sellingPrice);
    if (!sellingPrice || sellingPrice < 0) {
      newErrors.sellingPrice = 'Prix de vente invalide';
    }

    if (sellingPrice < purchasePrice) {
      newErrors.sellingPrice = 'Le prix de vente doit être ≥ prix d\'achat';
    }

    const quantity = parseInt(formData.quantity);
    if (quantity === undefined || quantity < 0) {
      newErrors.quantity = 'Quantité invalide';
    }

    const threshold = parseInt(formData.stockThreshold);
    if (!threshold || threshold < 0) {
      newErrors.stockThreshold = 'Seuil invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Soumettre le formulaire
   */
  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    const finalCategory = formData.category === 'Autre' && formData.customCategory.trim()
      ? formData.customCategory.trim()
      : formData.category;

    const productData = {
      name: formData.name.trim(),
      category: finalCategory,
      description: formData.description.trim(),
      purchasePrice: parseFloat(formData.purchasePrice),
      sellingPrice: parseFloat(formData.sellingPrice),
      quantity: parseInt(formData.quantity),
      unit: formData.unit,
      stockThreshold: parseInt(formData.stockThreshold),
      online: formData.online,
      imageFile: imageFile,
    };

    onSubmit(productData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const margin = calculateMargin();
  const profit = calculateProfit();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {isEdit ? 'Modifier le produit' : 'Nouveau produit'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Contenu */}
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Upload d'image */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Photo du produit</Text>
              
              {imagePreview ? (
                <View style={styles.imagePreviewContainer}>
                  <Image source={{ uri: imagePreview }} style={styles.imagePreview} />
                  <TouchableOpacity style={styles.removeImageButton} onPress={handleRemoveImage}>
                    <Text style={styles.removeImageText}>✕ Supprimer</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity 
                  style={styles.uploadButton}
                  onPress={() => fileInputRef.current?.click()}
                >
                  <Text style={styles.uploadIcon}>📷</Text>
                  <Text style={styles.uploadText}>Ajouter une photo</Text>
                  <Text style={styles.uploadHint}>Max 5MB</Text>
                </TouchableOpacity>
              )}

              {Platform.OS === 'web' && (
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  style={{ display: 'none' }}
                />
              )}
            </View>

            {/* Nom du produit */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Nom du produit <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                placeholder="Ex: Coca-Cola 1.5L"
                value={formData.name}
                onChangeText={(text) => setFormData({ ...formData, name: text })}
              />
              {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
            </View>

            {/* Catégorie */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Catégorie <Text style={styles.required}>*</Text>
              </Text>
              <View style={styles.categoriesGrid}>
                {allCategories.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryChip,
                      formData.category === cat && styles.categoryChipSelected
                    ]}
                    onPress={() => {
                      setFormData({ ...formData, category: cat });
                      setShowCustomCategory(cat === 'Autre');
                    }}
                  >
                    <Text style={[
                      styles.categoryChipText,
                      formData.category === cat && styles.categoryChipTextSelected
                    ]}>
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {showCustomCategory && (
                <TextInput
                  style={[styles.input, styles.inputMarginTop, errors.customCategory && styles.inputError]}
                  placeholder="Spécifiez la catégorie"
                  value={formData.customCategory}
                  onChangeText={(text) => setFormData({ ...formData, customCategory: text })}
                />
              )}
              {errors.customCategory && <Text style={styles.errorText}>{errors.customCategory}</Text>}
            </View>

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (optionnel)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description courte du produit..."
                multiline
                numberOfLines={3}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
              />
            </View>

            {/* Prix */}
            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>
                  Prix d'achat <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.purchasePrice && styles.inputError]}
                  placeholder="0"
                  keyboardType="numeric"
                  value={formData.purchasePrice}
                  onChangeText={(text) => setFormData({ ...formData, purchasePrice: text })}
                />
                {errors.purchasePrice && <Text style={styles.errorText}>{errors.purchasePrice}</Text>}
              </View>

              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>
                  Prix de vente <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.sellingPrice && styles.inputError]}
                  placeholder="0"
                  keyboardType="numeric"
                  value={formData.sellingPrice}
                  onChangeText={(text) => setFormData({ ...formData, sellingPrice: text })}
                />
                {errors.sellingPrice && <Text style={styles.errorText}>{errors.sellingPrice}</Text>}
              </View>
            </View>

            {/* Indicateurs de marge */}
            {formData.purchasePrice && formData.sellingPrice && (
              <View style={styles.marginIndicator}>
                <View style={styles.marginItem}>
                  <Text style={styles.marginLabel}>Bénéfice unitaire:</Text>
                  <Text style={[styles.marginValue, profit >= 0 ? styles.profitPositive : styles.profitNegative]}>
                    {profit >= 0 ? '+' : ''}{profit.toFixed(0)} FCFA
                  </Text>
                </View>
                <View style={styles.marginItem}>
                  <Text style={styles.marginLabel}>Marge:</Text>
                  <Text style={[styles.marginValue, margin >= 0 ? styles.profitPositive : styles.profitNegative]}>
                    {margin >= 0 ? '+' : ''}{margin}%
                  </Text>
                </View>
              </View>
            )}

            {/* Stock */}
            <View style={styles.formRow}>
              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>
                  Quantité <Text style={styles.required}>*</Text>
                </Text>
                <TextInput
                  style={[styles.input, errors.quantity && styles.inputError]}
                  placeholder="0"
                  keyboardType="numeric"
                  value={formData.quantity}
                  onChangeText={(text) => setFormData({ ...formData, quantity: text })}
                />
                {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
              </View>

              <View style={styles.formGroupHalf}>
                <Text style={styles.label}>Unité</Text>
                <View style={styles.unitSelector}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {units.slice(0, 5).map((unit) => (
                      <TouchableOpacity
                        key={unit}
                        style={[
                          styles.unitChip,
                          formData.unit === unit && styles.unitChipSelected
                        ]}
                        onPress={() => setFormData({ ...formData, unit: unit })}
                      >
                        <Text style={[
                          styles.unitChipText,
                          formData.unit === unit && styles.unitChipTextSelected
                        ]}>
                          {unit}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>

            {/* Seuil d'alerte */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Seuil d'alerte stock <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.stockThreshold && styles.inputError]}
                placeholder="5"
                keyboardType="numeric"
                value={formData.stockThreshold}
                onChangeText={(text) => setFormData({ ...formData, stockThreshold: text })}
              />
              <Text style={styles.helpText}>
                Vous serez alerté quand le stock atteint ce seuil
              </Text>
              {errors.stockThreshold && <Text style={styles.errorText}>{errors.stockThreshold}</Text>}
            </View>

            {/* Visible en ligne */}
            <TouchableOpacity
              style={styles.switchContainer}
              onPress={() => setFormData({ ...formData, online: !formData.online })}
            >
              <View style={styles.switchLeft}>
                <Text style={styles.switchLabel}>🌐 Visible sur la boutique en ligne</Text>
                <Text style={styles.switchHint}>
                  Les clients pourront voir ce produit sur votre site web
                </Text>
              </View>
              <View style={[styles.switch, formData.online && styles.switchActive]}>
                <View style={[styles.switchThumb, formData.online && styles.switchThumbActive]} />
              </View>
            </TouchableOpacity>
          </ScrollView>

          {/* Footer */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={handleClose}
              disabled={loading}
            >
              <Text style={styles.buttonSecondaryText}>Annuler</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.buttonPrimary, loading && styles.buttonDisabled]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={styles.buttonPrimaryText}>
                  {isEdit ? 'Mettre à jour' : 'Ajouter le produit'}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '100%',
    maxWidth: 700,
    maxHeight: '95%',
    ...Platform.select({
      web: {
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: '#6b7280',
  },
  modalContent: {
    padding: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  formRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  formGroupHalf: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#ef4444',
  },
  input: {
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#111',
  },
  inputError: {
    borderColor: '#ef4444',
    borderWidth: 2,
  },
  inputMarginTop: {
    marginTop: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  helpText: {
    color: '#6b7280',
    fontSize: 12,
    marginTop: 4,
    fontStyle: 'italic',
  },
  // Upload d'image
  imagePreviewContainer: {
    position: 'relative',
    alignItems: 'center',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  removeImageText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  uploadButton: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    borderStyle: 'dashed',
    padding: 32,
    alignItems: 'center',
  },
  uploadIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  uploadText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  uploadHint: {
    fontSize: 12,
    color: '#9ca3af',
  },
  // Catégories
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  categoryChipSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  categoryChipTextSelected: {
    color: '#fff',
  },
  // Unités
  unitSelector: {
    marginTop: 8,
  },
  unitChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginRight: 8,
  },
  unitChipSelected: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  unitChipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  unitChipTextSelected: {
    color: '#fff',
  },
  // Indicateurs de marge
  marginIndicator: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  marginItem: {
    flex: 1,
  },
  marginLabel: {
    fontSize: 12,
    color: '#6b7280',
    marginBottom: 4,
  },
  marginValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  profitPositive: {
    color: '#10b981',
  },
  profitNegative: {
    color: '#ef4444',
  },
  // Switch
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  switchLeft: {
    flex: 1,
    marginRight: 12,
  },
  switchLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  switchHint: {
    fontSize: 12,
    color: '#6b7280',
  },
  switch: {
    width: 52,
    height: 28,
    backgroundColor: '#d1d5db',
    borderRadius: 14,
    justifyContent: 'center',
    padding: 2,
  },
  switchActive: {
    backgroundColor: '#10b981',
  },
  switchThumb: {
    width: 24,
    height: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    ...Platform.select({
      web: {
        transition: 'transform 0.2s',
      },
    }),
  },
  switchThumbActive: {
    transform: [{ translateX: 24 }],
  },
  // Footer
  modalFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
  },
  buttonPrimaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  buttonSecondaryText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '500',
  },
  buttonDisabled: {
    backgroundColor: '#9ca3af',
  },
});

export default ProductModalAdvanced;


