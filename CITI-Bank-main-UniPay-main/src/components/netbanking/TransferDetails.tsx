
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TransferDetailsProps {
  fromAccount: string;
  amount: string;
  onFromAccountChange: (value: string) => void;
  onAmountChange: (value: string) => void;
}

const TransferDetails: React.FC<TransferDetailsProps> = ({
  fromAccount,
  amount,
  onFromAccountChange,
  onAmountChange
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-gray-900">Transfer Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fromAccount" className="text-sm font-medium text-gray-700">From Account</Label>
            <Select value={fromAccount} onValueChange={onFromAccountChange}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select your account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings-1234">Savings Account - ****1234</SelectItem>
                <SelectItem value="current-5678">Current Account - ****5678</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount" className="text-sm font-medium text-gray-700">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter transfer amount"
              value={amount}
              onChange={(e) => onAmountChange(e.target.value)}
              required
              className="h-11"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TransferDetails;