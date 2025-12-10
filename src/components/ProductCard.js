import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';

const ProductCard = ({ product, onEdit, onDelete, onView }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'disponible':
        return '#10b981';
      case 'faible':
        return '#f59e0b';
      case 'rupture':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'disponible':
        return 'Disponible';
      case 'faible':
        return 'Stock faible';
      case 'rupture':
        return 'Rupture';
      default:
        return 'Inconnu';
    }
  };

  const getStatusIndicator = (status) => {
    switch (status) {
      case 'disponible':
        return '●';
      case 'faible':
        return '●';
      case 'rupture':
        return '●';
      default:
        return '●';
    }
  };

  const formatPrice = (price) => {
    return price.toLocaleString('fr-FR');
  };

  const formatDate = (date) => {
    if (!date) return '-';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
  };

  return (
    <View style={styles.card}>
      {/* Header de la carte */}
      <View style={styles.cardHeader}>
        <View style={styles.cardHeaderLeft}>
          <Text style={styles.productName} numberOfLines={1}>
            {product.name}
          </Text>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>
        </View>
        
        {/* Statut */}
        <View style={[styles.statusBadge, { backgroundColor: `${getStatusColor(product.status)}20` }]}>
          <Text style={[styles.statusIndicator, { color: getStatusColor(product.status) }]}>
            {getStatusIndicator(product.status)}
          </Text>
          <Text style={[styles.statusText, { color: getStatusColor(product.status) }]}>
            {getStatusText(product.status)}
          </Text>
        </View>
      </View>

      {/* Corps de la carte */}
      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Prix de vente:</Text>
          <Text style={styles.infoValue}>{formatPrice(product.sellingPrice)} FCFA</Text>
        </View>

        {product.purchasePrice > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Prix d'achat:</Text>
            <Text style={styles.infoValue}>{formatPrice(product.purchasePrice)} FCFA</Text>
          </View>
        )}

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Quantité:</Text>
          <Text style={[
            styles.infoValue,
            styles.quantityText,
            { color: getStatusColor(product.status) }
          ]}>
            {product.quantity} unités
          </Text>
        </View>

        {product.purchasePrice > 0 && (
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Marge unitaire:</Text>
            <Text style={[styles.infoValue, styles.profitText]}>
              +{formatPrice(product.sellingPrice - product.purchasePrice)} FCFA
            </Text>
          </View>
        )}

        {product.description && (
          <View style={[styles.infoRow, { marginTop: 8 }]}>
            <Text style={styles.descriptionText} numberOfLines={2}>
              {product.description}
            </Text>
          </View>
        )}
      </View>

      {/* Footer avec actions */}
      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>
          Ajouté le {formatDate(product.createdAt)}
        </Text>
        
        <View style={styles.actions}>
          {onView && (
            <TouchableOpacity
              style={[styles.actionButton, styles.viewButton]}
              onPress={() => onView(product)}
            >
              <Text style={[styles.actionButtonText, styles.viewButtonText]}>Détails</Text>
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={[styles.actionButton, styles.editButton]}
            onPress={() => onEdit(product)}
          >
            <Text style={styles.actionButtonText}>Modifier</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.deleteButton]}
            onPress={() => onDelete(product)}
          >
            <Text style={[styles.actionButtonText, styles.deleteButtonText]}>Supprimer</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 12,
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    color: '#6b7280',
    fontWeight: '500',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusIndicator: {
    fontSize: 16,
    fontWeight: '700',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardBody: {
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
  },
  quantityText: {
    fontWeight: '700',
  },
  profitText: {
    color: '#10b981',
  },
  descriptionText: {
    fontSize: 13,
    color: '#6b7280',
    fontStyle: 'italic',
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f9fafb',
    borderTopWidth: 1,
    borderTopColor: '#f3f4f6',
  },
  dateText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
  },
  viewButton: {
    backgroundColor: '#f0fdf4',
    borderColor: '#16a34a',
  },
  editButton: {
    backgroundColor: '#eff6ff',
    borderColor: '#3b82f6',
  },
  deleteButton: {
    backgroundColor: '#fff',
    borderColor: '#e5e7eb',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#3b82f6',
  },
  viewButtonText: {
    color: '#16a34a',
  },
  deleteButtonText: {
    color: '#ef4444',
  },
});

export default ProductCard;

