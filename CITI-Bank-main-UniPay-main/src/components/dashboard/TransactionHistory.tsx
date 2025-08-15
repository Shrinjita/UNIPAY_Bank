import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTransactions } from '@/hooks/useTransactions';
import { useNavigate } from 'react-router-dom';
import { Transaction } from '@/types/transaction';
import TransactionFilters from './TransactionFilters';
import TransactionTable from './TransactionTable';
import TransactionExport from './TransactionExport';
import TransactionPagination from './TransactionPagination';

interface TransactionHistoryProps {
  onViewDetails: (transaction: Transaction) => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onViewDetails }) => {
  const { transactions } = useTransactions();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7days');
  const [transactionType, setTransactionType] = useState('all');
  const [amountRange, setAmountRange] = useState([0, 5000]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);

  // Function to apply all filters to the transactions
  const applyFilters = () => {
    let results = [...transactions];

    // Search filter
 if (searchQuery) {
  const query = searchQuery.toLowerCase();
  results = results.filter(tx =>
    (tx.description ?? '').toLowerCase().includes(query) ||
    (tx.merchant ?? '').toLowerCase().includes(query)
  );
}


    // Amount range filter
    results = results.filter(tx => {
      const amount = Math.abs(tx.amount);
      return amount >= amountRange[0] && amount <= amountRange[1];
    });

    // Date range filter
    if (dateRange !== 'all') {
      const today = new Date();
      const startDate = new Date();

      switch (dateRange) {
        case '7days':
          startDate.setDate(today.getDate() - 7);
          break;
        case '30days':
          startDate.setDate(today.getDate() - 30);
          break;
        case '90days':
          startDate.setDate(today.getDate() - 90);
          break;
        default:
          break;
      }

      results = results.filter(tx => {
        const txDate = new Date(tx.date);
        return txDate >= startDate && txDate <= today;
      });
    }

    setFilteredTransactions(results);
  };

  // Reset all filters and filtered transactions
  const resetFilters = () => {
    setSearchQuery('');
    setDateRange('7days');
    setTransactionType('all');
    setAmountRange([0, 5000]);
    setFilteredTransactions(transactions);
  };

  // Apply filters whenever transactions or any filter state changes
  useEffect(() => {
    applyFilters();
  }, [transactions, searchQuery, dateRange, transactionType, amountRange]);

  return (
    <Card className="mb-8">
      <CardContent className="p-0">
        <div className="p-5 border-b border-gray-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-2xl font-semibold">Transaction History</h2>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => navigate('/transactions')}
                variant="outline"
                size="sm"
                className="flex items-center gap-1 transition-all duration-200 hover:bg-blue-50 hover:border-blue-300"
              >
                Go to Transactions
              </Button>

              <TransactionExport transactions={filteredTransactions} />
            </div>
          </div>

          <TransactionFilters
            searchQuery={searchQuery}
            dateRange={dateRange}
            transactionType={transactionType}
            amountRange={amountRange}
            onSearchChange={setSearchQuery}
            onDateRangeChange={setDateRange}
            onTransactionTypeChange={setTransactionType}
            onAmountRangeChange={setAmountRange}
            onApplyFilters={applyFilters}
            onResetFilters={resetFilters}
          />
        </div>

        <TransactionTable
          // transactions={filteredTransactions}
          onViewDetails={onViewDetails}
        />

        <TransactionPagination
          filteredCount={filteredTransactions.length}
          totalCount={transactions.length}
        />
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;
