import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  Platform,
  Dimensions,
  TextInput,
  Alert,
} from 'react-native';
import { useInvoices } from '../hooks/useInvoices';
import { useProducts } from '../hooks/useProducts';
import InvoiceModal from '../components/InvoiceModal';
import InvoiceDetailsModal from '../components/InvoiceDetailsModal';
import theme from '../styles/theme';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import InvoicePdfService from '../services/invoicePdfService';

const { width } = Dimensions.get('window');
const isMobile = width < 768;

const InvoicesScreen = ({ navigation }) => {
  const {
    invoices,
    stats,
    loading,
    refreshing,
    error,
    createInvoice,
    updateInvoice,
    updateStatus,
    deleteInvoice,
    refreshData,
  } = useInvoices();

  const { 
    allProducts, 
    loading: productsLoading,
    refreshProducts 
  } = useProducts();

  const [invoiceModalVisible, setInvoiceModalVisible] = useState(false);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  
  // Filtres avancés
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortBy, setSortBy] = useState('date-desc'); // date-desc, date-asc, amount-desc, amount-asc, number-desc, number-asc
  const [selectedInvoices, setSelectedInvoices] = useState([]);
  const [editingInvoice, setEditingInvoice] = useState(null);

  /**
   * Créer une nouvelle facture
   */
  const handleCreateInvoice = async (invoiceData) => {
    setSubmitting(true);

    try {
      let result;
      
      if (editingInvoice) {
        // Mise à jour d'une facture existante
        result = await updateInvoice(editingInvoice.id, invoiceData);
      } else {
        // Création d'une nouvelle facture
        result = await createInvoice(invoiceData);
      }

      if (result.success) {
        setInvoiceModalVisible(false);
        setEditingInvoice(null);
        await refreshProducts();
        
        const message = editingInvoice 
          ? `Facture ${result.invoice?.invoiceNumber || ''} mise à jour avec succès!`
          : `Facture ${result.invoiceNumber || ''} créée avec succès!`;
        
        if (Platform.OS === 'web') {
          alert(message);
        } else {
          Alert.alert('Succès', message);
        }
      } else {
        if (Platform.OS === 'web') {
          alert(`Erreur: ${result.error}`);
        } else {
          Alert.alert('Erreur', result.error);
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
      if (Platform.OS === 'web') {
        alert('Une erreur inattendue est survenue');
      } else {
        Alert.alert('Erreur', 'Une erreur inattendue est survenue');
      }
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Afficher les détails d'une facture
   */
  const handleShowDetails = (invoice) => {
    setSelectedInvoice(invoice);
    setDetailsModalVisible(true);
  };

  const toggleInvoiceSelection = (invoiceId) => {
    setSelectedInvoices(prev => 
      prev.includes(invoiceId) 
        ? [] // Désélectionner si déjà sélectionné
        : [invoiceId] // Sélectionner uniquement la nouvelle facture
    );
  };

  const handleViewSelected = () => {
    if (selectedInvoices.length === 1) {
      const invoice = invoices.find(inv => inv.id === selectedInvoices[0]);
      if (invoice) {
        handleShowDetails(invoice);
      }
    } else if (selectedInvoices.length > 1) {
      Alert.alert('Information', 'Veuillez sélectionner une seule facture à afficher');
    } else {
      Alert.alert('Information', 'Veuillez sélectionner une facture');
    }
  };

  const handleManage = () => {
    if (selectedInvoices.length === 1) {
      // Logique pour gérer la facture sélectionnée
      const invoice = invoices.find(inv => inv.id === selectedInvoices[0]);
      Alert.alert('Gérer', `Gestion de la facture ${invoice?.invoiceNumber}`);
    }
  };

  const handleEdit = () => {
    if (selectedInvoices.length === 1) {
      const invoice = invoices.find(inv => inv.id === selectedInvoices[0]);
      
      // Vérifier que la facture peut être modifiée
      if (invoice.status === 'paid' || invoice.status === 'cancelled' || invoice.transferred) {
        Alert.alert(
          'Modification impossible',
          'Les factures payées, annulées ou transférées ne peuvent pas être modifiées.'
        );
        return;
      }
      
      // Définir la facture en cours d'édition et ouvrir le modal
      setEditingInvoice(invoice);
      setInvoiceModalVisible(true);
      Alert.alert('Modifier', `Édition de la facture ${invoice?.invoiceNumber}`);
    }
  };

  const handleValidate = () => {
    if (selectedInvoices.length > 0) {
      // Logique pour valider les factures sélectionnées
      Alert.alert('Valider', `Validation de ${selectedInvoices.length} facture(s)`);
    }
  };

  const handleDelete = () => {
    if (selectedInvoices.length === 0) return;

    console.log('🗑️ handleDelete appelé avec les factures:', selectedInvoices);

    Alert.alert(
      'Supprimer les factures',
      `Êtes-vous sûr de vouloir supprimer ${selectedInvoices.length} facture(s) ? Cette action est irréversible.\n\nAttention : Même les factures payées ou transférées seront supprimées.`,
      [
        {
          text: 'Annuler',
          style: 'cancel',
        },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('🚀 Début de la suppression...');
              setSubmitting(true);
              
              // Supprimer chaque facture sélectionnée
              for (const invoiceId of selectedInvoices) {
                console.log('📋 Suppression de la facture:', invoiceId);
                const result = await deleteInvoice(invoiceId);
                console.log('📊 Résultat suppression:', result);
                if (!result.success) {
                  throw new Error(result.error || 'Erreur lors de la suppression');
                }
              }
              
              // Réinitialiser la sélection
              console.log('🔄 Réinitialisation de la sélection...');
              setSelectedInvoices([]);
              
              Alert.alert('Succès', `${selectedInvoices.length} facture(s) supprimée(s) avec succès`);
            } catch (error) {
              console.error('❌ Erreur lors de la suppression:', error);
              Alert.alert('Erreur', 'Une erreur est survenue lors de la suppression des factures');
            } finally {
              setSubmitting(false);
              console.log('✅ Opération de suppression terminée');
            }
          },
        },
      ]
    );
  };

  const handlePrintSelected = () => {
    if (selectedInvoices.length > 0) {
      // Logique pour imprimer les factures sélectionnées
      Alert.alert('Imprimer', `Impression de ${selectedInvoices.length} facture(s)`);
    }
  };

  const handleSchedules = () => {
    if (selectedInvoices.length > 0) {
      // Logique pour gérer les échéances des factures sélectionnées
      Alert.alert('Échéances', `Gestion des échéances pour ${selectedInvoices.length} facture(s)`);
    }
  };

  const handleTransfer = () => {
    if (selectedInvoices.length > 0) {
      // Logique pour transférer les factures sélectionnées
      Alert.alert('Transfert', `Transfert de ${selectedInvoices.length} facture(s) vers la comptabilité`);
    }
  };

  const handleSettle = () => {
    if (selectedInvoices.length > 0) {
      // Logique pour régler les factures sélectionnées
      Alert.alert('Règlement', `Règlement de ${selectedInvoices.length} facture(s)`);
    }
  };

  /**
   * Mettre à jour le statut
   */
  const handleUpdateStatus = async (invoiceId, status) => {
    const result = await updateStatus(invoiceId, status);
    
    if (result.success) {
      setDetailsModalVisible(false);
      setSelectedInvoice(null);
      
      if (Platform.OS === 'web') {
        alert('Statut mis à jour avec succès!');
      } else {
        Alert.alert('Succès', 'Statut mis à jour avec succès!');
      }
    } else {
      if (Platform.OS === 'web') {
        alert(`Erreur: ${result.error}`);
      } else {
        Alert.alert('Erreur', result.error);
      }
    }
  };

  /**
   * Export vers CSV
   */
  const exportToExcel = async () => {
    if (!filteredAndSortedInvoices || filteredAndSortedInvoices.length === 0) {
      Alert.alert('Information', 'Aucune facture à exporter');
      return;
    }

    try {
      // Préparer les données pour l'export
      const csvContent = [
        ['Numéro', 'Client', 'Date', 'Total HT', 'Remise', 'Total TTC', 'Montant réglé', 'Reste dû', 'Statut', 'Mode paiement'],
        ...filteredAndSortedInvoices.map((invoice) => {
          const paymentInfo = getPaymentInfo(invoice);
          return [
            invoice.invoiceNumber,
            invoice.customerName || 'Client',
            formatDate(invoice.date),
            invoice.subtotal || 0,
            invoice.discount || 0,
            invoice.total || 0,
            paymentInfo.paid,
            paymentInfo.remaining,
            invoice.status === 'paid' ? 'Payé' : invoice.status === 'unpaid' ? 'Non payé' : 'Annulé',
            invoice.paymentMethod || 'Espèces',
          ].map(field => `"${String(field).replace(/"/g, '""')}"`).join(',');
        })
      ].join('\n');

      // Créer un nom de fichier avec la date actuelle
      const fileName = `Factures_${new Date().toISOString().split('T')[0]}.csv`;
      const fileUri = `${FileSystem.documentDirectory}${fileName}`;

      // Écrire le fichier
      await FileSystem.writeAsStringAsync(fileUri, csvContent, {
        encoding: FileSystem.EncodingType.UTF8,
      });

      // Demander la permission d'accéder au stockage
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erreur', 'Permission requise pour enregistrer le fichier');
        return;
      }

      // Sauvegarder dans la galerie
      await MediaLibrary.saveToLibraryAsync(fileUri);
      
      // Partager le fichier
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'Exporter les factures',
        UTI: 'public.comma-separated-values-text'
      });

    } catch (error) {
      console.error('Erreur export CSV:', error);
      Alert.alert('Erreur', 'Erreur lors de l\'export des données');
    }
  };

  /**
   * Imprimer la liste
   */
  const printInvoiceList = () => {
    if (Platform.OS !== 'web') {
      Alert.alert('Information', 'Impression disponible uniquement sur web');
      return;
    }

    if (!filteredAndSortedInvoices || filteredAndSortedInvoices.length === 0) {
      alert('Aucune facture à imprimer');
      return;
    }

    // Créer une fenêtre d'impression
    const printWindow = window.open('', '_blank');
    
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Liste des Factures</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
            }
            h1 {
              text-align: center;
              color: #111827;
              margin-bottom: 10px;
            }
            .date {
              text-align: center;
              color: #6B7280;
              margin-bottom: 30px;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 20px;
            }
            th, td {
              border: 1px solid #D1D5DB;
              padding: 8px;
              text-align: left;
              font-size: 11px;
            }
            th {
              background-color: #F3F4F6;
              font-weight: bold;
              text-transform: uppercase;
            }
            tr:nth-child(even) {
              background-color: #F9FAFB;
            }
            .amount {
              text-align: right;
            }
            .paid {
              color: #059669;
              font-weight: bold;
            }
            .unpaid {
              color: #DC2626;
              font-weight: bold;
            }
            @media print {
              body {
                padding: 10px;
              }
            }
          </style>
        </head>
        <body>
          <h1>Liste des Factures</h1>
          <div class="date">Imprimé le ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}</div>
          <table>
            <thead>
              <tr>
                <th>Numéro</th>
                <th>Client</th>
                <th>Date</th>
                <th class="amount">Total HT</th>
                <th class="amount">Remise</th>
                <th class="amount">Total TTC</th>
                <th class="amount">Montant réglé</th>
                <th class="amount">Reste dû</th>
              </tr>
            </thead>
            <tbody>
              ${filteredAndSortedInvoices.map(invoice => {
                const paymentInfo = getPaymentInfo(invoice);
                return `
                  <tr>
                    <td><strong>${invoice.invoiceNumber}</strong></td>
                    <td>${invoice.customerName || 'Client'}</td>
                    <td>${formatDate(invoice.date)}</td>
                    <td class="amount">${formatNumber(invoice.subtotal || 0)}</td>
                    <td class="amount">${formatNumber(invoice.discount || 0)}</td>
                    <td class="amount"><strong>${formatNumber(invoice.total || 0)}</strong></td>
                    <td class="amount ${paymentInfo.paid > 0 ? 'paid' : ''}">${formatNumber(paymentInfo.paid)}</td>
                    <td class="amount ${paymentInfo.remaining > 0 ? 'unpaid' : ''}">${formatNumber(paymentInfo.remaining)}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Attendre le chargement puis imprimer
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  // Les gestionnaires d'actions sont définis plus haut dans le fichier

  /**
   * Calculer le montant réglé et le reste dû
   */
  const getPaymentInfo = (invoice) => {
    const total = invoice.total || 0;
    if (invoice.status === 'paid') {
      return { paid: total, remaining: 0 };
    } else if (invoice.status === 'unpaid') {
      return { paid: 0, remaining: total };
    } else if (invoice.status === 'cancelled') {
      return { paid: 0, remaining: 0 };
    }
    return { paid: 0, remaining: total };
  };

  /**
   * Formater les nombres
   */
  const formatNumber = (num) => {
    return Math.round(num || 0).toLocaleString('fr-FR');
  };

  /**
   * Formater la date
   */
  const formatDate = (date) => {
    if (!date) return '-';
    return new Date(date).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  /**
   * Filtrer et trier les factures
   */
  const filteredAndSortedInvoices = useMemo(() => {
    if (!invoices) return [];

    let filtered = [...invoices];

    // Filtre par recherche (numéro, client)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(inv => 
        inv.invoiceNumber.toLowerCase().includes(query) ||
        inv.customerName.toLowerCase().includes(query)
      );
    }

    // Filtre par période
    if (startDate) {
      const start = new Date(startDate);
      start.setHours(0, 0, 0, 0);
      filtered = filtered.filter(inv => {
        const invoiceDate = new Date(inv.date);
        return invoiceDate >= start;
      });
    }

    if (endDate) {
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter(inv => {
        const invoiceDate = new Date(inv.date);
        return invoiceDate <= end;
      });
    }

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.date) - new Date(a.date);
        case 'date-asc':
          return new Date(a.date) - new Date(b.date);
        case 'amount-desc':
          return (b.total || 0) - (a.total || 0);
        case 'amount-asc':
          return (a.total || 0) - (b.total || 0);
        case 'number-desc':
          return b.invoiceNumber.localeCompare(a.invoiceNumber);
        case 'number-asc':
          return a.invoiceNumber.localeCompare(b.invoiceNumber);
        default:
          return 0;
      }
    });

    return filtered;
  }, [invoices, searchQuery, startDate, endDate, sortBy]);

  if (loading || productsLoading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingContent}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.loadingText}>
            {loading ? 'Chargement des factures...' : 'Chargement des produits...'}
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={refreshData}>
          <Text style={styles.retryButtonText}>Réessayer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const hasInvoices = invoices && invoices.length > 0;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header avec titre et bouton */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Gestion des Factures</Text>
            <Text style={styles.headerSubtitle}>
              {filteredAndSortedInvoices.length} facture(s) • Total: {formatNumber(stats?.totalAmount || 0)} FCFA
            </Text>
          </View>
          <TouchableOpacity 
            style={[styles.createBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => {
              setEditingInvoice(null);
              setInvoiceModalVisible(true);
            }}
          >
            <Text style={styles.createBtnText}>+ Créer une facture</Text>
          </TouchableOpacity>
        </View>

        {/* Barre de filtres */}
        <View style={styles.filtersBar}>
          {/* Période */}
          <View style={styles.periodFilter}>
            <Text style={styles.filterLabel}>Période</Text>
            <View style={styles.dateInputs}>
              <View style={styles.dateInputWrapper}>
                <Text style={styles.dateLabel}>Du</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="jj/mm/aaaa"
                  value={startDate}
                  onChangeText={setStartDate}
                />
              </View>
              <Text style={styles.dateSeparator}>au</Text>
              <View style={styles.dateInputWrapper}>
                <Text style={styles.dateLabel}>au</Text>
                <TextInput
                  style={styles.dateInput}
                  placeholder="jj/mm/aaaa"
                  value={endDate}
                  onChangeText={setEndDate}
                />
              </View>
            </View>
          </View>

          {/* Recherche */}
          <View style={styles.searchFilter}>
            <Text style={styles.filterLabel}>Recherche:</Text>
            <View style={styles.searchBox}>
              <TextInput
                style={styles.searchInput}
                placeholder="Numéro, client..."
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
          </View>

          {/* Tri */}
          <View style={styles.sortFilter}>
            <Text style={styles.filterLabel}>Liste classée par:</Text>
            <View style={styles.sortBox}>
              <TouchableOpacity
                style={styles.sortDropdown}
                onPress={() => {
                  // Cycle entre les options de tri
                  const sortOptions = [
                    'date-desc',
                    'date-asc',
                    'amount-desc',
                    'amount-asc',
                    'number-desc',
                    'number-asc'
                  ];
                  const currentIndex = sortOptions.indexOf(sortBy);
                  const nextIndex = (currentIndex + 1) % sortOptions.length;
                  setSortBy(sortOptions[nextIndex]);
                }}
              >
                <Text style={styles.sortText}>
                  {sortBy === 'date-desc' && 'Date (récent → ancien)'}
                  {sortBy === 'date-asc' && 'Date (ancien → récent)'}
                  {sortBy === 'amount-desc' && 'Montant (élevé → faible)'}
                  {sortBy === 'amount-asc' && 'Montant (faible → élevé)'}
                  {sortBy === 'number-desc' && 'Numéro (Z → A)'}
                  {sortBy === 'number-asc' && 'Numéro (A → Z)'}
                </Text>
                <Text style={styles.dropdownIcon}>▼</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Boutons d'action */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.actionBtn} onPress={exportToExcel}>
              <Text style={styles.actionBtnText}>📊 Excel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} onPress={printInvoiceList}>
              <Text style={styles.actionBtnText}>🖨️ Impr. liste</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tableau des factures */}
        {hasInvoices && filteredAndSortedInvoices.length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={true} style={styles.tableScrollView}>
            <View style={styles.table}>
              {/* En-tête du tableau */}
              <View style={styles.tableHeader}>
                <View style={[styles.tableCell, styles.colCheckbox]}>
                  <Text style={styles.headerText}>☑</Text>
                </View>
                <View style={[styles.tableCell, styles.colNumero]}>
                  <Text style={styles.headerText}>Numéro</Text>
                </View>
                <View style={[styles.tableCell, styles.colClient]}>
                  <Text style={styles.headerText}>Client</Text>
                </View>
                <View style={[styles.tableCell, styles.colDate]}>
                  <Text style={styles.headerText}>Date</Text>
                </View>
                <View style={[styles.tableCell, styles.colAmount]}>
                  <Text style={styles.headerText}>Total HT</Text>
                </View>
                <View style={[styles.tableCell, styles.colAmount]}>
                  <Text style={styles.headerText}>Remise</Text>
                </View>
                <View style={[styles.tableCell, styles.colAmount]}>
                  <Text style={styles.headerText}>Total TTC</Text>
                </View>
                <View style={[styles.tableCell, styles.colAmount]}>
                  <Text style={styles.headerText}>Montant réglé</Text>
                </View>
                <View style={[styles.tableCell, styles.colAmount]}>
                  <Text style={styles.headerText}>Reste dû</Text>
                </View>
              </View>

              {/* Corps du tableau */}
              {filteredAndSortedInvoices.map((invoice, index) => {
                const paymentInfo = getPaymentInfo(invoice);
                const isSelected = selectedInvoices.includes(invoice.id);
                const isEven = index % 2 === 0;

                return (
                  <TouchableOpacity
                    key={invoice.id}
                    style={[
                      styles.tableRow,
                      isEven && styles.tableRowEven,
                      isSelected && styles.tableRowSelected
                    ]}
                    onPress={() => {
                      toggleInvoiceSelection(invoice.id);
                    }}
                    onLongPress={() => {
                      handleShowDetails(invoice);
                    }}
                  >
                    <View style={[styles.tableCell, styles.colCheckbox]}>
                      <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
                        {isSelected && <Text style={styles.checkmark}>✓</Text>}
                      </View>
                    </View>
                    <View style={[styles.tableCell, styles.colNumero]}>
                      <Text style={styles.cellTextBold}>{invoice.invoiceNumber}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.colClient]}>
                      <Text style={styles.cellText}>{invoice.customerName || 'Client'}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.colDate]}>
                      <Text style={styles.cellText}>{formatDate(invoice.date)}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.colAmount]}>
                      <Text style={styles.cellTextAmount}>{formatNumber(invoice.subtotal || 0)}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.colAmount]}>
                      <Text style={styles.cellTextAmount}>{formatNumber(invoice.discount || 0)}</Text>
                    </View>
                    <View style={[styles.tableCell, styles.colAmount]}>
                      <Text style={[styles.cellTextAmount, styles.cellTextBold]}>
                        {formatNumber(invoice.total || 0)}
                      </Text>
                    </View>
                    <View style={[styles.tableCell, styles.colAmount]}>
                      <Text style={[styles.cellTextAmount, paymentInfo.paid > 0 && styles.cellTextSuccess]}>
                        {formatNumber(paymentInfo.paid)}
                      </Text>
                    </View>
                    <View style={[styles.tableCell, styles.colAmount]}>
                      <Text style={[styles.cellTextAmount, paymentInfo.remaining > 0 && styles.cellTextDanger]}>
                        {formatNumber(paymentInfo.remaining)}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>📄</Text>
            <Text style={styles.emptyTitle}>
              {hasInvoices ? 'Aucune facture trouvée' : 'Aucune facture'}
            </Text>
            <Text style={styles.emptyText}>
              {hasInvoices 
                ? 'Essayez de modifier les filtres de recherche'
                : 'Créez votre première facture pour commencer'}
            </Text>
            {!hasInvoices && (
              <TouchableOpacity
                style={styles.emptyButton}
                onPress={() => {
                  setEditingInvoice(null);
                  setInvoiceModalVisible(true);
                }}
              >
                <Text style={styles.emptyButtonText}>Créer une facture</Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Barre d'actions en bas */}
        {hasInvoices && filteredAndSortedInvoices.length > 0 && (
          <View style={styles.bottomBar}>
            <TouchableOpacity 
              style={[styles.bottomBtn, selectedInvoices.length === 0 && styles.bottomBtnDisabled]} 
              onPress={handleViewSelected}
              disabled={selectedInvoices.length === 0}
            >
              <Text style={styles.bottomBtnText}>👁️ Voir</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.bottomBtn, selectedInvoices.length === 0 && styles.bottomBtnDisabled]} 
              onPress={handleManage}
              disabled={selectedInvoices.length === 0}
            >
              <Text style={styles.bottomBtnText}>📝 Gérer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.bottomBtn} 
              onPress={() => {
                setEditingInvoice(null);
                setInvoiceModalVisible(true);
              }}
            >
              <Text style={styles.bottomBtnText}>➕ Créer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.bottomBtn, selectedInvoices.length !== 1 && styles.bottomBtnDisabled]} 
              onPress={handleEdit}
              disabled={selectedInvoices.length !== 1}
            >
              <Text style={styles.bottomBtnText}>✏️ Modifier</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.bottomBtn, selectedInvoices.length === 0 && styles.bottomBtnDisabled]} 
              onPress={handleValidate}
              disabled={selectedInvoices.length === 0}
            >
              <Text style={styles.bottomBtnText}>✅ Valider</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.bottomBtn, selectedInvoices.length === 0 && styles.bottomBtnDisabled]} 
              onPress={handlePrintSelected}
              disabled={selectedInvoices.length === 0}
            >
              <Text style={styles.bottomBtnText}>🖨️ Imprimer</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.bottomBtn, selectedInvoices.length === 0 && styles.bottomBtnDisabled]} 
              onPress={handleSchedules}
              disabled={selectedInvoices.length === 0}
            >
              <Text style={styles.bottomBtnText}>📋 Échéances</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.bottomBtn, selectedInvoices.length === 0 && styles.bottomBtnDisabled]} 
              onPress={handleTransfer}
              disabled={selectedInvoices.length === 0}
            >
              <Text style={styles.bottomBtnText}>📊 Trf-cpla</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.bottomBtn, selectedInvoices.length === 0 && styles.bottomBtnDisabled]} 
              onPress={handleSettle}
              disabled={selectedInvoices.length === 0}
            >
              <Text style={styles.bottomBtnText}>⚙️ Régler</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[
                styles.bottomBtn, 
                styles.bottomBtnDelete,
                selectedInvoices.length === 0 && styles.bottomBtnDeleteDisabled
              ]} 
              onPress={handleDelete}
              disabled={selectedInvoices.length === 0}
            >
              <Text style={styles.bottomBtnText}>🗑️ Supprimer</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Modal de création de facture */}
      <InvoiceModal
        visible={invoiceModalVisible}
        onClose={() => {
          setInvoiceModalVisible(false);
          setEditingInvoice(null);
        }}
        onSubmit={handleCreateInvoice}
        products={allProducts}
        loading={submitting}
        editMode={!!editingInvoice}
        initialData={editingInvoice}
      />

      {/* Modal de détails */}
      <InvoiceDetailsModal
        visible={detailsModalVisible}
        onClose={() => {
          setDetailsModalVisible(false);
          setSelectedInvoice(null);
        }}
        invoice={selectedInvoice}
        onUpdateStatus={handleUpdateStatus}
        onPrint={(invoice) => {
          if (Platform.OS === 'web') {
            alert('Fonction d\'impression à venir avec jsPDF');
          } else {
            Alert.alert('Information', 'Fonction d\'impression disponible sur web');
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingBottom: isMobile ? 70 : 0, // Ajout d'un padding en bas pour la barre d'actions sur mobile
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    padding: 20,
  },
  loadingContent: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
    backgroundColor: '#fff',
    borderRadius: 10,
    width: '100%',
    maxWidth: 300,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#4B5563',
    textAlign: 'center',
  },
  loadingText: {
    marginTop: theme.spacing.lg,
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.textSecondary,
  },
  errorText: {
    fontSize: theme.fonts.sizes.lg,
    color: theme.colors.danger,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
  },
  retryButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: theme.fonts.sizes.lg,
    fontWeight: theme.fonts.weights.semibold,
  },

  // Header
  header: {
    flexDirection: isMobile ? 'column' : 'row',
    justifyContent: 'space-between',
    alignItems: isMobile ? 'flex-start' : 'center',
    padding: isMobile ? 12 : 16,
    backgroundColor: '#fff',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    gap: isMobile ? 12 : 0,
  },
  headerLeft: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#6B7280',
  },
  createButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: isMobile ? 16 : 20,
    paddingVertical: isMobile ? 8 : 10,
    borderRadius: 6,
    alignSelf: isMobile ? 'flex-end' : 'center',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },

  // Barre de filtres
  filtersBar: {
    backgroundColor: '#fff',
    padding: isMobile ? 8 : 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    gap: isMobile ? 10 : 12,
  },
  periodFilter: {
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'flex-start' : 'center',
    gap: 8,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    minWidth: 100,
  },
  dateInputs: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateLabel: {
    fontSize: 11,
    color: '#6B7280',
  },
  dateInput: {
    borderWidth: 1,
    minWidth: isMobile ? 90 : 100,
    padding: isMobile ? 4 : 6,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    fontSize: 12,
    minWidth: 100,
    backgroundColor: '#fff',
  },
  dateSeparator: {
    fontSize: 12,
    color: '#6B7280',
  },
  searchFilter: {
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'flex-start' : 'center',
    gap: 8,
  },
  searchBox: {
    flex: 1,
    maxWidth: 300,
  },
  searchInput: {
    flex: 1,
    height: isMobile ? 36 : 32,
    paddingHorizontal: 8,
    fontSize: isMobile ? 14 : 12,
    color: '#111827',
    minWidth: isMobile ? 180 : 200,
  },
  sortFilter: {
    flexDirection: isMobile ? 'column' : 'row',
    alignItems: isMobile ? 'flex-start' : 'center',
    gap: 8,
  },
  sortBox: {
    flex: 1,
    maxWidth: 300,
  },
  sortDropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: isMobile ? 4 : 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    minWidth: isMobile ? 160 : 180,
    maxWidth: isMobile ? '100%' : 'auto',
  },
  sortText: {
    fontSize: isMobile ? 11 : 12,
    color: '#111827',
    flexShrink: 1,
  },
  dropdownIcon: {
    fontSize: 10,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    justifyContent: isMobile ? 'space-between' : 'flex-start',
    width: isMobile ? '100%' : 'auto',
  },
  actionBtn: {
    paddingHorizontal: isMobile ? 10 : 12,
    paddingVertical: isMobile ? 5 : 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 4,
    flex: isMobile ? 1 : 0,
    alignItems: 'center',
    minWidth: isMobile ? '48%' : 'auto',
  },
  actionBtnText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },

  // Tableau
  tableScrollView: {
    backgroundColor: '#fff',
  },
  table: {
    minWidth: 1200,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#fff',
  },
  tableRowEven: {
    backgroundColor: '#F9FAFB',
  },
  tableRowSelected: {
    backgroundColor: '#DBEAFE',
  },
  tableCell: {
    paddingVertical: 10,
    paddingHorizontal: 8,
    justifyContent: 'center',
  },
  colCheckbox: {
    width: 40,
    alignItems: 'center',
  },
  colNumero: {
    width: 140,
  },
  colClient: {
    width: 200,
  },
  colDate: {
    width: 100,
  },
  colAmount: {
    width: 120,
    alignItems: 'flex-end',
  },
  headerText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#111827',
    textTransform: 'uppercase',
  },
  cellText: {
    fontSize: 12,
    color: '#374151',
  },
  cellTextBold: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  cellTextAmount: {
    fontSize: 12,
    color: '#374151',
    textAlign: 'right',
  },
  cellTextSuccess: {
    color: '#059669',
    fontWeight: '600',
  },
  cellTextDanger: {
    color: '#DC2626',
    fontWeight: '600',
  },
  checkbox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 3,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: theme.colors.primary,
  },
  checkmark: {
    fontSize: 10,
    color: theme.colors.primary,
    fontWeight: '700',
  },

  // Barre du bas
  bottomBar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 8,
    gap: 8,
    backgroundColor: '#F3F4F6',
    borderTopWidth: 2,
    borderTopColor: '#D1D5DB',
  },
  bottomBtn: {
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    minWidth: 90,
    alignItems: 'center',
  },
  bottomBtnDisabled: {
    opacity: 0.5,
  },
  bottomBtnDelete: {
    backgroundColor: '#FEE2E2',
    borderColor: '#FCA5A5',
  },
  bottomBtnDeleteDisabled: {
    opacity: 0.5,
  },
  bottomBtnText: {
    fontSize: 11,
    color: '#374151',
    fontWeight: '500',
  },

  // État vide
  emptyContainer: {
    padding: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 6,
  },
  emptyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default InvoicesScreen;
