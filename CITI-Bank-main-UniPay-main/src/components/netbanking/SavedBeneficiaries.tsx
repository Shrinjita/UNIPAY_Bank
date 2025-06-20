
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Beneficiary {
  id: string;
  accountNumber: string;
  ifscCode: string;
  name: string;
}

interface SavedBeneficiariesProps {
  beneficiaries: Beneficiary[];
  onBeneficiarySelect: (beneficiary: Beneficiary) => void;
}

const SavedBeneficiaries: React.FC<SavedBeneficiariesProps> = ({ 
  beneficiaries, 
  onBeneficiarySelect 
}) => {
  return (
    <Card className="mb-6 shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Saved Beneficiaries</CardTitle>
      </CardHeader>
      <CardContent>
        {beneficiaries.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No saved beneficiaries yet.</p>
            <p className="text-sm text-gray-400 mt-1">Add new transfers and save them for future use.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {beneficiaries.map((beneficiary) => (
              <div 
                key={beneficiary.id}
                className="p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                onClick={() => onBeneficiarySelect(beneficiary)}
              >
                <div className="flex justify-between items-center">
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-900">{beneficiary.name}</p>
                    <p className="text-sm text-gray-600">Account: {beneficiary.accountNumber}</p>
                    <p className="text-sm text-gray-600">IFSC: {beneficiary.ifscCode}</p>
                  </div>
                  <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                    Select
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SavedBeneficiaries;