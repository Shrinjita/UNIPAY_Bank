import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface Beneficiary {
  id: string;
  accountNumber: string;
  ifscCode: string;
  name: string;
}

const FundTransfer = () => {
  const [formData, setFormData] = useState({
    fromAccount: '',
    amount: '',
    accountNumber: '',
    reenterAccountNumber: '',
    ifscCode: '',
    beneficiaryName: '',
    transferType: '',
    purpose: '',
    remarks: '',
    saveAsBeneficiary: false
  });
  
  const [savedBeneficiaries, setSavedBeneficiaries] = useState<Beneficiary[]>([]);
  const [showSavedBeneficiaries, setShowSavedBeneficiaries] = useState(false);
  const { toast } = useToast();

  // Load saved beneficiaries from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem('savedBeneficiaries');
    if (saved) {
      setSavedBeneficiaries(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    setFormData(prev => ({
      ...prev,
      accountNumber: beneficiary.accountNumber,
      reenterAccountNumber: beneficiary.accountNumber,
      ifscCode: beneficiary.ifscCode,
      beneficiaryName: beneficiary.name
    }));
    setShowSavedBeneficiaries(false);
  };

  const saveBeneficiary = () => {
    if (formData.accountNumber && formData.ifscCode && formData.beneficiaryName) {
      const newBeneficiary: Beneficiary = {
        id: Date.now().toString(),
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        name: formData.beneficiaryName
      };
      
      const updatedBeneficiaries = [...savedBeneficiaries, newBeneficiary];
      setSavedBeneficiaries(updatedBeneficiaries);
      localStorage.setItem('savedBeneficiaries', JSON.stringify(updatedBeneficiaries));
      
      toast({
        title: "Beneficiary Saved",
        description: "Beneficiary details have been saved for future transfers.",
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (formData.accountNumber !== formData.reenterAccountNumber) {
      toast({
        title: "Error",
        description: "Account numbers do not match.",
        variant: "destructive"
      });
      return;
    }

    // Save beneficiary if checkbox is checked
    if (formData.saveAsBeneficiary) {
      saveBeneficiary();
    }

    toast({
      title: "Transfer Initiated",
      description: `₹${formData.amount} transfer to ${formData.beneficiaryName} has been initiated.`,
    });

    console.log('Transfer submitted:', formData);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fund Transfer</h1>
          <p className="text-gray-600">Transfer funds to other accounts securely</p>
        </div>
        <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
          Demo Transaction
        </span>
      </div>

      {/* Transfer Type Buttons */}
      <div className="flex space-x-4">
        <Button 
          variant={!showSavedBeneficiaries ? "default" : "outline"}
          onClick={() => setShowSavedBeneficiaries(false)}
          className="bg-gradient-purple hover:opacity-90"
        >
          New Transfer
        </Button>
        <Button 
          variant={showSavedBeneficiaries ? "default" : "outline"}
          onClick={() => setShowSavedBeneficiaries(true)}
          className={showSavedBeneficiaries ? "bg-gradient-purple hover:opacity-90" : ""}
        >
          Saved Beneficiaries
        </Button>
      </div>

      {/* Saved Beneficiaries List */}
      {showSavedBeneficiaries && (
        <Card>
          <CardHeader>
            <CardTitle>Saved Beneficiaries</CardTitle>
          </CardHeader>
          <CardContent>
            {savedBeneficiaries.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No saved beneficiaries yet.</p>
            ) : (
              <div className="space-y-3">
                {savedBeneficiaries.map((beneficiary) => (
                  <div 
                    key={beneficiary.id}
                    className="p-4 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => handleBeneficiarySelect(beneficiary)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium">{beneficiary.name}</p>
                        <p className="text-sm text-gray-600">A/C: {beneficiary.accountNumber}</p>
                        <p className="text-sm text-gray-600">IFSC: {beneficiary.ifscCode}</p>
                      </div>
                      <Button size="sm" className="bg-gradient-purple hover:opacity-90">
                        Select
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Transfer Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* From Account and Amount */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fromAccount">From Account</Label>
            <Select value={formData.fromAccount} onValueChange={(value) => handleInputChange('fromAccount', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select account" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="savings-1234">Savings Account - XXXX1234</SelectItem>
                <SelectItem value="current-5678">Current Account - XXXX5678</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount (₹)</Label>
            <Input
              id="amount"
              type="number"
              placeholder="Enter amount"
              value={formData.amount}
              onChange={(e) => handleInputChange('amount', e.target.value)}
              required
            />
          </div>
        </div>

        {/* Beneficiary Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-600">Beneficiary Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  placeholder="Enter account number"
                  value={formData.accountNumber}
                  onChange={(e) => handleInputChange('accountNumber', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reenterAccountNumber">Re-enter Account Number</Label>
                <Input
                  id="reenterAccountNumber"
                  placeholder="Re-enter account number"
                  value={formData.reenterAccountNumber}
                  onChange={(e) => handleInputChange('reenterAccountNumber', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ifscCode">IFSC Code</Label>
                <Input
                  id="ifscCode"
                  placeholder="Enter IFSC code"
                  value={formData.ifscCode}
                  onChange={(e) => handleInputChange('ifscCode', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="beneficiaryName">Beneficiary Name</Label>
                <Input
                  id="beneficiaryName"
                  placeholder="Enter beneficiary name"
                  value={formData.beneficiaryName}
                  onChange={(e) => handleInputChange('beneficiaryName', e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transfer Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg text-blue-600">Transfer Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transferType">Transfer Type</Label>
                <Select value={formData.transferType} onValueChange={(value) => handleInputChange('transferType', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select transfer type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="neft">NEFT</SelectItem>
                    <SelectItem value="rtgs">RTGS</SelectItem>
                    <SelectItem value="imps">IMPS</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="purpose">Purpose</Label>
                <Select value={formData.purpose} onValueChange={(value) => handleInputChange('purpose', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select purpose" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="family-maintenance">Family Maintenance</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="business">Business</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="remarks">Remarks (Optional)</Label>
              <Textarea
                id="remarks"
                placeholder="Add remarks"
                value={formData.remarks}
                onChange={(e) => handleInputChange('remarks', e.target.value)}
                rows={3}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="saveAsBeneficiary"
                checked={formData.saveAsBeneficiary}
                onCheckedChange={(checked) => handleInputChange('saveAsBeneficiary', checked as boolean)}
              />
              <Label htmlFor="saveAsBeneficiary" className="text-sm">
                Save as beneficiary for future transfers
              </Label>
            </div>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="flex justify-center">
          <Button 
            type="submit" 
            className="px-8 py-3 bg-gradient-purple hover:opacity-90 text-white font-medium"
            size="lg"
          >
            Proceed
          </Button>
        </div>
      </form>
    </div>
  );
};

export default FundTransfer;