import { auth } from './firebase';
import SettingsService from './settingsService';

/**
 * Service de génération de factures PDF professionnelles
 */
class InvoicePdfService {
  /**
   * Générer et imprimer une facture avec le format professionnel
   */
  static async generateAndPrintInvoice(invoice) {
    try {
      // Récupérer les paramètres utilisateur (logo, infos entreprise)
      const settingsResult = await SettingsService.getUserSettings();
      const settings = settingsResult.success ? settingsResult.settings : null;

      const businessInfo = settings?.businessInfo || {};
      const user = auth.currentUser;

      // Créer le HTML de la facture
      const htmlContent = this.createInvoiceHTML(invoice, businessInfo, user);

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
      console.error('Erreur génération facture:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Créer le HTML de la facture avec le format professionnel
   */
  static createInvoiceHTML(invoice, businessInfo, user) {
    const formatNumber = (num) => Math.round(num || 0).toLocaleString('fr-FR');
    const formatDate = (date) => {
      if (!date) return '-';
      return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    };

    // Calculer les totaux
    const subtotal = invoice.subtotal || 0;
    const discount = invoice.discount || 0;
    const tva = 0; // Peut être calculé si nécessaire (ex: subtotal * 0.18)
    const total = invoice.total || 0;

    // Logo (utiliser le logo de l'entreprise ou un placeholder)
    const logoUrl = businessInfo.logo || '';
    const hasLogo = !!logoUrl;

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <title>Facture ${invoice.invoiceNumber}</title>
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

            .invoice-container {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 40px;
              box-shadow: 0 0 10px rgba(0,0,0,0.1);
            }

            /* En-tête */
            .invoice-header {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              margin-bottom: 40px;
              padding-bottom: 20px;
              border-bottom: 2px solid #e5e7eb;
            }

            .invoice-title-section {
              flex: 1;
            }

            .invoice-title {
              font-size: 32px;
              font-weight: 700;
              color: #111827;
              margin-bottom: 10px;
              letter-spacing: 2px;
            }

            .invoice-subtitle {
              display: flex;
              gap: 15px;
              font-size: 11px;
              color: #6B7280;
            }

            .invoice-subtitle span {
              padding: 4px 12px;
              background: #F3F4F6;
              border-radius: 4px;
              text-transform: uppercase;
              font-weight: 600;
            }

            .invoice-logo {
              width: 100px;
              height: 100px;
              display: flex;
              align-items: center;
              justify-content: center;
            }

            .invoice-logo img {
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
            }

            .invoice-logo .logo-placeholder {
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
            .invoice-info {
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

            /* Tableau des produits */
            .invoice-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }

            .invoice-table thead {
              background-color: #F9FAFB;
            }

            .invoice-table th {
              padding: 12px 10px;
              text-align: left;
              font-size: 11px;
              color: #6B7280;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              font-weight: 700;
              border-bottom: 2px solid #E5E7EB;
            }

            .invoice-table th:last-child,
            .invoice-table td:last-child {
              text-align: right;
            }

            .invoice-table tbody tr {
              border-bottom: 1px solid #F3F4F6;
            }

            .invoice-table td {
              padding: 14px 10px;
              font-size: 13px;
              color: #374151;
            }

            .invoice-table td:first-child {
              font-weight: 500;
              color: #111827;
            }

            /* Totaux */
            .invoice-totals {
              margin-left: auto;
              width: 350px;
              margin-top: 20px;
            }

            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 10px 0;
              font-size: 13px;
              color: #374151;
            }

            .total-row.subtotal {
              border-bottom: 1px solid #F3F4F6;
            }

            .total-row.total {
              border-top: 2px solid #E5E7EB;
              padding-top: 15px;
              margin-top: 5px;
            }

            .total-row.total .label,
            .total-row.total .value {
              font-size: 18px;
              font-weight: 700;
              color: #111827;
            }

            .total-row .label {
              font-weight: 600;
            }

            .total-row .value {
              font-weight: 700;
              text-align: right;
              min-width: 120px;
            }

            /* Footer */
            .invoice-footer {
              margin-top: 50px;
              padding-top: 20px;
              border-top: 1px solid #E5E7EB;
              display: flex;
              justify-content: space-between;
              font-size: 11px;
              color: #6B7280;
            }

            .footer-section {
              flex: 1;
            }

            .footer-section p {
              margin: 4px 0;
            }

            .footer-section strong {
              color: #111827;
              display: block;
              margin-bottom: 8px;
              font-size: 12px;
            }

            /* Notes */
            .invoice-notes {
              margin-top: 30px;
              padding: 15px;
              background: #F9FAFB;
              border-radius: 6px;
              border-left: 3px solid #3B82F6;
            }

            .invoice-notes strong {
              display: block;
              font-size: 12px;
              color: #111827;
              margin-bottom: 8px;
            }

            .invoice-notes p {
              font-size: 12px;
              color: #6B7280;
              line-height: 1.6;
            }

            /* Impression */
            @media print {
              body {
                background: white;
                padding: 0;
              }

              .invoice-container {
                box-shadow: none;
                padding: 20px;
              }
            }
          </style>
        </head>
        <body>
          <div class="invoice-container">
            <!-- En-tête -->
            <div class="invoice-header">
              <div class="invoice-title-section">
                <div class="invoice-title">FACTURE</div>
                <div class="invoice-subtitle">
                  <span>Facture n° ${invoice.invoiceNumber || 'N/A'}</span>
                  <span>${formatDate(invoice.date)}</span>
                </div>
              </div>
              <div class="invoice-logo">
                ${hasLogo 
                  ? `<img src="${logoUrl}" alt="Logo" />` 
                  : `<div class="logo-placeholder">☀️</div>`
                }
              </div>
            </div>

            <!-- Informations -->
            <div class="invoice-info">
              <div class="info-section">
                <h3>À L'ATTENTION DE</h3>
                <p><strong>${invoice.customerName || 'Client'}</strong></p>
                ${invoice.customerAddress ? `<p>${invoice.customerAddress}</p>` : ''}
                ${invoice.customerPhone ? `<p>Tél: ${invoice.customerPhone}</p>` : ''}
                ${invoice.customerEmail ? `<p>Email: ${invoice.customerEmail}</p>` : ''}
              </div>
              <div class="info-section">
                <h3>FOURNISSEUR</h3>
                <p><strong>${businessInfo.businessName || user?.displayName || 'Entrepreneur Africa'}</strong></p>
                ${businessInfo.address ? `<p>${businessInfo.address}</p>` : ''}
                ${businessInfo.phone ? `<p>Tél: ${businessInfo.phone}</p>` : ''}
                ${businessInfo.email ? `<p>Email: ${businessInfo.email || user?.email || ''}</p>` : ''}
                ${businessInfo.taxId ? `<p>N° TVA: ${businessInfo.taxId}</p>` : ''}
              </div>
            </div>

            <!-- Tableau des produits -->
            <table class="invoice-table">
              <thead>
                <tr>
                  <th>DESCRIPTION</th>
                  <th style="text-align: center; width: 100px;">PRIX</th>
                  <th style="text-align: center; width: 100px;">QUANTITÉ</th>
                  <th style="width: 120px;">TOTAL</th>
                </tr>
              </thead>
              <tbody>
                ${invoice.items && invoice.items.length > 0 
                  ? invoice.items.map(item => `
                    <tr>
                      <td>${item.productName || 'Produit'}</td>
                      <td style="text-align: center;">${formatNumber(item.unitPrice)} FCFA</td>
                      <td style="text-align: center;">${item.quantity}</td>
                      <td>${formatNumber(item.total)} FCFA</td>
                    </tr>
                  `).join('')
                  : `<tr><td colspan="4" style="text-align: center; padding: 30px; color: #9CA3AF;">Aucun produit</td></tr>`
                }
              </tbody>
            </table>

            <!-- Totaux -->
            <div class="invoice-totals">
              <div class="total-row subtotal">
                <span class="label">Sous total:</span>
                <span class="value">${formatNumber(subtotal)} FCFA</span>
              </div>
              ${discount > 0 ? `
                <div class="total-row">
                  <span class="label">Remise:</span>
                  <span class="value">- ${formatNumber(discount)} FCFA</span>
                </div>
              ` : ''}
              <div class="total-row">
                <span class="label">TVA (0%):</span>
                <span class="value">${formatNumber(tva)} FCFA</span>
              </div>
              <div class="total-row total">
                <span class="label">TOTAL</span>
                <span class="value">${formatNumber(total)} FCFA</span>
              </div>
            </div>

            <!-- Notes -->
            ${invoice.notes ? `
              <div class="invoice-notes">
                <strong>Notes:</strong>
                <p>${invoice.notes}</p>
              </div>
            ` : ''}

            <!-- Footer -->
            <div class="invoice-footer">
              <div class="footer-section">
                <strong>Paiement à l'ordre de Carte Moula</strong>
                <p>N° compte: ${businessInfo.bankAccount || '0000 0000 0000 0000'}</p>
                <p>Code BIC: ${businessInfo.bicCode || 'XXXXXXXX'}</p>
              </div>
              <div class="footer-section" style="text-align: right;">
                <strong>Conditions de paiement</strong>
                <p>Paiement sous 30 jours</p>
                <p>Émise le ${formatDate(new Date())}</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  /**
   * Télécharger la facture en PDF (pour implémentation future avec jsPDF)
   */
  static async downloadInvoicePDF(invoice) {
    // TODO: Implémenter avec jsPDF si besoin
    return { success: false, error: 'Téléchargement PDF en cours de développement' };
  }
}

export default InvoicePdfService;

