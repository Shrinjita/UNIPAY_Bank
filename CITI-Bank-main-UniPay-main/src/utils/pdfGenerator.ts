import jsPDF from 'jspdf';
import { Transaction } from '@/types/transaction';

export const generateTransactionPDF = (transaction: Transaction) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(20);
  doc.setTextColor(139, 92, 246); // Purple
  doc.text('UNIPAY', 20, 30);

  doc.setFontSize(12);
  doc.setTextColor(0, 0, 0);
  doc.text('Transaction Receipt', 20, 40);

  // Timestamp
  doc.setFontSize(10);
  doc.text('Receipt Generated On: ' + new Date().toLocaleString(), 20, 55);

  // Divider
  doc.line(20, 65, 190, 65);

  // Section Header
  doc.setFontSize(12);
  doc.text('TRANSACTION DETAILS', 20, 80);

  // Transaction Info
  doc.setFontSize(10);
  const details = [

    ['Date & Time:', `${new Date(transaction.date).toLocaleDateString()} ${transaction.time}`],
    ['Description:', transaction.description],
    ['Merchant:', transaction.merchant],
    ['Amount:', `$${Math.abs(transaction.amount).toLocaleString()}`],
 
    ['Category:', transaction.category],
    ['Status:', transaction.status],
 
  ];

  let yPosition = 95;

  details.forEach(([label, value]) => {
    const displayValue =
      value instanceof Date
        ? value.toLocaleString()
        : typeof value === 'object' && value !== null
        ? JSON.stringify(value)
        : String(value ?? 'N/A');

    doc.text(label, 20, yPosition);
    doc.text(displayValue, 70, yPosition);
    yPosition += 10;
  });

  // Amount Highlight
  doc.setFontSize(14);
  if (transaction.amount >= 0) {
    doc.setTextColor(34, 197, 94); // Green
  } else {
    doc.setTextColor(239, 68, 68); // Red
  }
  doc.text(
    `${transaction.amount >= 0 ? 'CREDITED' : 'DEBITED'}: ₹${Math.abs(transaction.amount).toLocaleString()}`,
    20,
    yPosition + 20
  );

  // Footer
  doc.setFontSize(8);
  doc.setTextColor(128, 128, 128);
  doc.text('This is a system-generated receipt. No signature required.', 20, 250);
  doc.text('For queries, contact: support@unipay.com | 1800-123-4567', 20, 260);
  doc.text('UniPay Financial Services Pvt. Ltd. | CIN: U74999DL2023PTC123456', 20, 270);

  // Download
  doc.save(`UniPay-Receipt-${transaction.description}.pdf`);
};
