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

const InvoiceModal = ({ 
  visible, 
  onClose, 
  onSubmit, 
  products = [], 
  loading = false,
  editMode = false,
  initialData = null
}) => {
  const [formData, setFormData] = useState({
    customerName: '',
    items: [],
    discount: '0',
    paymentMethod: 'Espèces',
    status: 'unpaid',
    notes: '',
  });

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('1');
  const [errors, setErrors] = useState({});

  // Initialiser le formulaire avec les données existantes en mode édition
  useEffect(() => {
    if (visible && editMode && initialData) {
      setFormData({
        customerName: initialData.customerName || '',
        items: initialData.items || [],
        discount: initialData.discount ? String(initialData.discount) : '0',
        paymentMethod: initialData.paymentMethod || 'Espèces',
        status: initialData.status || 'unpaid',
        notes: initialData.notes || '',
      });
    } else if (!visible) {
      resetForm();
    }
  }, [visible, editMode, initialData]);

  const resetForm = () => {
    setFormData({
      customerName: '',
      items: [],
      discount: '0',
      paymentMethod: 'Espèces',
      status: 'paid',
      notes: '',
    });
    setSelectedProduct(null);
    setQuantity('1');
    setErrors({});
  };

  /**
   * Ajouter un produit à la facture
   */
  const handleAddProduct = () => {
    if (!selectedProduct) {
      Alert.alert('Erreur', 'Veuillez sélectionner un produit');
      return;
    }

    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      Alert.alert('Erreur', 'Quantité invalide');
      return;
    }

    if (qty > selectedProduct.quantity) {
      Alert.alert('Erreur', `Stock insuffisant. Disponible: ${selectedProduct.quantity}`);
      return;
    }

    // Vérifier si le produit n'est pas déjà dans la liste
    const existingIndex = formData.items.findIndex(item => item.productId === selectedProduct.id);
    
    const newItem = {
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      quantity: qty,
      unitPrice: selectedProduct.sellingPrice,
      total: qty * selectedProduct.sellingPrice,
    };

    let newItems;
    if (existingIndex >= 0) {
      // Mettre à jour la quantité si le produit existe déjà
      newItems = [...formData.items];
      newItems[existingIndex] = newItem;
    } else {
      // Ajouter nouveau produit
      newItems = [...formData.items, newItem];
    }

    setFormData({ ...formData, items: newItems });
    setSelectedProduct(null);
    setQuantity('1');
  };

  /**
   * Supprimer un produit de la facture
   */
  const handleRemoveProduct = (index) => {
    const newItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: newItems });
  };

  /**
   * Calculer les totaux
   */
  const calculateTotals = () => {
    const subtotal = formData.items.reduce((sum, item) => sum + item.total, 0);
    const discount = parseFloat(formData.discount) || 0;
    const total = subtotal - discount;
    
    return { subtotal, discount, total };
  };

  /**
   * Valider et soumettre
   */
  const handleSubmit = () => {
    const newErrors = {};

    if (formData.items.length === 0) {
      newErrors.items = 'Ajoutez au moins un produit';
    }

    const { total } = calculateTotals();
    if (total < 0) {
      newErrors.discount = 'La remise ne peut pas dépasser le sous-total';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      Alert.alert('Erreur de validation', 'Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    onSubmit(formData);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const { subtotal, discount, total } = calculateTotals();
  const availableProducts = products.filter(p => p.quantity > 0);

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
              {editMode ? 'Modifier la facture' : 'Nouvelle facture'}
            </Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Contenu */}
          <ScrollView style={styles.modalContent}>
            {/* Nom du client */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nom du client (optionnel)</Text>
              <TextInput
                style={styles.input}
                placeholder="Ex: Jean Dupont"
                value={formData.customerName}
                onChangeText={(text) => setFormData({ ...formData, customerName: text })}
              />
            </View>

            {/* Sélection produits */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>
                Ajouter des produits <Text style={styles.required}>*</Text>
              </Text>
              
              {/* Dropdown produits */}
              <View style={styles.productSelector}>
                {availableProducts.length > 0 ? (
                  <>
                    <Text style={styles.productHint}>
                      👆 Cliquez sur un produit pour le sélectionner
                    </Text>
                    <ScrollView 
                      horizontal 
                      showsHorizontalScrollIndicator={false}
                      style={styles.productScroll}
                    >
                      {availableProducts.map((product) => (
                        <TouchableOpacity
                          key={product.id}
                          style={[
                            styles.productChip,
                            selectedProduct?.id === product.id && styles.productChipSelected
                          ]}
                          onPress={() => setSelectedProduct(product)}
                        >
                          <Text style={[
                            styles.productChipText,
                            selectedProduct?.id === product.id && styles.productChipTextSelected
                          ]}>
                            {product.name}
                          </Text>
                          <Text style={styles.productChipPrice}>
                            {product.sellingPrice.toLocaleString()} FCFA
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </ScrollView>

                    {selectedProduct && (
                      <View style={styles.quantityContainer}>
                        <TextInput
                          style={styles.quantityInput}
                          placeholder="Qté"
                          keyboardType="numeric"
                          value={quantity}
                          onChangeText={setQuantity}
                        />
                        <TouchableOpacity 
                          style={styles.addButton}
                          onPress={handleAddProduct}
                        >
                          <Text style={styles.addButtonText}>Ajouter</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  </>
                ) : (
                  <View style={styles.noProductsContainer}>
                    <Text style={styles.noProductsIcon}>📦</Text>
                    <Text style={styles.noProductsTitle}>Aucun produit disponible</Text>
                    <Text style={styles.noProductsText}>
                      Ajoutez d'abord des produits dans votre inventaire avec du stock disponible.
                    </Text>
                  </View>
                )}
              </View>

              {errors.items && <Text style={styles.errorText}>{errors.items}</Text>}
            </View>

            {/* Liste des produits ajoutés */}
            {formData.items.length > 0 && (
              <View style={styles.itemsList}>
                <Text style={styles.itemsListTitle}>Produits ajoutés ({formData.items.length})</Text>
                {formData.items.map((item, index) => (
                  <View key={index} style={styles.itemRow}>
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.productName}</Text>
                      <Text style={styles.itemDetails}>
                        {item.quantity} × {item.unitPrice.toLocaleString()} FCFA
                      </Text>
                    </View>
                    <View style={styles.itemActions}>
                      <Text style={styles.itemTotal}>
                        {item.total.toLocaleString()} FCFA
                      </Text>
                      <TouchableOpacity onPress={() => handleRemoveProduct(index)}>
                        <Text style={styles.removeButton}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Remise */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Remise (FCFA)</Text>
              <TextInput
                style={[styles.input, errors.discount && styles.inputError]}
                placeholder="0"
                keyboardType="numeric"
                value={formData.discount}
                onChangeText={(text) => setFormData({ ...formData, discount: text })}
              />
              {errors.discount && <Text style={styles.errorText}>{errors.discount}</Text>}
            </View>

            {/* Mode de paiement */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Mode de paiement</Text>
              <View style={styles.paymentMethods}>
                {['Espèces', 'Mobile Money', 'Transfert', 'Chèque'].map((method) => (
                  <TouchableOpacity
                    key={method}
                    style={[
                      styles.paymentChip,
                      formData.paymentMethod === method && styles.paymentChipSelected
                    ]}
                    onPress={() => setFormData({ ...formData, paymentMethod: method })}
                  >
                    <Text style={[
                      styles.paymentChipText,
                      formData.paymentMethod === method && styles.paymentChipTextSelected
                    ]}>
                      {method}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Statut */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Statut du paiement</Text>
              <View style={styles.statusButtons}>
                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.status === 'paid' && styles.statusButtonPaid
                  ]}
                  onPress={() => setFormData({ ...formData, status: 'paid' })}
                >
                  <Text style={[
                    styles.statusButtonText,
                    formData.status === 'paid' && styles.statusButtonTextActive
                  ]}>
                    Payé
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.statusButton,
                    formData.status === 'unpaid' && styles.statusButtonUnpaid
                  ]}
                  onPress={() => setFormData({ ...formData, status: 'unpaid' })}
                >
                  <Text style={[
                    styles.statusButtonText,
                    formData.status === 'unpaid' && styles.statusButtonTextActive
                  ]}>
                    Non payé
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Notes */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes (optionnel)</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Informations complémentaires..."
                multiline
                numberOfLines={3}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
              />
            </View>

            {/* Résumé des totaux */}
            <View style={styles.summaryCard}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Sous-total:</Text>
                <Text style={styles.summaryValue}>
                  {subtotal.toLocaleString('fr-FR')} FCFA
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Remise:</Text>
                <Text style={styles.summaryValue}>
                  - {discount.toLocaleString('fr-FR')} FCFA
                </Text>
              </View>
              <View style={[styles.summaryRow, styles.summaryRowTotal]}>
                <Text style={styles.summaryLabelTotal}>Total:</Text>
                <Text style={styles.summaryValueTotal}>
                  {total.toLocaleString('fr-FR')} FCFA
                </Text>
              </View>
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
            style={[styles.submitButton, loading && styles.disabledButton]}
            onPress={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitButtonText}>
                {editMode ? 'Mettre à jour' : 'Créer la facture'}
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
    height: 80,
    textAlignVertical: 'top',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    marginTop: 4,
  },
  productSelector: {
    marginTop: 8,
  },
  productHint: {
    fontSize: 12,
    color: '#6b7280',
    fontStyle: 'italic',
    marginBottom: 8,
    textAlign: 'center',
  },
  productScroll: {
    marginBottom: 12,
  },
  noProductsContainer: {
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#fbbf24',
  },
  noProductsIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  noProductsTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#92400e',
    marginBottom: 8,
    textAlign: 'center',
  },
  noProductsText: {
    fontSize: 13,
    color: '#78350f',
    textAlign: 'center',
    lineHeight: 20,
  },
  productChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f3f4f6',
    borderWidth: 2,
    borderColor: '#e5e7eb',
    marginRight: 8,
    minWidth: 120,
  },
  productChipSelected: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  productChipText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  productChipTextSelected: {
    color: '#3b82f6',
  },
  productChipPrice: {
    fontSize: 11,
    color: '#6b7280',
  },
  quantityContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  quantityInput: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  itemsList: {
    marginBottom: 20,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
  },
  itemsListTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  itemDetails: {
    fontSize: 12,
    color: '#6b7280',
  },
  itemActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  itemTotal: {
    fontSize: 14,
    fontWeight: '700',
    color: '#10b981',
  },
  removeButton: {
    fontSize: 18,
    color: '#ef4444',
    fontWeight: '600',
    paddingHorizontal: 8,
  },
  paymentMethods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  paymentChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f3f4f6',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  paymentChipSelected: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  paymentChipText: {
    fontSize: 13,
    color: '#374151',
    fontWeight: '500',
  },
  paymentChipTextSelected: {
    color: '#fff',
  },
  statusButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  statusButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  statusButtonPaid: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  statusButtonUnpaid: {
    backgroundColor: '#f59e0b',
    borderColor: '#f59e0b',
  },
  statusButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  statusButtonTextActive: {
    color: '#fff',
  },
  summaryCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryRowTotal: {
    borderTopWidth: 2,
    borderTopColor: '#3b82f6',
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 0,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  summaryLabelTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1e40af',
  },
  summaryValueTotal: {
    fontSize: 20,
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

export default InvoiceModal;

