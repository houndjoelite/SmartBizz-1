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

const SaleModal = ({ visible, onClose, onSubmit, product = null, loading = false }) => {
  const [formData, setFormData] = useState({
    quantity: '',
    unitPrice: '',
  });

  const [errors, setErrors] = useState({});

  // Pré-remplir avec les données du produit
  useEffect(() => {
    if (product) {
      setFormData({
        quantity: '1',
        unitPrice: product.sellingPrice?.toString() || '',
      });
    } else {
      resetForm();
    }
  }, [product]);

  const resetForm = () => {
    setFormData({
      quantity: '',
      unitPrice: '',
    });
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};

    const qty = parseInt(formData.quantity);
    if (!qty || qty <= 0) {
      newErrors.quantity = 'La quantité doit être supérieure à 0';
    }

    if (product && qty > product.quantity) {
      newErrors.quantity = `Stock insuffisant (disponible: ${product.quantity})`;
    }

    const price = parseFloat(formData.unitPrice);
    if (!price || price <= 0) {
      newErrors.unitPrice = 'Le prix doit être supérieur à 0';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) {
      Alert.alert('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    const saleData = {
      productId: product.id,
      quantity: parseInt(formData.quantity),
      unitPrice: parseFloat(formData.unitPrice),
    };

    onSubmit(saleData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const calculateTotal = () => {
    const qty = parseInt(formData.quantity) || 0;
    const price = parseFloat(formData.unitPrice) || 0;
    return (qty * price).toLocaleString('fr-FR');
  };

  if (!product) {
    return null;
  }

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
            <Text style={styles.modalTitle}>Enregistrer une vente</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Contenu */}
          <ScrollView style={styles.modalContent}>
            {/* Info produit */}
            <View style={styles.productInfo}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productCategory}>{product.category}</Text>
              <View style={styles.productStats}>
                <View style={styles.productStat}>
                  <Text style={styles.productStatLabel}>Stock disponible:</Text>
                  <Text style={[
                    styles.productStatValue,
                    product.quantity < 5 && styles.productStatValueWarning
                  ]}>
                    {product.quantity} unités
                  </Text>
                </View>
                <View style={styles.productStat}>
                  <Text style={styles.productStatLabel}>Prix de vente:</Text>
                  <Text style={styles.productStatValue}>
                    {product.sellingPrice.toLocaleString('fr-FR')} FCFA
                  </Text>
                </View>
              </View>
            </View>

            {/* Formulaire */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Quantité vendue <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.quantity && styles.inputError]}
                placeholder="Entrez la quantité"
                keyboardType="numeric"
                value={formData.quantity}
                onChangeText={(text) => setFormData({ ...formData, quantity: text })}
              />
              {errors.quantity && <Text style={styles.errorText}>{errors.quantity}</Text>}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Prix unitaire (FCFA) <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[styles.input, errors.unitPrice && styles.inputError]}
                placeholder="Prix de vente"
                keyboardType="numeric"
                value={formData.unitPrice}
                onChangeText={(text) => setFormData({ ...formData, unitPrice: text })}
              />
              {errors.unitPrice && <Text style={styles.errorText}>{errors.unitPrice}</Text>}
            </View>

            {/* Total */}
            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>Total:</Text>
              <Text style={styles.totalValue}>{calculateTotal()} FCFA</Text>
            </View>
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
                <Text style={styles.buttonPrimaryText}>Valider la vente</Text>
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
    maxWidth: 500,
    maxHeight: '80%',
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
  productInfo: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  productCategory: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  productStats: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 12,
  },
  productStat: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  productStatLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  productStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  productStatValueWarning: {
    color: '#f59e0b',
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
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  totalContainer: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e40af',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e40af',
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
    backgroundColor: '#10b981',
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

export default SaleModal;


