import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  StyleSheet,
} from 'react-native';

const InvoiceDetailsModal = ({ 
  visible, 
  onClose, 
  invoice = null,
  onUpdateStatus,
  onPrint,
}) => {
  if (!invoice) return null;

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatNumber = (num) => {
    return Math.round(num || 0).toLocaleString('fr-FR');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      paid: { label: 'Payé', color: '#10b981', bg: '#d1fae5' },
      unpaid: { label: 'Non payé', color: '#f59e0b', bg: '#fef3c7' },
      cancelled: { label: 'Annulé', color: '#ef4444', bg: '#fee2e2' },
    };

    const config = statusConfig[status] || statusConfig.paid;

    return (
      <View style={[styles.statusBadge, { backgroundColor: config.bg }]}>
        <Text style={[styles.statusText, { color: config.color }]}>
          {config.label}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Facture {invoice.invoiceNumber}</Text>
              <Text style={styles.modalSubtitle}>{formatDate(invoice.date)}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Contenu */}
          <ScrollView style={styles.modalContent}>
            {/* Informations client */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Client</Text>
              <View style={styles.infoCard}>
                <Text style={styles.customerName}>{invoice.customerName || 'Client'}</Text>
              </View>
            </View>

            {/* Statut et paiement */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Détails</Text>
              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Statut:</Text>
                  {getStatusBadge(invoice.status)}
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Mode de paiement:</Text>
                  <Text style={styles.infoValue}>{invoice.paymentMethod}</Text>
                </View>
                {invoice.notes && (
                  <View style={styles.infoRow}>
                    <Text style={styles.infoLabel}>Notes:</Text>
                    <Text style={styles.infoValue}>{invoice.notes}</Text>
                  </View>
                )}
              </View>
            </View>

            {/* Produits */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Produits ({invoice.items?.length || 0})</Text>
              <View style={styles.itemsTable}>
                {/* Header du tableau */}
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, styles.colProduct]}>Produit</Text>
                  <Text style={[styles.tableHeaderText, styles.colQty]}>Qté</Text>
                  <Text style={[styles.tableHeaderText, styles.colPrice]}>Prix U.</Text>
                  <Text style={[styles.tableHeaderText, styles.colTotal]}>Total</Text>
                </View>

                {/* Lignes du tableau */}
                {invoice.items?.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCellText, styles.colProduct]}>{item.productName}</Text>
                    <Text style={[styles.tableCellText, styles.colQty]}>{item.quantity}</Text>
                    <Text style={[styles.tableCellText, styles.colPrice]}>
                      {formatNumber(item.unitPrice)}
                    </Text>
                    <Text style={[styles.tableCellText, styles.colTotal, styles.tableCellBold]}>
                      {formatNumber(item.total)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Totaux */}
            <View style={styles.section}>
              <View style={styles.totalsCard}>
                <View style={styles.totalRow}>
                  <Text style={styles.totalLabel}>Sous-total:</Text>
                  <Text style={styles.totalValue}>
                    {formatNumber(invoice.subtotal)} FCFA
                  </Text>
                </View>

                {invoice.discount > 0 && (
                  <View style={styles.totalRow}>
                    <Text style={styles.totalLabel}>Remise:</Text>
                    <Text style={[styles.totalValue, styles.discountValue]}>
                      - {formatNumber(invoice.discount)} FCFA
                    </Text>
                  </View>
                )}

                <View style={[styles.totalRow, styles.totalRowFinal]}>
                  <Text style={styles.totalLabelFinal}>Total:</Text>
                  <Text style={styles.totalValueFinal}>
                    {formatNumber(invoice.total)} FCFA
                  </Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Footer avec actions */}
          <View style={styles.modalFooter}>
            {invoice.status !== 'cancelled' && (
              <>
                {invoice.status === 'unpaid' && (
                  <TouchableOpacity
                    style={[styles.button, styles.buttonSuccess]}
                    onPress={() => onUpdateStatus && onUpdateStatus(invoice.id, 'paid')}
                  >
                    <Text style={styles.buttonText}>Marquer comme payé</Text>
                  </TouchableOpacity>
                )}

                {invoice.status === 'paid' && (
                  <TouchableOpacity
                    style={[styles.button, styles.buttonWarning]}
                    onPress={() => onUpdateStatus && onUpdateStatus(invoice.id, 'unpaid')}
                  >
                    <Text style={styles.buttonText}>Marquer comme non payé</Text>
                  </TouchableOpacity>
                )}
              </>
            )}

            {onPrint && (
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={() => onPrint(invoice)}
              >
                <Text style={styles.buttonText}>📄 Imprimer</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              style={[styles.button, styles.buttonSecondary]}
              onPress={onClose}
            >
              <Text style={styles.buttonSecondaryText}>Fermer</Text>
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
    alignItems: 'flex-start',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#6b7280',
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
    marginBottom: 12,
  },
  infoCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
  },
  customerName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#111',
    fontWeight: '600',
    textAlign: 'right',
    flex: 1,
    marginLeft: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  itemsTable: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f9fafb',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 2,
    borderBottomColor: '#e5e7eb',
  },
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  tableCellText: {
    fontSize: 14,
    color: '#374151',
  },
  tableCellBold: {
    fontWeight: '700',
    color: '#111',
  },
  colProduct: {
    flex: 2,
  },
  colQty: {
    flex: 0.7,
    textAlign: 'center',
  },
  colPrice: {
    flex: 1,
    textAlign: 'right',
  },
  colTotal: {
    flex: 1,
    textAlign: 'right',
  },
  totalsCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  totalRowFinal: {
    borderTopWidth: 2,
    borderTopColor: '#3b82f6',
    paddingTop: 12,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  totalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  discountValue: {
    color: '#f59e0b',
  },
  totalLabelFinal: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e40af',
  },
  totalValueFinal: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e40af',
  },
  modalFooter: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    gap: 8,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
  },
  buttonSuccess: {
    backgroundColor: '#10b981',
  },
  buttonWarning: {
    backgroundColor: '#f59e0b',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonSecondaryText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default InvoiceDetailsModal;


