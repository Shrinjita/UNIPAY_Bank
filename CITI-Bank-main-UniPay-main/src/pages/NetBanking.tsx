


  import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import NetBankingHeader from '@/components/netbanking/NetBankingHeader';
import SavedBeneficiaries from '@/components/netbanking/SavedBeneficiaries';
import TransferDetails from '@/components/netbanking/TransferDetails';
import BeneficiaryDetails from '@/components/netbanking/BeneficiaryDetails';
import AdditionalInformation from '@/components/netbanking/AdditionalInformation';
import { loadStripe } from '@stripe/stripe-js';
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);


interface Beneficiary {
  id: string;
  accountNumber: string;
  ifscCode: string;
  name: string;
}

const NetBanking = () => {
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
    saveAsBeneficiary: false,
  });

  const [savedBeneficiaries, setSavedBeneficiaries] = useState<Beneficiary[]>([]);
  const [showSavedBeneficiaries, setShowSavedBeneficiaries] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('savedBeneficiaries');
    if (saved) {
      setSavedBeneficiaries(JSON.parse(saved));
    }

    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('success') === 'true') {
      toast({
        title: 'Payment Complete!',
        description: 'Your transaction was successful.',
        variant: 'default',
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    } else if (queryParams.get('canceled') === 'true') {
      toast({
        title: 'Payment Canceled',
        description: 'Your transaction was canceled.',
        variant: 'destructive',
      });
      window.history.replaceState({}, document.title, window.location.pathname);
    }
  }, [toast]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleBeneficiarySelect = (beneficiary: Beneficiary) => {
    setFormData((prev) => ({
      ...prev,
      accountNumber: beneficiary.accountNumber,
      reenterAccountNumber: beneficiary.accountNumber,
      ifscCode: beneficiary.ifscCode,
      beneficiaryName: beneficiary.name,
    }));
    setShowSavedBeneficiaries(false);
  };

  const saveBeneficiary = () => {
    if (formData.accountNumber && formData.ifscCode && formData.beneficiaryName) {
      const newBeneficiary: Beneficiary = {
        id: Date.now().toString(),
        accountNumber: formData.accountNumber,
        ifscCode: formData.ifscCode,
        name: formData.beneficiaryName,
      };

      const updated = [...savedBeneficiaries, newBeneficiary];
      setSavedBeneficiaries(updated);
      localStorage.setItem('savedBeneficiaries', JSON.stringify(updated));

      toast({
        title: 'Beneficiary Saved',
        description: 'Beneficiary details have been saved for future transfers.',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.accountNumber !== formData.reenterAccountNumber) {
      toast({
        title: 'Error',
        description: 'Account numbers do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (formData.saveAsBeneficiary) {
      saveBeneficiary();
    }

    const stripe = await stripePromise;
    if (!stripe) {
      toast({
        title: 'Error',
        description: 'Stripe.js failed to load. Please try again.',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Updated URL to port 5050
      const response = await fetch('http://https://unipay-backend.onrender.com/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: formData.amount }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to create checkout session');
        } else {
          const text = await response.text();
          throw new Error(text || 'Failed to create checkout session');
        }
      }

      const session = await response.json();

      const result = await stripe.redirectToCheckout({
        sessionId: session.id,
      });

      if (result?.error) {
        toast({
          title: 'Stripe Redirection Error',
          description: result.error.message || 'An error occurred during redirection.',
          variant: 'destructive',
        });
      }
    } catch (error: any) {
      toast({
        title: 'Transaction Error',
        description: error.message || 'An unexpected error occurred.',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <NetBankingHeader />

        <div className="flex space-x-4 mb-6">
          <Button
            variant={!showSavedBeneficiaries ? 'default' : 'outline'}
            onClick={() => setShowSavedBeneficiaries(false)}
          >
            New Transfer
          </Button>
          <Button
            variant={showSavedBeneficiaries ? 'default' : 'outline'}
            onClick={() => setShowSavedBeneficiaries(true)}
          >
            Saved Beneficiaries
          </Button>
        </div>

        {showSavedBeneficiaries && (
          <SavedBeneficiaries
            beneficiaries={savedBeneficiaries}
            onBeneficiarySelect={handleBeneficiarySelect}
          />
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <TransferDetails
            fromAccount={formData.fromAccount}
            amount={formData.amount}
            onFromAccountChange={(value) => handleInputChange('fromAccount', value)}
            onAmountChange={(value) => handleInputChange('amount', value)}
          />

          <BeneficiaryDetails
            accountNumber={formData.accountNumber}
            reenterAccountNumber={formData.reenterAccountNumber}
            ifscCode={formData.ifscCode}
            beneficiaryName={formData.beneficiaryName}
            onAccountNumberChange={(value) => handleInputChange('accountNumber', value)}
            onReenterAccountNumberChange={(value) => handleInputChange('reenterAccountNumber', value)}
            onIfscCodeChange={(value) => handleInputChange('ifscCode', value)}
            onBeneficiaryNameChange={(value) => handleInputChange('beneficiaryName', value)}
          />

          <AdditionalInformation
            transferType={formData.transferType}
            purpose={formData.purpose}
            remarks={formData.remarks}
            saveAsBeneficiary={formData.saveAsBeneficiary}
            onTransferTypeChange={(value) => handleInputChange('transferType', value)}
            onPurposeChange={(value) => handleInputChange('purpose', value)}
            onRemarksChange={(value) => handleInputChange('remarks', value)}
            onSaveAsBeneficiaryChange={(value) => handleInputChange('saveAsBeneficiary', value)}
          />

          <div className="flex justify-center pt-4">
            <Button
              type="submit"
              className="px-12 py-3 bg-primary hover:bg-primary/90 text-white font-semibold text-lg h-12 min-w-[200px]"
            >
              Proceed with Transfer
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NetBanking;
