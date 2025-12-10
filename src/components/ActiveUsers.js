import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Modal, Dimensions, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../styles/theme';

/**
 * Liste d'utilisateurs actifs - Style ArchitectUI
 * @param {Array} users - Liste des utilisateurs à afficher
 * @param {Function} onSave - Fonction appelée lors du clic sur le bouton Sauvegarder
 * @param {string} [saveButtonText='Sauvegarder'] - Texte du bouton de sauvegarde
 * @param {boolean} [showSaveButton=true] - Afficher ou masquer le bouton de sauvegarde
 */
// Composant pour afficher les détails des ventes
const SaleDetailsModal = ({ visible, sales = [], onClose }) => {
  if (!sales || sales.length === 0) return null;
  
  // Formater la date
  const formatDate = (date) => {
    if (!date) return 'Date inconnue';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Obtenir la couleur du statut
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'terminée':
      case 'complétée':
      case 'livrée':
        return '#4CAF50';
      case 'en cours':
      case 'en attente':
        return '#FFA000';
      case 'annulée':
      case 'refusée':
        return '#F44336';
      default:
        return '#9E9E9E';
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Historique des transactions</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color={theme.colors.textPrimary} />
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalBody}>
            {sales.map((sale, index) => (
              <View key={`sale-${sale.id}-${index}`} style={styles.saleContainer}>
                <Text style={styles.saleTitle}>Transaction #{sales.length - index} - {formatDate(sale.date)}</Text>
                
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>INFORMATIONS CLIENT</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Nom:</Text>
                    <Text style={styles.detailValue}>{sale.customerName || 'Non spécifié'}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Téléphone:</Text>
                    <Text style={styles.detailValue}>{sale.customerPhone}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Email:</Text>
                    <Text style={styles.detailValue}>{sale.customerEmail}</Text>
                  </View>
                </View>
                
                <View style={styles.detailSection}>
                  <Text style={styles.sectionTitle}>DÉTAILS DE LA TRANSACTION</Text>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>N° Transaction:</Text>
                    <Text style={styles.detailValue}>{sale.id}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date:</Text>
                    <Text style={styles.detailValue}>{formatDate(sale.date)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Montant:</Text>
                    <Text style={[styles.detailValue, styles.amount]}>{sale.amount?.toLocaleString('fr-FR')} FCFA</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Moyen de paiement:</Text>
                    <Text style={styles.detailValue}>{sale.paymentMethod}</Text>
                  </View>
                  <View style={[styles.detailRow, { marginTop: 8 }]}>
                    <Text style={styles.detailLabel}>Statut:</Text>
                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(sale.status) }]}>
                      <Text style={styles.statusText}>{sale.status}</Text>
                    </View>
                  </View>
                </View>
                
                {sale.items?.length > 0 && (
                  <View style={styles.detailSection}>
                    <Text style={styles.sectionTitle}>ARTICLES ({sale.items.length})</Text>
                    {sale.items.map((item, itemIndex) => (
                      <View key={itemIndex} style={styles.itemRow}>
                        <View style={styles.itemInfo}>
                          <Text style={styles.itemName} numberOfLines={1}>
                            {item.name || 'Article sans nom'}
                          </Text>
                          {item.sku && (
                            <Text style={styles.itemSku}>SKU: {item.sku}</Text>
                          )}
                        </View>
                        <Text style={styles.itemQuantity}>x{item.quantity}</Text>
                        <Text style={styles.itemPrice}>
                          {item.price?.toLocaleString('fr-FR')} FCFA
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
                
                {sale.notes && (
                  <View style={styles.notesContainer}>
                    <Text style={styles.notesLabel}>Notes:</Text>
                    <Text style={styles.notesText}>{sale.notes}</Text>
                  </View>
                )}
                
                {index < sales.length - 1 && <View style={styles.saleSeparator} />}
              </View>
            ))}
          </ScrollView>
          
          <View style={styles.modalFooter}>
            <TouchableOpacity 
              style={[styles.button, styles.closeModalButton]} 
              onPress={onClose}
            >
              <Text style={styles.buttonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export const ActiveUsers = ({ 
  users = [], 
  onSave,
  saveButtonText = 'Sauvegarder',
  showSaveButton = false
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const [selectedSales, setSelectedSales] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  
  const handleViewDetails = (user) => {
    console.log('Données utilisateur:', JSON.stringify(user, null, 2));
    
    // Vérifier si l'utilisateur a des données de vente
    if (!user.transactions || user.transactions.length === 0) {
      Alert.alert(
        'Aucune transaction trouvée',
        `Aucun historique de transaction pour ${user.name}`,
        [{ text: 'OK' }]
      );
      return;
    }

    // Prendre les 3 dernières transactions triées par date (du plus récent au plus ancien)
    const recentTransactions = [...user.transactions]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 3)
      .map(transaction => ({
        id: transaction._id || 'N/A',
        customerName: user.name,
        customerPhone: user.phone || 'Non renseigné',
        customerEmail: user.email || 'Non renseigné',
        date: transaction.createdAt ? new Date(transaction.createdAt) : new Date(),
        amount: transaction.amount || 0,
        paymentMethod: transaction.paymentMethod || 'Non spécifié',
        status: 'Terminée',
        items: transaction.items || [],
        notes: transaction.notes || 'Aucune note'
      }));

    setSelectedSales(recentTransactions);
    setIsModalVisible(true);
  };
  
  const closeModal = () => {
    setIsModalVisible(false);
    // Petit délai pour l'animation
    setTimeout(() => setSelectedSales([]), 300);
  };
  
  const handleSave = async () => {
    if (!onSave) return;
    
    try {
      setIsSaving(true);
      await onSave(users);
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
      // Ici, vous pourriez ajouter une notification d'erreur à l'utilisateur
    } finally {
      setIsSaving(false);
    }
  };
  // Utiliser uniquement les vraies données - PAS de données fictives
  if (!users || users.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Clients Actifs</Text>
        <View style={styles.emptyState}>
          <Ionicons name="people-outline" size={48} color={theme.colors.textSecondary} />
          <Text style={styles.emptyText}>Aucun client actif</Text>
          <Text style={styles.emptySubtext}>
            Les clients qui ont effectué des achats apparaîtront ici
          </Text>
        </View>
      </View>
    );
  }

  const getStatusStyle = (color) => ({
    backgroundColor: color,
  });

  const renderSparkline = (trend) => {
    let data, color;
    
    if (trend === 'up') {
      data = [30, 35, 32, 38, 36, 42, 40];
      color = '#4CAF50';
    } else if (trend === 'down') {
      data = [40, 38, 35, 32, 30, 28, 25];
      color = '#F44336';
    } else {
      data = [32, 34, 33, 35, 34, 36, 35];
      color = '#FFA726';
    }
    
    return (
      <View key={`sparkline-${trend || 'neutral'}`} style={styles.sparklineContainer}>
        {data.map((height, i) => (
          <View 
            key={i} 
            style={[
              styles.sparklineBar, 
              { 
                height, 
                backgroundColor: color,
                marginRight: i === data.length - 1 ? 0 : 2
              }
            ]} 
          />
        ))}
      </View>
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.scrollWrapper}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={true}
            contentContainerStyle={styles.scrollContent}
          >
            <View style={styles.scrollContentInner}>
              <View style={styles.header}>
                <Text style={styles.title}>UTILISATEURS ACTIFS</Text>
                <View style={styles.headerActions}>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>1a semaine suivante</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.actionButton}>
                    <Text style={styles.actionText}>Tout le mois</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.tableContainer}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableHeaderText, styles.colId]}>#</Text>
                  <Text style={[styles.tableHeaderText, styles.colName]}>Nom</Text>
                  <Text style={[styles.tableHeaderText, styles.colCity]}>Ville</Text>
                  <Text style={[styles.tableHeaderText, styles.colStatus]}>Statut</Text>
                  <Text style={[styles.tableHeaderText, styles.colTrend]}>Ventes</Text>
                  <Text style={[styles.tableHeaderText, styles.colAction]}>Actions</Text>
                </View>
                <View style={styles.tableBody}>
                  {users.map((user, index) => (
                    <View key={`user-${user.id}-${index}`} style={styles.userRow}>
                      <Text style={[styles.userId, styles.colId]}>{user.id}</Text>
                      
                      <View style={[styles.userInfo, styles.colName]}>
                        <View style={styles.avatar}>
                          {user.avatar ? (
                            <Image source={{ uri: user.avatar }} style={styles.avatarImage} />
                          ) : (
                            <Ionicons name="person" size={20} color={theme.colors.textSecondary} />
                          )}
                        </View>
                        <View style={styles.userInfoText}>
                          <Text style={styles.userName} numberOfLines={1} ellipsizeMode="tail">
                            {user.name}
                          </Text>
                          <Text style={styles.userDescription} numberOfLines={1} ellipsizeMode="tail">
                            {user.description}
                          </Text>
                        </View>
                      </View>

                      <Text style={[styles.userCity, styles.colCity]} numberOfLines={1} ellipsizeMode="tail">
                        {user.city}
                      </Text>

                      <View style={styles.colStatus}>
                        <View style={[styles.statusBadge, getStatusStyle(user.statusColor)]}>
                          <Text style={styles.statusText} numberOfLines={1}>
                            {user.status}
                          </Text>
                        </View>
                      </View>

                      <View style={styles.colTrend}>
                        {renderSparkline(user.trend)}
                      </View>

                      <View style={styles.colAction}>
                        <TouchableOpacity 
                          style={styles.detailsButton}
                          onPress={() => handleViewDetails(user)}
                        >
                          <Text style={styles.detailsButtonText}>Détails</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {showSaveButton && (
          <View style={styles.footer}>
            <TouchableOpacity 
              style={[
                styles.saveButton,
                isSaving && styles.saveButtonDisabled
              ]} 
              onPress={handleSave}
              disabled={isSaving || !onSave}
            >
              {isSaving ? (
                <Text style={styles.saveButtonText}>Enregistrement...</Text>
              ) : (
                <Text style={styles.saveButtonText}>{saveButtonText}</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
      
      <SaleDetailsModal 
        visible={isModalVisible} 
        sales={selectedSales}
        onClose={() => {
          setIsModalVisible(false);
          setSelectedSales([]);
        }}
      />
    </View>
  );
};

// Fonction utilitaire pour la couleur du statut
const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'terminée':
    case 'complétée':
    case 'livrée':
      return '#4CAF50'; // Vert
    case 'en cours':
    case 'en attente':
      return '#FFA000'; // Orange
    case 'annulée':
    case 'refusée':
      return '#F44336'; // Rouge
    default:
      return '#9E9E9E'; // Gris
  }
};

const styles = StyleSheet.create({
  // Styles pour la modale
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    maxHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.textPrimary,
  },
  closeButton: {
    padding: 4,
  },
  modalBody: {
    flex: 1,
  },
  modalFooter: {
    marginTop: 16,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    alignItems: 'center',
  },
  closeModalButton: {
    backgroundColor: theme.colors.primary,
  },
  buttonText: {
    color: theme.colors.onPrimary,
    fontWeight: '600',
  },
  
  // Styles pour les transactions
  saleContainer: {
    marginBottom: 20,
    paddingBottom: 16,
  },
  saleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 12,
  },
  saleSeparator: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: 16,
  },
  
  // Styles des détails
  detailSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginRight: 8,
  },
  detailValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    flex: 1,
    textAlign: 'right',
  },
  amount: {
    fontWeight: '600',
    color: theme.colors.primary,
  },
  
  // Badge de statut
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  
  // Styles des articles
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: `${theme.colors.border}40`,
  },
  itemInfo: {
    flex: 1,
    marginRight: 8,
  },
  itemName: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 2,
  },
  itemSku: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  itemQuantity: {
    width: 30,
    textAlign: 'center',
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  itemPrice: {
    width: 100,
    textAlign: 'right',
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  
  // Notes
  notesContainer: {
    marginTop: 12,
    padding: 12,
    backgroundColor: `${theme.colors.primary}10`,
    borderRadius: 8,
  },
  notesLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.primary,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    lineHeight: 20,
  },
  
  // Styles des montants
  amountsContainer: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingTop: 15,
  },
  amountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  amountLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
  },
  amountValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
  },
  discount: {
    color: '#F44336',
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  
  // Styles existants
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
  },

  title: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    letterSpacing: 0.5,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginTop: 12,
  },

  emptySubtext: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  
  // Styles pour le tableau
  tableContainer: {
    width: '100%',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 8,
    overflow: 'hidden',
  },
  
  tableHeader: {
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  tableHeaderText: {
    fontSize: 12,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    padding: 12,
  },
  
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  
  tableCell: {
    padding: 12,
    justifyContent: 'center',
  },

  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },

  actionButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: theme.colors.background,
    borderRadius: 6,
  },

  actionText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },

  tableHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },

  tableHeaderText: {
    fontSize: 11,
    fontWeight: '700',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
  },

  scrollWrapper: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
  
  scrollContent: {
    minWidth: '100%',
  },
  
  scrollContentInner: {
    minWidth: 1000,
    paddingRight: 20,
  },
  
  // Styles pour les colonnes du tableau
  colId: {
    width: 40,
    minWidth: 40,
    marginRight: 16,
  },
  
  colName: {
    flex: 4,
    minWidth: 200,
    paddingRight: 16,
  },
  
  colCity: {
    flex: 1,
    minWidth: 120,
    paddingRight: 16,
  },
  
  colStatus: {
    width: 120,
    minWidth: 120,
    paddingRight: 16,
  },
  
  colTrend: {
    width: 100,
    minWidth: 100,
    paddingRight: 16,
  },
  
  colAction: {
    width: 100,
    minWidth: 100,
    paddingRight: 16,
  },
  
  tableContainer: {
    width: '100%',
  },
  
  tableBody: {
    width: '100%',
  },

  userRow: {
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    alignItems: 'center',
    minHeight: 70,
    width: '100%',
  },

  colId: {
    width: 40,
    minWidth: 40,
    marginRight: 16,
  },

  colName: {
    flex: 4,
    minWidth: 200,
    paddingRight: 16,
  },

  colCity: {
    flex: 1,
    minWidth: 120,
    paddingRight: 16,
  },

  colStatus: {
    width: 120,
    minWidth: 120,
    paddingRight: 16,
  },

  colTrend: {
    width: 100,
    minWidth: 100,
    paddingRight: 16,
  },

  colAction: {
    width: 100,
    minWidth: 100,
    paddingRight: 16,
  },

  userId: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },

  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    minWidth: 0,
    overflow: 'hidden',
  },
  
  userInfoText: {
    flex: 1,
    minWidth: 0,
  },
  
  // Avatar
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  
  // Statut
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  
  statusText: {
    fontSize: 12,
    fontWeight: '500',
    color: 'white',
  },
  
  // Sparkline
  sparklineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 30,
    width: '100%',
  },
  
  sparklineBar: {
    flex: 1,
    marginRight: 2,
    borderRadius: 2,
  },
  
  // Boutons d'action
  detailsButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: theme.colors.primary,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  
  detailsButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  
  // Pied de page
  footer: {
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  
  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
    opacity: 0.9,
  },
  
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  
  // États de chargement
  savingText: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginRight: 10,
  },

  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },

  userName: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 2,
    flexShrink: 1,
  },

  userDescription: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    opacity: 0.8,
    flexShrink: 1,
  },

  userCity: {
    fontSize: 13,
    color: theme.colors.textPrimary,
    textAlign: 'left',
    flexShrink: 1,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    minWidth: 80,
    alignItems: 'center',
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },

  sparklineContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 2,
    height: 40,
  },

  sparklineBar: {
    width: 8,
    borderRadius: 2,
  },

  detailsButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    width: '100%',
    alignItems: 'center',
  },

  detailsButtonText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#FFFFFF',
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },

  saveButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
    opacity: 1,
    minWidth: 150,
  },
  
  saveButtonDisabled: {
    backgroundColor: theme.colors.disabled,
    opacity: 0.7,
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  
  // Styles pour la modale
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    width: '100%',
    maxWidth: 500,
    maxHeight: Dimensions.get('window').height * 0.8,
    overflow: 'hidden',
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: theme.colors.textPrimary,
  },
  
  closeButton: {
    padding: 4,
  },
  
  modalBody: {
    padding: 16,
  },
  
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  
  detailLabel: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  
  detailValue: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    fontWeight: '600',
    maxWidth: '60%',
    textAlign: 'right',
  },
  
  amount: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginTop: 16,
    marginBottom: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background,
  },
  
  itemInfo: {
    flex: 1,
    marginRight: 12,
  },
  
  itemName: {
    fontSize: 14,
    color: theme.colors.textPrimary,
    marginBottom: 4,
  },
  
  itemDetails: {
    fontSize: 12,
    color: theme.colors.textSecondary,
  },
  
  itemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  
  noItems: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    paddingVertical: 16,
  },
  
  notesContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  
  notesLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  
  notesText: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  
  modalFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  
  button: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  
  closeModalButton: {
    backgroundColor: theme.colors.background,
  },
  
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
});

export default ActiveUsers;


