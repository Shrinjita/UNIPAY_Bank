import React from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Transaction } from '@/types/transaction';
import { generateTransactionHistoryPDF } from '@/utils/transactionHistoryPdfGenerator';

interface TransactionExportProps {
  transactions: Transaction[];
}

const TransactionExport: React.FC<TransactionExportProps> = ({ transactions }) => {
  const handleExportPDF = () => {
    generateTransactionHistoryPDF(transactions);
  };

  return (
    <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={handleExportPDF} type="button">
      <Download size={16} />
      <span>Export as PDF</span>
    </Button>
  );
};

export default TransactionExport;
