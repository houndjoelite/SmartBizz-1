import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Modal,
  Dimensions,
} from 'react-native';
import { useProducts } from '../hooks/useProducts';
import { useClients } from '../hooks/useClients';
import { useSales } from '../hooks/useSales';
import InvoiceService from '../services/invoiceService';
import ClientService from '../services/clientService';

const QuickSaleScreen = ({ navigation }) => {
  const { width } = Dimensions.get('window');
  const isMobile = width < 768;
  const { products: allProducts, loading: productsLoading, refreshProducts } = useProducts();
  const { clients, addClient } = useClients();
  const { recordSale } = useSales();

  // États du formulaire
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [quantity, setQuantity] = useState('');
  const [selectedClient, setSelectedClient] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [paidAmount, setPaidAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // États des modals
  const [showProductModal, setShowProductModal] = useState(false);
  const [showClientModal, setShowClientModal] = useState(false);
  const [showNewClientModal, setShowNewClientModal] = useState(false);

  // Recherche
  const [productSearch, setProductSearch] = useState('');
  const [clientSearch, setClientSearch] = useState('');

  // Nouveau client
  const [newClientName, setNewClientName] = useState('');
  const [newClientPhone, setNewClientPhone] = useState('');
  const [newClientEmail, setNewClientEmail] = useState('');

  // Produits disponibles (en stock)
  const availableProducts = allProducts.filter(p => p.quantity > 0);

  // Filtrer les produits par recherche
  const filteredProducts = availableProducts.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  // Filtrer les clients par recherche
  const filteredClients = ClientService.searchClients(clients, clientSearch);

  // Calculs automatiques
  const unitPrice = selectedProduct?.sellingPrice || 0;
  const quantityNum = parseFloat(quantity) || 0;
  const subtotal = unitPrice * quantityNum;
  const paidAmountNum = parseFloat(paidAmount) || 0;
  const remaining = subtotal - paidAmountNum;

  // Vérifier si le formulaire est valide
  const isFormValid = () => {
    if (!selectedProduct) return false;
    if (!quantity || quantityNum <= 0) return false;
    if (quantityNum > selectedProduct.quantity) return false;
    if (paidAmountNum < 0) return false;
    return true;
  };

  // Sélectionner un produit
  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setShowProductModal(false);
    setProductSearch('');
  };

  // Sélectionner un client
  const handleSelectClient = (client) => {
    setSelectedClient(client);
    setShowClientModal(false);
    setClientSearch('');
  };

  // Ajouter un nouveau client
  const handleAddNewClient = async () => {
    if (!newClientName.trim()) {
      Alert.alert('Erreur', 'Le nom du client est obligatoire');
      return;
    }

    setSubmitting(true);
    const result = await addClient({
      name: newClientName.trim(),
      phone: newClientPhone.trim(),
      email: newClientEmail.trim(),
    });

    setSubmitting(false);

    if (result.success) {
      setSelectedClient(result.client);
      setShowNewClientModal(false);
      setNewClientName('');
      setNewClientPhone('');
      setNewClientEmail('');
      Alert.alert('Succès', 'Client ajouté avec succès');
    } else {
      Alert.alert('Erreur', result.error);
    }
  };

  // Enregistrer la vente
  const handleSaveSale = async (generateInvoice = false) => {
    if (!isFormValid()) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (quantityNum > selectedProduct.quantity) {
      Alert.alert(
        'Stock insuffisant',
        `Stock disponible : ${selectedProduct.quantity} ${selectedProduct.unit || 'unités'}`
      );
      return;
    }

    setSubmitting(true);

    try {
      // 1. Enregistrer la vente
      const saleData = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        quantity: quantityNum,
        unitPrice: unitPrice,
        total: subtotal,
        clientId: selectedClient?.id || null,
        clientName: selectedClient?.name || null,
        paymentMethod: paymentMethod,
        paidAmount: paidAmountNum,
        remainingAmount: remaining,
        status: remaining > 0 ? 'partial' : 'paid',
        notes: notes.trim(),
      };

      const saleResult = await recordSale(saleData);

      if (!saleResult.success) {
        Alert.alert('Erreur', saleResult.error);
        setSubmitting(false);
        return;
      }

      // 2. Mettre à jour les stats du client si sélectionné
      if (selectedClient) {
        await ClientService.updateClientPurchaseStats(selectedClient.id, subtotal);
      }

      // 3. Toujours générer une facture pour chaque vente
      const invoiceData = {
        customerName: selectedClient?.name || 'Client anonyme',
        customerPhone: selectedClient?.phone || '',
        items: [{
          productId: selectedProduct.id,
          productName: selectedProduct.name,
          quantity: quantityNum,
          unitPrice: unitPrice,
          total: subtotal,
        }],
        subtotal: subtotal,
        discount: 0,
        total: subtotal,
        paymentMethod: paymentMethod,
        status: remaining > 0 ? 'unpaid' : 'paid',
        notes: notes.trim(),
      };

      const invoiceResult = await InvoiceService.createInvoice(invoiceData);
      
      // Message si la facture a été créée
      const invoiceMessage = invoiceResult.success 
        ? `\n\n✅ Facture ${invoiceResult.invoiceNumber} générée`
        : `\n\n⚠️ Vente enregistrée mais erreur facture: ${invoiceResult.error}`;

      // 4. Rafraîchir les produits pour synchroniser l'inventaire
      await refreshProducts();

      // 5. Réinitialiser le formulaire
      setSelectedProduct(null);
      setQuantity('');
      setSelectedClient(null);
      setPaymentMethod('cash');
      setPaidAmount('');
      setNotes('');

      // 6. Message de succès
      Alert.alert(
        'Vente enregistrée !',
        `Produit : ${selectedProduct.name}\nQuantité : ${quantityNum}\nMontant : ${subtotal.toLocaleString()} FCFA${
          remaining > 0 ? `\nRestant à payer : ${remaining.toLocaleString()} FCFA` : ''
        }${invoiceMessage}`,
        [
          {
            text: 'Nouvelle vente',
            onPress: () => {},
          },
          {
            text: 'Voir factures',
            onPress: () => navigation.navigate('Invoices'),
          },
          {
            text: 'Tableau de bord',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.error('Erreur lors de l\'enregistrement de la vente:', error);
      Alert.alert('Erreur', 'Une erreur inattendue est survenue');
    } finally {
      setSubmitting(false);
    }
  };

  if (productsLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement des produits...</Text>
      </View>
    );
  }

if (productsLoading) {
  return (
    <View style={styles.centerContainer}>
      <ActivityIndicator size="large" color="#3b82f6" />
      <Text style={styles.loadingText}>Chargement des produits...</Text>
    </View>
  );
}

if (availableProducts.length === 0) {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, isMobile && styles.headerMobile]}>
        <Text style={styles.headerTitle}>Enregistrer une vente</Text>
        {/* Espace à droite */}
        <View style={{ width: isMobile ? 0 : 80 }} />
      </View>

      <View style={styles.centerContainer}>
        <Text style={styles.emptyIcon}>📦</Text>
        <Text style={styles.emptyTitle}>Aucun produit en stock</Text>
        <Text style={styles.emptyText}>
          Ajoutez des produits dans votre inventaire avant d'enregistrer une vente.
        </Text>
        <TouchableOpacity
          style={styles.emptyButton}
          onPress={() => navigation.navigate('Inventory')}
        >
          <Text style={styles.emptyButtonText}>Aller à l'inventaire</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

return (
  <View style={styles.container}>
    {/* Header */}
    <View style={[styles.header, isMobile && styles.headerMobile]}>
      <Text style={styles.headerTitle}>Enregistrer une vente</Text>
      {/* Espace à droite */}
      <View style={{ width: isMobile ? 0 : 80 }} />
    </View>

    <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
      {/* 1. Sélection du produit */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Produit vendu *</Text>
        <TouchableOpacity
          style={styles.selectButton}
          onPress={() => setShowProductModal(true)}
        >
          {selectedProduct ? (
            <View style={styles.selectedItem}>
              <View>
                <Text style={styles.selectedItemName}>{selectedProduct.name}</Text>
                <Text style={styles.selectedItemDetails}>
                  {selectedProduct.sellingPrice.toLocaleString()} FCFA/unité • Stock: {selectedProduct.quantity}
                </Text>
              </View>
              <Text style={styles.changeText}>Changer</Text>
            </View>
          ) : (
            <Text style={styles.selectButtonText}>Sélectionner un produit</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* 2. Quantité */}
      {selectedProduct && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. Quantité vendue *</Text>
          <TextInput
            style={styles.input}
            placeholder="Entrez la quantité"
            keyboardType="numeric"
            value={quantity}
            onChangeText={setQuantity}
          />
          {quantityNum > 0 && quantityNum > selectedProduct.quantity && (
            <Text style={styles.errorText}>
              ⚠️ Stock insuffisant (disponible: {selectedProduct.quantity})
            </Text>
          )}
          {quantityNum > 0 && quantityNum <= selectedProduct.quantity && (
            <Text style={styles.successText}>
              ✓ Stock suffisant
            </Text>
          )}
        </View>
      )}

      {/* 3. Montant calculé */}
      {selectedProduct && quantityNum > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. Montant total</Text>
          <View style={styles.amountCard}>
            <Text style={styles.amountLabel}>Prix unitaire</Text>
            <Text style={styles.amountValue}>{unitPrice.toLocaleString()} FCFA</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.amountLabel}>Quantité</Text>
            <Text style={styles.amountValue}>{quantityNum}</Text>
            
            <View style={styles.divider} />
            
            <Text style={styles.totalLabel}>TOTAL</Text>
            <Text style={styles.totalValue}>{subtotal.toLocaleString()} FCFA</Text>
          </View>
        </View>
      )}

      {/* 4. Client (optionnel) */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. Client (optionnel)</Text>
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.selectButton, { flex: 1, marginRight: 8 }]}
            onPress={() => setShowClientModal(true)}
          >
            {selectedClient ? (
              <View style={styles.selectedItem}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.selectedItemName}>{selectedClient.name}</Text>
                  {selectedClient.phone && (
                    <Text style={styles.selectedItemDetails}>{selectedClient.phone}</Text>
                  )}
                </View>
                <Text style={styles.changeText}>Changer</Text>
              </View>
            ) : (
              <Text style={styles.selectButtonText}>Choisir un client</Text>
            )}
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.selectButton, styles.addButton]}
            onPress={() => setShowNewClientModal(true)}
          >
            <Text style={styles.addButtonText}>+ Nouveau</Text>
          </TouchableOpacity>
        </View>
        {selectedClient && (
          <TouchableOpacity onPress={() => setSelectedClient(null)}>
            <Text style={styles.clearText}>✕ Retirer le client</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 5. Mode de paiement */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Mode de paiement *</Text>
        <View style={styles.paymentGrid}>
          {[
            { value: 'cash', label: 'Espèces', icon: '💵' },
            { value: 'mobile_money', label: 'Mobile Money', icon: '📱' },
            { value: 'card', label: 'Carte', icon: '💳' },
            { value: 'other', label: 'Autre', icon: '💼' },
          ].map((method) => (
            <TouchableOpacity
              key={method.value}
              style={[
                styles.paymentOption,
                paymentMethod === method.value && styles.paymentOptionSelected,
              ]}
              onPress={() => setPaymentMethod(method.value)}
            >
              <Text style={styles.paymentIcon}>{method.icon}</Text>
              <Text
                style={[
                  styles.paymentLabel,
                  paymentMethod === method.value && styles.paymentLabelSelected,
                ]}
              >
                {method.label}
              </Text>
            </TouchableOpacity>
          ))}
          </View>
        </View>

        {/* 6. Montant payé */}
        {subtotal > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>6. Montant payé (optionnel)</Text>
            <TextInput
              style={styles.input}
              placeholder={`Montant total: ${subtotal.toLocaleString()} FCFA`}
              keyboardType="numeric"
              value={paidAmount}
              onChangeText={setPaidAmount}
            />
            {paidAmountNum > 0 && paidAmountNum < subtotal && (
              <Text style={styles.warningText}>
                Paiement partiel - Reste à payer: {remaining.toLocaleString()} FCFA
              </Text>
            )}
            {paidAmountNum >= subtotal && (
              <Text style={styles.successText}>
                ✓ Paiement complet
              </Text>
            )}
          </View>
        )}

        {/* 7. Notes */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>7. Notes (optionnel)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Ajouter une note..."
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Bouton d'action */}
        <TouchableOpacity
          style={[styles.submitButton, !isFormValid() && styles.submitButtonDisabled]}
          onPress={() => handleSaveSale(false)}
          disabled={!isFormValid() || submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <>
              <Text style={styles.submitButtonIcon}>🧾</Text>
              <Text style={styles.submitButtonText}>Enregistrer la vente</Text>
              <Text style={styles.submitButtonSubtext}>Une facture sera créée automatiquement</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>

      {/* Modal Sélection Produit */}
      <Modal
        visible={showProductModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowProductModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner un produit</Text>
              <TouchableOpacity onPress={() => setShowProductModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un produit..."
              value={productSearch}
              onChangeText={setProductSearch}
            />

            <ScrollView style={styles.modalList}>
              {filteredProducts.map((product) => (
                <TouchableOpacity
                  key={product.id}
                  style={styles.modalItem}
                  onPress={() => handleSelectProduct(product)}
                >
                  <View style={styles.modalItemContent}>
                    <Text style={styles.modalItemName}>{product.name}</Text>
                    <Text style={styles.modalItemDetails}>
                      {product.category} • {product.sellingPrice.toLocaleString()} FCFA
                    </Text>
                    <Text style={styles.modalItemStock}>
                      Stock: {product.quantity} {product.unit || 'unités'}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Sélection Client */}
      <Modal
        visible={showClientModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowClientModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sélectionner un client</Text>
              <TouchableOpacity onPress={() => setShowClientModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.searchInput}
              placeholder="Rechercher un client..."
              value={clientSearch}
              onChangeText={setClientSearch}
            />

            <ScrollView style={styles.modalList}>
              {filteredClients.map((client) => (
                <TouchableOpacity
                  key={client.id}
                  style={styles.modalItem}
                  onPress={() => handleSelectClient(client)}
                >
                  <View style={styles.modalItemContent}>
                    <Text style={styles.modalItemName}>{client.name}</Text>
                    {client.phone && (
                      <Text style={styles.modalItemDetails}>{client.phone}</Text>
                    )}
                    {client.totalPurchases > 0 && (
                      <Text style={styles.modalItemStock}>
                        {client.totalPurchases} achat(s) • {client.totalAmount.toLocaleString()} FCFA
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
              {filteredClients.length === 0 && (
                <Text style={styles.emptyModalText}>Aucun client trouvé</Text>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Nouveau Client */}
      <Modal
        visible={showNewClientModal}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setShowNewClientModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nouveau client</Text>
              <TouchableOpacity onPress={() => setShowNewClientModal(false)}>
                <Text style={styles.modalClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalForm}>
              <Text style={styles.inputLabel}>Nom *</Text>
              <TextInput
                style={styles.input}
                placeholder="Nom du client"
                value={newClientName}
                onChangeText={setNewClientName}
              />

              <Text style={styles.inputLabel}>Téléphone</Text>
              <TextInput
                style={styles.input}
                placeholder="+225 XX XX XX XX XX"
                keyboardType="phone-pad"
                value={newClientPhone}
                onChangeText={setNewClientPhone}
              />

              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email@exemple.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={newClientEmail}
                onChangeText={setNewClientEmail}
              />

              <TouchableOpacity
                style={[styles.button, styles.primaryButton, { marginTop: 16 }]}
                onPress={handleAddNewClient}
                disabled={!newClientName.trim() || submitting}
              >
                {submitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.primaryButtonText}>Ajouter le client</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    width: '100%',
    maxWidth: '100%',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 20,
    paddingBottom: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    zIndex: 10,
  },
  headerMobile: {
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  backButton: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  content: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: '100%',
  },
  section: {
    marginBottom: 24,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  selectButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    width: '100%',
  },
  selectButtonText: {
    fontSize: 15,
    color: '#6b7280',
  },
  selectedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  selectedItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  selectedItemDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
  changeText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '500',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    fontSize: 16,
    color: '#111',
    width: '100%',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  errorText: {
    marginTop: 8,
    fontSize: 14,
    color: '#ef4444',
  },
  successText: {
    marginTop: 8,
    fontSize: 14,
    color: '#10b981',
  },
  warningText: {
    marginTop: 8,
    fontSize: 14,
    color: '#f59e0b',
  },
  amountCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 20,
  },
  amountLabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 4,
  },
  amountValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#10b981',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  addButton: {
    width: 100,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0fdf4',
    borderColor: '#10b981',
  },
  addButtonText: {
    fontSize: 15,
    color: '#10b981',
    fontWeight: '600',
  },
  clearText: {
    marginTop: 8,
    fontSize: 14,
    color: '#ef4444',
  },
  paymentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    width: '100%',
    justifyContent: 'space-between',
  },
  paymentOption: {
    width: '48%',
    minWidth: 150,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#e5e7eb',
    padding: 16,
    alignItems: 'center',
  },
  paymentOptionSelected: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  paymentIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  paymentLabelSelected: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 56,
  },
  primaryButton: {
    backgroundColor: '#3b82f6',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#3b82f6',
  },
  secondaryButtonText: {
    color: '#3b82f6',
    fontSize: 16,
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    marginBottom: 32,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitButtonDisabled: {
    backgroundColor: '#9ca3af',
    shadowOpacity: 0,
  },
  submitButtonIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  submitButtonSubtext: {
    color: '#e0e7ff',
    fontSize: 12,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '80%',
    ...Platform.select({
      web: {
        boxShadow: '0 -4px 12px rgba(0,0,0,0.15)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
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
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  modalClose: {
    fontSize: 24,
    color: '#6b7280',
  },
  searchInput: {
    margin: 20,
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    padding: 16,
    fontSize: 16,
    color: '#111',
  },
  modalList: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  modalItem: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  modalItemContent: {
    flex: 1,
  },
  modalItemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 4,
  },
  modalItemDetails: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  modalItemStock: {
    fontSize: 13,
    color: '#10b981',
  },
  emptyModalText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#6b7280',
    padding: 40,
  },
  modalForm: {
    padding: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 8,
    marginTop: 12,
  },
});

export default QuickSaleScreen;


