import React, { useState, useEffect } from 'react';
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
} from 'react-native';

const CATEGORIES = [
  'Alimentation',
  'Boissons',
  'Électronique',
  'Vêtements',
  'Cosmétiques',
  'Fournitures',
  'Accessoires',
  'Autre',
];

const ProductModal = ({ visible, onClose, onSubmit, product = null, loading = false }) => {
  const isEdit = !!product;
  
  const [formData, setFormData] = useState({
    name: '',
    category: CATEGORIES[0],
    purchasePrice: '',
    sellingPrice: '',
    quantity: '',
    description: '',
  });

  const [errors, setErrors] = useState({});

  // Pré-remplir le formulaire si c'est une modification
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || '',
        category: product.category || CATEGORIES[0],
        purchasePrice: product.purchasePrice?.toString() || '',
        sellingPrice: product.sellingPrice?.toString() || '',
        quantity: product.quantity?.toString() || '',
        description: product.description || '',
      });
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setFormData({
      name: '',
      category: CATEGORIES[0],
      purchasePrice: '',
      sellingPrice: '',
      quantity: '',
      description: '',
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Le nom du produit est requis';
    }

    if (!formData.sellingPrice || parseFloat(formData.sellingPrice) < 0) {
      newErrors.sellingPrice = 'Le prix de vente doit être un nombre positif';
    }

    if (!formData.quantity || parseInt(formData.quantity) < 0) {
      newErrors.quantity = 'La quantité doit être un nombre positif';
    }

    if (formData.purchasePrice && parseFloat(formData.purchasePrice) < 0) {
      newErrors.purchasePrice = 'Le prix d\'achat doit être positif';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    const productData = {
      name: formData.name.trim(),
      category: formData.category,
      purchasePrice: parseFloat(formData.purchasePrice) || 0,
      sellingPrice: parseFloat(formData.sellingPrice),
      quantity: parseInt(formData.quantity),
      description: formData.description.trim(),
    };

    onSubmit(productData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

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
              {isEdit ? 'Modifier le produit' : 'Ajouter un produit'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Formulaire */}
          <ScrollView 
            style={styles.modalContent}
            showsVerticalScrollIndicator={true}
          >
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
              <View style={styles.categoryContainer}>
                {CATEGORIES.map((cat) => (
                  <TouchableOpacity
                    key={cat}
                    style={[
                      styles.categoryButton,
                      formData.category === cat && styles.categoryButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, category: cat })}
                  >
                    <Text
                      style={[
                        styles.categoryButtonText,
                        formData.category === cat && styles.categoryButtonTextActive,
                      ]}
                    >
                      {cat}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Prix d'achat */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Prix d'achat (FCFA)</Text>
              <TextInput
                style={[styles.input, errors.purchasePrice && styles.inputError]}
                placeholder="0"
                keyboardType="numeric"
                value={formData.purchasePrice}
                onChangeText={(text) => setFormData({ ...formData, purchasePrice: text })}
              />
              {errors.purchasePrice && (
                <Text style={styles.errorText}>{errors.purchasePrice}</Text>
              )}
            </View>

            {/* Prix de vente */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Prix de vente (FCFA) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.sellingPrice && styles.inputError]}
                placeholder="0"
                keyboardType="numeric"
                value={formData.sellingPrice}
                onChangeText={(text) => setFormData({ ...formData, sellingPrice: text })}
              />
              {errors.sellingPrice && (
                <Text style={styles.errorText}>{errors.sellingPrice}</Text>
              )}
            </View>

            {/* Quantité */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Quantité en stock <Text style={styles.required}>*</Text>
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

            {/* Description */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Description (optionnel)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Description du produit..."
                multiline
                numberOfLines={4}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
              />
            </View>
          </ScrollView>

          {/* Footer avec boutons */}
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
                  {isEdit ? 'Modifier' : 'Ajouter'}
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
    maxWidth: 600,
    maxHeight: '90%',
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
    maxHeight: 500,
  },
  formGroup: {
    marginBottom: 20,
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
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    marginRight: 8,
    marginBottom: 8,
  },
  categoryButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  categoryButtonText: {
    fontSize: 14,
    color: '#6b7280',
  },
  categoryButtonTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
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
    minWidth: 100,
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

export default ProductModal;


