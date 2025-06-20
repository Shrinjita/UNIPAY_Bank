
import React, { useState } from 'react';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import StatsCard from '@/components/dashboard/StatsCard';
import AnalyticsCard from '@/components/dashboard/AnalyticsCard';
import AccountOverview from '@/components/dashboard/AccountOverview';
import PaymentsSection from '@/components/dashboard/PaymentsSection';
import TransactionHistory from '@/components/dashboard/TransactionHistory';
import TransactionDetails from '@/components/dashboard/TransactionDetails';
import ChatBot from '@/components/dashboard/ChatBot';
import { Transaction } from '@/types/transaction';
import { CreditCard, ShoppingBag, MessageSquare, PieChart, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleViewTransaction = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsTransactionModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <div className="container py-8">
        {/* Quick Actions
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <Button onClick={() => navigate('/transactions')} className="flex items-center gap-2">
              Go to Transactions
              <ArrowRight size={16} />
            </Button>
          </div>
        </div> */}

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Monthly Payments"
            value="$2,456.89"
            change={{
              value: "$245.12",
              percentage: "12%",
              positive: true
            }}
            icon={<CreditCard size={20} />}
          />
          
          <StatsCard 
            title="Shopping Spend"
            value="$840.50"
            change={{
              value: "$52.32",
              percentage: "6%",
              positive: false
            }}
            icon={<ShoppingBag size={20} />}
          />
          
          <StatsCard 
            title="New Messages"
            value="24"
            icon={<MessageSquare size={20} />}
          />
          
          <StatsCard 
            title="Analytics Views"
            value="856"
            change={{
              value: "124",
              percentage: "17%",
              positive: true
            }}
            icon={<PieChart size={20} />}
          />
        </div> */}
        
        {/* Payments Section */}
        <PaymentsSection />
        
        {/* Account Overview Section
        <AccountOverview /> */}
        
        {/* Transaction History Section */}
        <TransactionHistory onViewDetails={handleViewTransaction} />
        
        {/* Analytics Card Section */}
        <div className="mb-8">
          <AnalyticsCard />
        </div>
        
        {/* Transaction Details Modal */}
        <TransactionDetails 
          transaction={selectedTransaction}
          open={isTransactionModalOpen}
          onClose={() => setIsTransactionModalOpen(false)}
        />
      </div>
      
      {/* Chat Bot */}
      <ChatBot />
    </div>
  );
};

export default Dashboard;