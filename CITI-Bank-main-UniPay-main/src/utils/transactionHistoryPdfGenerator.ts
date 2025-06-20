import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Transaction } from '@/types/transaction';

export function generateTransactionHistoryPDF(transactions: Transaction[]) {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('Transaction History', 14, 22);

  // Define table columns including Category and Notes
  const tableColumn = [
    'Date', 'Description', 'Merchant', 'Amount', 'Type', 'Status', 'Category', 'Notes'
  ];

  const tableRows: any[] = [];

  transactions.forEach(tx => {
    const formattedDate = tx.date
      ? (typeof tx.date === 'string' ? tx.date : new Date(tx.date).toLocaleDateString())
      : '';

    const amountNumber = Number(tx.amount);
    const amountStr = isNaN(amountNumber) ? '0.00' : amountNumber.toFixed(2);

    const txData = [
      formattedDate,
      tx.description || '',
      tx.merchant || '',
      amountStr,
      tx.status || '',
      tx.category || ''
    ];

    tableRows.push(txData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 30,
    styles: { fontSize: 8 },  // smaller font to fit more columns
    headStyles: { fillColor: [22, 160, 133] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    columnStyles: {
      7: { cellWidth: 50 },  // notes column wider for longer text
    },
    margin: { left: 14, right: 14 },
  });

  doc.save('transaction-history.pdf');
}
