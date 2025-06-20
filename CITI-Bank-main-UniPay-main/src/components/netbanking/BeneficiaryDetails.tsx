
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BeneficiaryDetailsProps {
  accountNumber: string;
  reenterAccountNumber: string;
  ifscCode: string;
  beneficiaryName: string;
  onAccountNumberChange: (value: string) => void;
  onReenterAccountNumberChange: (value: string) => void;
  onIfscCodeChange: (value: string) => void;
  onBeneficiaryNameChange: (value: string) => void;
}

const BeneficiaryDetails: React.FC<BeneficiaryDetailsProps> = ({
  accountNumber,
  reenterAccountNumber,
  ifscCode,
  beneficiaryName,
  onAccountNumberChange,
  onReenterAccountNumberChange,
  onIfscCodeChange,
  onBeneficiaryNameChange
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg text-blue-600">Beneficiary Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="accountNumber" className="text-sm font-medium text-gray-700">Account Number</Label>
            <Input
              id="accountNumber"
              placeholder="Enter beneficiary account number"
              value={accountNumber}
              onChange={(e) => onAccountNumberChange(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reenterAccountNumber" className="text-sm font-medium text-gray-700">Re-enter Account Number</Label>
            <Input
              id="reenterAccountNumber"
              placeholder="Confirm account number"
              value={reenterAccountNumber}
              onChange={(e) => onReenterAccountNumberChange(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="ifscCode" className="text-sm font-medium text-gray-700">IFSC Code</Label>
            <Input
              id="ifscCode"
              placeholder="Enter IFSC code (e.g., HDFC0000123)"
              value={ifscCode}
              onChange={(e) => onIfscCodeChange(e.target.value)}
              required
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="beneficiaryName" className="text-sm font-medium text-gray-700">Beneficiary Name</Label>
            <Input
              id="beneficiaryName"
              placeholder="Enter full name as per bank account"
              value={beneficiaryName}
              onChange={(e) => onBeneficiaryNameChange(e.target.value)}
              required
              className="h-11"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default BeneficiaryDetails;