import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
  Platform,
  StyleSheet,
  Image,
} from 'react-native';
import ProductService from '../services/productService';

const ProductDetailsModal = ({ 
  visible, 
  onClose, 
  product = null,
  onEdit,
  onDelete,
}) => {
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    if (visible && product) {
      loadHistory();
    }
  }, [visible, product]);

  const loadHistory = async () => {
    if (!product) return;
    
    setLoadingHistory(true);
    const result = await ProductService.getProductHistory(product.id);
    if (result.success) {
      setHistory(result.history || []);
    }
    setLoadingHistory(false);
  };

  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatNumber = (num) => {
    return Math.round(num || 0).toLocaleString('fr-FR');
  };

  const getStatusBadge = (status) => {
    const config = {
      disponible: { label: 'Disponible', color: '#10b981', bg: '#d1fae5' },
      faible: { label: 'Stock faible', color: '#f59e0b', bg: '#fef3c7' },
      rupture: { label: 'Rupture', color: '#ef4444', bg: '#fee2e2' },
    };

    const statusConfig = config[status] || config.disponible;

    return (
      <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
        <Text style={[styles.statusText, { color: statusConfig.color }]}>
          {statusConfig.label}
        </Text>
      </View>
    );
  };

  const getActionIcon = (action) => {
    switch (action) {
      case 'created': return '✨';
      case 'updated': return '✏️';
      case 'deleted': return '🗑️';
      default: return '📝';
    }
  };

  if (!product) return null;

  const margin = product.purchasePrice > 0 
    ? (((product.sellingPrice - product.purchasePrice) / product.purchasePrice) * 100).toFixed(1)
    : 0;
  const profit = product.sellingPrice - product.purchasePrice;

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
            <View style={styles.headerLeft}>
              <Text style={styles.modalTitle}>{product.name}</Text>
              {getStatusBadge(product.status)}
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Contenu */}
          <ScrollView style={styles.modalContent} showsVerticalScrollIndicator={false}>
            {/* Image */}
            {product.imageUrl && (
              <View style={styles.imageContainer}>
                <Image source={{ uri: product.imageUrl }} style={styles.productImage} />
                {product.online && (
                  <View style={styles.onlineBadge}>
                    <Text style={styles.onlineBadgeText}>🌐 En ligne</Text>
                  </View>
                )}
              </View>
            )}

            {/* Informations principales */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Informations</Text>
              
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Catégorie:</Text>
                <Text style={styles.infoValue}>{product.category}</Text>
              </View>

              {product.description && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Description:</Text>
                  <Text style={styles.infoValue}>{product.description}</Text>
                </View>
              )}

              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Unité:</Text>
                <Text style={styles.infoValue}>{product.unit}</Text>
              </View>
            </View>

            {/* Prix et marges */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Prix et rentabilité</Text>
              
              <View style={styles.priceCard}>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Prix d'achat:</Text>
                  <Text style={styles.priceValue}>{formatNumber(product.purchasePrice)} FCFA</Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Prix de vente:</Text>
                  <Text style={styles.priceValue}>{formatNumber(product.sellingPrice)} FCFA</Text>
                </View>
                <View style={[styles.priceRow, styles.priceRowHighlight]}>
                  <Text style={styles.priceLabelHighlight}>Bénéfice unitaire:</Text>
                  <Text style={[styles.priceValueHighlight, profit >= 0 ? styles.profitPositive : styles.profitNegative]}>
                    {profit >= 0 ? '+' : ''}{formatNumber(profit)} FCFA
                  </Text>
                </View>
                <View style={styles.priceRow}>
                  <Text style={styles.priceLabel}>Marge:</Text>
                  <Text style={[styles.priceValue, profit >= 0 ? styles.profitPositive : styles.profitNegative]}>
                    {margin >= 0 ? '+' : ''}{margin}%
                  </Text>
                </View>
              </View>
            </View>

            {/* Stock */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Gestion du stock</Text>
              
              <View style={styles.stockCard}>
                <View style={styles.stockRow}>
                  <Text style={styles.stockLabel}>Stock actuel:</Text>
                  <Text style={styles.stockValue}>
                    {product.quantity} {product.unit}
                  </Text>
                </View>
                <View style={styles.stockRow}>
                  <Text style={styles.stockLabel}>Seuil d'alerte:</Text>
                  <Text style={styles.stockValue}>
                    {product.stockThreshold} {product.unit}
                  </Text>
                </View>
                <View style={styles.stockRow}>
                  <Text style={styles.stockLabel}>Valeur du stock:</Text>
                  <Text style={styles.stockValueHighlight}>
                    {formatNumber(product.quantity * product.purchasePrice)} FCFA
                  </Text>
                </View>
              </View>
            </View>

            {/* Historique */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Historique des modifications</Text>
              
              {loadingHistory ? (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color="#3b82f6" />
                  <Text style={styles.loadingText}>Chargement...</Text>
                </View>
              ) : history.length > 0 ? (
                <View style={styles.timeline}>
                  {history.map((entry, index) => (
                    <View key={index} style={styles.timelineItem}>
                      <View style={styles.timelineIconContainer}>
                        <Text style={styles.timelineIcon}>{getActionIcon(entry.action)}</Text>
                        {index < history.length - 1 && <View style={styles.timelineLine} />}
                      </View>
                      <View style={styles.timelineContent}>
                        <Text style={styles.timelineDescription}>{entry.description}</Text>
                        <Text style={styles.timelineDate}>{formatDate(entry.timestamp)}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={styles.noHistoryText}>Aucun historique disponible</Text>
              )}
            </View>

            {/* Métadonnées */}
            <View style={styles.section}>
              <View style={styles.metadataRow}>
                <Text style={styles.metadataLabel}>Créé le:</Text>
                <Text style={styles.metadataValue}>{formatDate(product.createdAt)}</Text>
              </View>
              <View style={styles.metadataRow}>
                <Text style={styles.metadataLabel}>Modifié le:</Text>
                <Text style={styles.metadataValue}>{formatDate(product.updatedAt)}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Footer avec actions */}
          <View style={styles.modalFooter}>
            {onDelete && (
              <TouchableOpacity
                style={[styles.button, styles.buttonDanger]}
                onPress={() => onDelete(product.id)}
              >
                <Text style={styles.buttonDangerText}>🗑️ Supprimer</Text>
              </TouchableOpacity>
            )}

            {onEdit && (
              <TouchableOpacity
                style={[styles.button, styles.buttonPrimary]}
                onPress={() => onEdit(product)}
              >
                <Text style={styles.buttonText}>✏️ Modifier</Text>
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
  headerLeft: {
    flex: 1,
    marginRight: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
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
  imageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  productImage: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    resizeMode: 'cover',
  },
  onlineBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  onlineBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
    width: 100,
  },
  infoValue: {
    flex: 1,
    fontSize: 14,
    color: '#111',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  priceCard: {
    backgroundColor: '#eff6ff',
    borderRadius: 12,
    padding: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  priceRowHighlight: {
    borderTopWidth: 2,
    borderTopColor: '#3b82f6',
    paddingTop: 12,
    marginTop: 4,
  },
  priceLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  priceValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  priceLabelHighlight: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1e40af',
  },
  priceValueHighlight: {
    fontSize: 16,
    fontWeight: '700',
  },
  profitPositive: {
    color: '#10b981',
  },
  profitNegative: {
    color: '#ef4444',
  },
  stockCard: {
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  stockRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  stockLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  stockValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  stockValueHighlight: {
    fontSize: 16,
    fontWeight: '700',
    color: '#3b82f6',
  },
  timeline: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineIconContainer: {
    alignItems: 'center',
    marginRight: 12,
  },
  timelineIcon: {
    fontSize: 20,
    width: 32,
    height: 32,
    textAlign: 'center',
    lineHeight: 32,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#e5e7eb',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
  },
  timelineDescription: {
    fontSize: 14,
    color: '#111',
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 12,
    color: '#9ca3af',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6b7280',
  },
  noHistoryText: {
    fontSize: 14,
    color: '#9ca3af',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  metadataRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  metadataLabel: {
    fontSize: 12,
    color: '#9ca3af',
  },
  metadataValue: {
    fontSize: 12,
    color: '#6b7280',
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
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonDanger: {
    backgroundColor: '#ef4444',
  },
  buttonDangerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  buttonSecondary: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  buttonSecondaryText: {
    color: '#6b7280',
    fontSize: 14,
    fontWeight: '500',
  },
});

export default ProductDetailsModal;


