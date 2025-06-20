import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Smartphone, Clock, Download
} from 'lucide-react';

import { TransactionModal } from '@/components/transactions/TransactionModal';
import { ScheduleTransactionModal } from '@/components/transactions/ScheduleTransactionModal';
import { PaymentMethodModal } from '@/components/transactions/PaymentMethodModal';
import { useTransactions } from '@/hooks/useTransactions';
import { generateTransactionPDF } from '@/utils/pdfGenerator';
import { Transaction } from '@/types/transaction';

const Transactions = () => {
  const navigate = useNavigate();
  const {
    transactions,
    addTransaction,
    updateTransaction,
    loading
  } = useTransactions();

  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  const handleDownloadPDF = (transaction: Transaction) => {
    generateTransactionPDF(transaction);
  };

  const handleSimulateTransaction = async () => {
    const mockTransactions = [
      {
        merchant: 'Amazon India',
        amount: -1299.99,
        type: 'Purchase',
        category: 'Shopping',
        description: 'Online Shopping - Electronics'
      },
      {
        merchant: 'Starbucks',
        amount: -450.00,
        type: 'Payment',
        category: 'Food & Dining',
        description: 'Coffee Purchase'
      },
      {
        merchant: 'Salary Credit',
        amount: 75000.00,
        type: 'Income',
        category: 'Salary',
        description: 'Monthly Salary Deposit'
      }
    ];

    const randomTransaction = mockTransactions[Math.floor(Math.random() * mockTransactions.length)];

    const newTransaction: Transaction = {
      id: `tx-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      merchant: randomTransaction.merchant,
      amount: randomTransaction.amount,
      category: randomTransaction.category,
      description: randomTransaction.description,
      status: 'Completed'
    };

    await addTransaction(newTransaction);
  };

  const filterTransactions = (tab: string) => {
    switch (tab) {
      case 'completed':
        return transactions.filter(t => t.status === 'Completed');
      case 'scheduled':
        return transactions.filter(t => t.status === 'Scheduled');
      case 'payment':
        return transactions.filter(t => t.type === 'Payment');
      case 'transfer':
        return transactions.filter(t => t.type === 'Transfer');
      case 'all':
      default:
        return transactions;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={20} />
            </Button>
            <div>
              <h1 className="text-3xl font-bold">Transactions</h1>
              <p className="text-gray-600">Manage your payments and transfers</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setIsPaymentModalOpen(true)}>
              <Smartphone size={16} className="mr-2" />
              Quick Pay
            </Button>
            <Button variant="outline" onClick={() => setIsScheduleModalOpen(true)}>
              <Clock size={16} className="mr-2" />
              Schedule
            </Button>
            <Button onClick={handleSimulateTransaction}>
              Refresh transaction
            </Button>
          </div>
        </div>
      </div>

      {/* Security Banner */}
      <div className="bg-green-50 border-b border-green-200">
        <div className="container py-2">
          <div className="flex items-center justify-center gap-2 text-green-800 text-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>🔒 All data is encrypted and follows RBI compliance guidelines</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-medium text-gray-600">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{transactions.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-medium text-gray-600">This Month</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {transactions
                  .filter(t => Number(t.amount) > 0)
                  .reduce((sum, t) => sum + Number(t.amount), 0)
                  .toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-medium text-gray-600">Revenue Simulation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">₹10,000</div>
              <p className="text-xs text-gray-500">Cross-sell revenue (Demo)</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
                <TabsTrigger value="payment">Payments</TabsTrigger>
                <TabsTrigger value="transfer">Transfers</TabsTrigger>
              </TabsList>

              {['all', 'completed', 'scheduled', 'payment', 'transfer'].map(tab => (
                <TabsContent key={tab} value={tab} className="mt-4">
                  <div className="space-y-4">
                    {loading ? (
                      <div className="text-center py-8 text-gray-500">Loading transactions...</div>
                    ) : filterTransactions(tab).length === 0 ? (
                      <div className="text-center py-8 text-gray-500">No transactions found</div>
                    ) : (
                      filterTransactions(tab).map(transaction => (
                        <div
                          key={transaction.id}
                          className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                          onClick={() => {
                            setSelectedTransaction(transaction);
                            setIsTransactionModalOpen(true);
                          }}
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                              💸
                            </div>
                            <div>
                              <div className="font-medium">{transaction.description}</div>
                              <div className="text-sm text-gray-500">{transaction.merchant}</div>
                              <div className="text-xs text-gray-400">
                                {new Date(transaction.date).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-medium ${transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {transaction.amount >= 0 ? '+' : '-'}₹{Math.abs(transaction.amount).toLocaleString()}
                            </div>
                            <div className="flex items-center justify-end gap-2 mt-1">
                              <Badge
                                variant={
                                  transaction.status === 'Completed'
                                    ? 'default'
                                    : transaction.status === 'Pending'
                                    ? 'secondary'
                                    : 'outline'
                                }
                                className="text-xs"
                              >
                                {transaction.status}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDownloadPDF(transaction);
                                }}
                              >
                                <Download size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Modals */}
      <TransactionModal
        transaction={selectedTransaction}
        open={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        onDownloadPDF={handleDownloadPDF}
      />

      <ScheduleTransactionModal
        open={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onSchedule={addTransaction}
      />

      <PaymentMethodModal
        open={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        onTransaction={addTransaction}
      />
    </div>
  );
};

export default Transactions;
