import { auth } from './firebase';
import SettingsService from './settingsService';

/**
 * Service de génération de reçus de vente professionnels
 */
class ReceiptPdfService {
  /**
   * Générer et imprimer un reçu de vente avec le format professionnel
   */
  static async generateAndPrintReceipt(sale) {
    try {
      // Récupérer les paramètres utilisateur (logo, infos entreprise)
      const settingsResult = await SettingsService.getUserSettings();
      const settings = settingsResult.success ? settingsResult.settings : null;

      const businessInfo = settings?.businessInfo || {};
      const user = auth.currentUser;

      // Créer le HTML du reçu
      const htmlContent = this.createReceiptHTML(sale, businessInfo, user);

      // Ouvrir dans une nouvelle fenêtre et imprimer
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Attendre le chargement des images puis imprimer
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print();
        }, 500);
      };

      return { success: true };
    } catch (error) {
      console.error('Erreur génération reçu:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Créer le HTML du reçu avec le format professionnel
   */
  static createReceiptHTML(sale, businessInfo, user) {
    const formatNumber = (num) => Math.round(num || 0).toLocaleString('fr-FR');
    const formatDate = (date) => {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    };

    const formatTime = (date) => {
      if (!date) return '-';
      return new Date(date).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    // Calculer les totaux
    const unitPrice = sale.unitPrice || 0;
    const quantity = sale.quantity || 0;
    const total = sale.totalPrice || (unitPrice * quantity);
    const cost = sale.cost || 0;
    const profit = sale.profit || (total - cost);

    // Logo (utiliser le logo de l'entreprise ou un placeholder)
    const logoUrl = businessInfo.logo || '';
    const hasLogo = !!logoUrl;

    // Numéro de reçu (basé sur la date et l'ID)
    const receiptNumber = `REC-${new Date(sale.date || Date.now()).getFullYear()}${String(new Date(sale.date || Date.now()).getMonth() + 1).padStart(2, '0')}-${sale.id?.substring(0, 6).toUpperCase() || 'XXXXX'}`;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Reçu ${receiptNumber}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }

            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              padding: 40px;
              background-color: #f5f5f5;
            }

            .receipt-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }

            /* En-tête */
            .receipt-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #e5e7eb;
            }

            .receipt-title-section {
              flex: 1;
            }

            .receipt-title {
              font-size: 32px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 10px;
              letter-spacing: 2px;
            }

            .receipt-subtitle {
              display: flex;
              gap: 15px;
              font-size: 11px;
              color: #6B7280;
            }

            .receipt-subtitle span {
              padding: 4px 12px;
              background: #F3F4F6;
              border-radius: 4px;
              text-transform: uppercase;
              font-weight: 600;
            }

            .receipt-logo {
              width: 100px;
              height: 100px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .receipt-logo img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }

            .receipt-logo .logo-placeholder {
              width: 80px;
              height: 80px;
              border-radius: 50%;
              background: linear-gradient(135deg, #FCD34D 0%, #F59E0B 100%);
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 40px;
            }

            /* Informations */
            .receipt-info {
              display: flex;
              justify-content: space-between;
              margin-bottom: 40px;
            }

            .info-section {
              flex: 1;
            }

            .info-section h3 {
              font-size: 11px;
              color: #6B7280;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 12px;
              font-weight: 700;
            }

            .info-section p {
              font-size: 13px;
              color: #111827;
              margin: 6px 0;
              line-height: 1.6;
            }

            .info-section strong {
              font-weight: 600;
            }

            /* Détails de la vente */
            .sale-details {
              background: #F9FAFB;
              padding: 30px;
              border-radius: 8px;
              margin-bottom: 30px;
              border-left: 4px solid #3B82F6;
            }

            .sale-details h3 {
              font-size: 14px;
              color: #6B7280;
              text-transform: uppercase;
              letter-spacing: 1px;
              margin-bottom: 20px;
              font-weight: 700;
            }

            .sale-item {
              display: flex;
              justify-content: space-between;
              align-items: center;
              padding: 16px 0;
              border-bottom: 1px solid #E5E7EB;
            }

            .sale-item:last-child {
              border-bottom: none;
            }

            .sale-item-info {
              flex: 1;
            }

            .sale-item-name {
              font-size: 18px;
              font-weight: 600;
              color: #111827;
              margin-bottom: 6px;
            }

            .sale-item-details {
              font-size: 13px;
              color: #6B7280;
            }

            .sale-item-price {
              text-align: right;
            }

            .sale-item-price .unit {
              font-size: 12px;
              color: #6B7280;
              margin-bottom: 4px;
            }

            .sale-item-price .total {
              font-size: 24px;
              font-weight: 700;
              color: #111827;
            }

            /* Totaux */
            .receipt-totals {
              margin-left: auto;
              width: 350px;
              margin-top: 20px;
            }

            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 12px 0;
              font-size: 13px;
              color: #374151;
              border-bottom: 1px solid #F3F4F6;
            }

            .total-row.total {
              border-top: 2px solid #E5E7EB;
              border-bottom: none;
              padding-top: 20px;
              margin-top: 10px;
            }

            .total-row.total .label,
            .total-row.total .value {
              font-size: 20px;
              font-weight: 700;
              color: #111827;
            }

            .total-row .label {
              font-weight: 600;
            }

            .total-row .value {
              font-weight: 700;
              text-align: right;
              min-width: 150px;
            }

            .total-row.profit .value {
              color: #059669;
            }

            /* Stats */
            .receipt-stats {
              display: flex;
              gap: 20px;
              margin-top: 30px;
              padding: 20px;
              background: #F9FAFB;
              border-radius: 8px;
            }

            .stat-box {
              flex: 1;
              text-align: center;
            }

            .stat-label {
              font-size: 11px;
              color: #6B7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
            }

            .stat-value {
              font-size: 18px;
              font-weight: 700;
              color: #111827;
            }

            .stat-value.profit {
              color: #059669;
            }

            /* Footer */
            .receipt-footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #E5E7EB;
              text-align: center;
              font-size: 12px;
              color: #6B7280;
            }

            .receipt-footer strong {
              display: block;
              color: #111827;
              margin-bottom: 10px;
              font-size: 14px;
            }

            /* Impression */
            @media print {
              body {
                background: white;
                padding: 0;
              }

              .receipt-container {
                box-shadow: none;
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            <!-- En-tête -->
            <div class="receipt-header">
              <div class="receipt-title-section">
                <div class="receipt-title">REÇU DE VENTE</div>
                <div class="receipt-subtitle">
                  <span>N° ${receiptNumber}</span>
                  <span>${formatDate(sale.date)} • ${formatTime(sale.date)}</span>
                </div>
              </div>
              <div class="receipt-logo">
                ${hasLogo 
                  ? `<img src="${logoUrl}" alt="Logo" />` 
                  : `<div class="logo-placeholder">☀️</div>`
                }
              </div>
            </div>

            <!-- Informations -->
            <div class="receipt-info">
              <div class="info-section">
                <h3>VENDEUR</h3>
                <p><strong>${businessInfo.businessName || user?.displayName || 'Entrepreneur Africa'}</strong></p>
                ${businessInfo.address ? `<p>${businessInfo.address}</p>` : ''}
                ${businessInfo.phone ? `<p>Tél: ${businessInfo.phone}</p>` : ''}
                ${businessInfo.email ? `<p>Email: ${businessInfo.email || user?.email || ''}</p>` : ''}
              </div>
              <div class="info-section">
                <h3>INFORMATIONS DE VENTE</h3>
                <p><strong>Date:</strong> ${formatDate(sale.date)}</p>
                <p><strong>Heure:</strong> ${formatTime(sale.date)}</p>
                <p><strong>Catégorie:</strong> ${sale.category || 'Non catégorisé'}</p>
                ${sale.invoiceNumber ? `<p><strong>Facture:</strong> ${sale.invoiceNumber}</p>` : ''}
              </div>
            </div>

            <!-- Détails de la vente -->
            <div class="sale-details">
              <h3>Détails de la vente</h3>
              <div class="sale-item">
                <div class="sale-item-info">
                  <div class="sale-item-name">${sale.productName || 'Produit'}</div>
                  <div class="sale-item-details">
                    ${formatNumber(unitPrice)} FCFA × ${quantity} unité(s)
                  </div>
                </div>
                <div class="sale-item-price">
                  <div class="unit">${formatNumber(unitPrice)} FCFA/unité</div>
                  <div class="total">${formatNumber(total)} FCFA</div>
                </div>
              </div>
            </div>

            <!-- Totaux -->
            <div class="receipt-totals">
              <div class="total-row">
                <span class="label">Quantité vendue:</span>
                <span class="value">${quantity} unité(s)</span>
              </div>
              <div class="total-row">
                <span class="label">Prix unitaire:</span>
                <span class="value">${formatNumber(unitPrice)} FCFA</span>
              </div>
              ${cost > 0 ? `
                <div class="total-row">
                  <span class="label">Coût d'achat:</span>
                  <span class="value">${formatNumber(cost)} FCFA</span>
                </div>
                <div class="total-row profit">
                  <span class="label">Profit:</span>
                  <span class="value">+${formatNumber(profit)} FCFA</span>
                </div>
              ` : ''}
              <div class="total-row total">
                <span class="label">MONTANT TOTAL</span>
                <span class="value">${formatNumber(total)} FCFA</span>
              </div>
            </div>

            <!-- Stats -->
            ${cost > 0 ? `
              <div class="receipt-stats">
                <div class="stat-box">
                  <div class="stat-label">Coût total</div>
                  <div class="stat-value">${formatNumber(cost)} FCFA</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">Vente totale</div>
                  <div class="stat-value">${formatNumber(total)} FCFA</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">Profit réalisé</div>
                  <div class="stat-value profit">+${formatNumber(profit)} FCFA</div>
                </div>
                <div class="stat-box">
                  <div class="stat-label">Marge</div>
                  <div class="stat-value profit">${cost > 0 ? Math.round((profit / cost) * 100) : 0}%</div>
                </div>
              </div>
            ` : ''}

            <!-- Footer -->
            <div class="receipt-footer">
              <strong>Merci pour votre achat !</strong>
              <p>Ce reçu a été généré automatiquement le ${formatDate(new Date())} à ${formatTime(new Date())}</p>
              <p>${businessInfo.businessName || 'Entrepreneur Africa'} • ${businessInfo.phone || ''}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}

export default ReceiptPdfService;

