
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CreditCard, Wallet, PiggyBank, Building } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface AccountData {
  id: string;
  type: 'Savings' | 'Checking' | 'Credit Card' | 'Investment';
  name: string;
  currentBalance: number;
  availableBalance: number;
  accountNumber: string;
}

const mockAccounts: AccountData[] = [
  {
    id: '1',
    type: 'Savings',
    name: 'Personal Savings',
    currentBalance: 12845.67,
    availableBalance: 12420.30,
    accountNumber: '****5678',
  },
  {
    id: '2',
    type: 'Checking',
    name: 'Primary Checking',
    currentBalance: 2560.42,
    availableBalance: 2460.42,
    accountNumber: '****9012',
  },
  {
    id: '3',
    type: 'Credit Card',
    name: 'Platinum Rewards Card',
    currentBalance: -420.84,
    availableBalance: 9579.16,
    accountNumber: '****3456',
  },
  {
    id: '4',
    type: 'Investment',
    name: 'Stock Portfolio',
    currentBalance: 32560.18,
    availableBalance: 32560.18,
    accountNumber: '****7890',
  },
];

const getAccountIcon = (type: string) => {
  switch (type) {
    case 'Savings':
      return <PiggyBank className="h-6 w-6 text-primary" />;
    case 'Checking':
      return <Wallet className="h-6 w-6 text-primary" />;
    case 'Credit Card':
      return <CreditCard className="h-6 w-6 text-primary" />;
    case 'Investment':
      return <Building className="h-6 w-6 text-primary" />;
    default:
      return <CreditCard className="h-6 w-6 text-primary" />;
  }
};

const AccountOverview: React.FC = () => {
  return (
    <div className="mb-8">
      <h2 className="text-2xl font-semibold mb-4">Account Overview</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {mockAccounts.map((account) => (
          <Card key={account.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {getAccountIcon(account.type)}
                  <h3 className="font-medium">{account.name}</h3>
                </div>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                  {account.type}
                </span>
              </div>
              
              <div className="space-y-3">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Current Balance</span>
                        <span className={`font-semibold ${account.currentBalance < 0 ? 'text-red-600' : 'text-gray-900'}`}>
                          ${Math.abs(account.currentBalance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          {account.currentBalance < 0 ? ' CR' : ''}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-60 text-sm">Current balance reflects all posted transactions to your account.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm">Available Balance</span>
                        <span className="font-semibold">
                          ${account.availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-60 text-sm">Available balance is the amount currently available for spending or withdrawal, excluding pending transactions.</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm">Account Number</span>
                  <span className="font-mono">{account.accountNumber}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AccountOverview;