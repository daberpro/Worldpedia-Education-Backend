import { InvoiceData } from '../types/payment.types';
import { formatCurrency, getStatusColor } from './payment-validator';

/**
 * Format date to readable format
 */
const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

/**
 * Generate HTML invoice
 */
export const generateInvoiceHTML = (invoice: InvoiceData): string => {
  const statusColor = getStatusColor(invoice.status);
  const statusText = invoice.status.toUpperCase();
  const colorMap: Record<string, string> = {
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    info: '#17a2b8',
    secondary: '#6c757d'
  };

  return `
<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Invoice ${invoice.invoiceId}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background: white;
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 40px;
      border-bottom: 2px solid #007bff;
      padding-bottom: 20px;
    }
    .company-info h1 {
      color: #007bff;
      font-size: 28px;
      margin-bottom: 5px;
    }
    .company-info p {
      color: #666;
      font-size: 14px;
    }
    .invoice-status {
      background: ${colorMap[statusColor]};
      color: white;
      padding: 10px 20px;
      border-radius: 5px;
      font-weight: bold;
      text-align: center;
    }
    .invoice-details {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .detail-group h3 {
      font-size: 12px;
      color: #999;
      text-transform: uppercase;
      margin-bottom: 10px;
      font-weight: 600;
    }
    .detail-group p {
      margin-bottom: 5px;
      font-size: 14px;
    }
    .detail-group strong {
      display: block;
      font-size: 16px;
      color: #333;
      margin-top: 5px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    table thead {
      background: #f8f9fa;
      border-top: 2px solid #007bff;
      border-bottom: 2px solid #007bff;
    }
    table th {
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }
    table td {
      padding: 12px;
      border-bottom: 1px solid #eee;
      font-size: 14px;
    }
    table tr:last-child td {
      border-bottom: 2px solid #007bff;
    }
    .text-right { text-align: right; }
    .summary {
      display: grid;
      grid-template-columns: 2fr 1fr;
      gap: 40px;
      margin-bottom: 40px;
    }
    .notes {
      background: #f8f9fa;
      padding: 15px;
      border-radius: 5px;
      font-size: 13px;
      color: #666;
    }
    .total-section {
      text-align: right;
    }
    .total-line {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 14px;
    }
    .total-line.subtotal { color: #666; }
    .total-line.discount { color: #28a745; }
    .total-line.tax { color: #666; }
    .total-line.total {
      border-top: 2px solid #007bff;
      padding-top: 12px;
      font-size: 18px;
      font-weight: bold;
      color: #007bff;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      padding-top: 20px;
      border-top: 1px solid #eee;
      font-size: 12px;
      color: #999;
    }
    @media print {
      body { background: white; }
      .container { padding: 20px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="company-info">
        <h1>Worldpedia</h1>
        <p>Education Platform</p>
      </div>
      <div class="invoice-status">${statusText}</div>
    </header>

    <div class="invoice-details">
      <div>
        <div class="detail-group">
          <h3>Invoice</h3>
          <strong>${invoice.invoiceId}</strong>
          <p>Order: ${invoice.orderId}</p>
        </div>
        <div class="detail-group">
          <h3>Date Issued</h3>
          <strong>${formatDate(invoice.createdAt)}</strong>
          ${invoice.paidAt ? `<p>Paid: ${formatDate(invoice.paidAt)}</p>` : ''}
        </div>
      </div>
      <div>
        <div class="detail-group">
          <h3>Bill To</h3>
          <strong>${invoice.customerName}</strong>
          <p>${invoice.customerEmail}</p>
        </div>
      </div>
    </div>

    <table>
      <thead>
        <tr>
          <th>Description</th>
          <th class="text-right">Quantity</th>
          <th class="text-right">Unit Price</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${invoice.items
          .map(
            (item) => `
        <tr>
          <td>${item.name}</td>
          <td class="text-right">${item.quantity}</td>
          <td class="text-right">${formatCurrency(item.price)}</td>
          <td class="text-right">${formatCurrency(item.subtotal)}</td>
        </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <div class="summary">
      <div class="notes">
        ${invoice.notes ? `<strong>Notes:</strong><p>${invoice.notes}</p>` : ''}
        <p style="margin-top: 10px;"><strong>Payment Method:</strong> ${invoice.paymentMethod || 'Not specified'}</p>
      </div>
      <div class="total-section">
        <div class="total-line subtotal">
          <span>Subtotal</span>
          <span>${formatCurrency(invoice.subtotal)}</span>
        </div>
        ${
          invoice.discount
            ? `
        <div class="total-line discount">
          <span>Discount</span>
          <span>-${formatCurrency(invoice.discount)}</span>
        </div>
        `
            : ''
        }
        <div class="total-line tax">
          <span>Tax (10%)</span>
          <span>${formatCurrency(invoice.tax)}</span>
        </div>
        <div class="total-line total">
          <span>Total</span>
          <span>${formatCurrency(invoice.total)}</span>
        </div>
      </div>
    </div>

    <div class="footer">
      <p>Thank you for your transaction!</p>
      <p>Worldpedia Education Platform | ${new Date().getFullYear()}</p>
    </div>
  </div>
</body>
</html>
  `;
};

/**
 * Generate plain text invoice
 */
export const generateInvoiceText = (invoice: InvoiceData): string => {
  let text = `
╔════════════════════════════════════════════════════════════════╗
║              WORLDPEDIA EDUCATION PLATFORM                    ║
║                    INVOICE RECEIPT                            ║
╚════════════════════════════════════════════════════════════════╝

INVOICE INFORMATION
────────────────────────────────────────────────────────────────
Invoice ID: ${invoice.invoiceId}
Order ID: ${invoice.orderId}
Status: ${invoice.status.toUpperCase()}
Created: ${formatDate(invoice.createdAt)}
${invoice.paidAt ? `Paid: ${formatDate(invoice.paidAt)}\n` : ''}

CUSTOMER INFORMATION
────────────────────────────────────────────────────────────────
Name: ${invoice.customerName}
Email: ${invoice.customerEmail}
Customer ID: ${invoice.customerId}

ITEMS
────────────────────────────────────────────────────────────────
`;

  invoice.items.forEach((item) => {
    text += `${item.name}
  Quantity: ${item.quantity} x ${formatCurrency(item.price)} = ${formatCurrency(item.subtotal)}
`;
  });

  text += `
SUMMARY
────────────────────────────────────────────────────────────────
Subtotal:        ${formatCurrency(invoice.subtotal)}
`;

  if (invoice.discount) {
    text += `Discount:        -${formatCurrency(invoice.discount)}
`;
  }

  text += `Tax (10%):       ${formatCurrency(invoice.tax)}
────────────────────────────────────────────────────────────────
TOTAL:           ${formatCurrency(invoice.total)}
────────────────────────────────────────────────────────────────

PAYMENT INFORMATION
────────────────────────────────────────────────────────────────
Payment Method: ${invoice.paymentMethod || 'Not specified'}
Transaction ID: ${invoice.transactionId}

${invoice.notes ? `NOTES\n────────────────────────────────────────────────────────────────\n${invoice.notes}\n` : ''}
════════════════════════════════════════════════════════════════

Thank you for your transaction!
Worldpedia Education Platform - ${new Date().getFullYear()}
`;

  return text;
};