
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Wallet } from 'lucide-react';

interface EWalletModalProps {
  open: boolean;
  onClose: () => void;
}

const EWalletModal: React.FC<EWalletModalProps> = ({ open, onClose }) => {
  const [selectedWallet, setSelectedWallet] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const wallets = [
    { 
      id: 'amazon', 
      name: 'Amazon Pay', 
      logo: '📦', 
      color: 'bg-orange-50 hover:bg-orange-100',
      description: 'Use your Amazon Pay balance'
    },
    { 
      id: 'flipkart', 
      name: 'Flipkart Wallet', 
      logo: '🛒', 
      color: 'bg-blue-50 hover:bg-blue-100',
      description: 'Pay with Flipkart SuperCoin'
    },
    { 
      id: 'paytm', 
      name: 'Paytm Wallet', 
      logo: '💳', 
      color: 'bg-blue-50 hover:bg-blue-100',
      description: 'Use your Paytm wallet balance'
    },
  ];

  const handleWalletSelect = (wallet: typeof wallets[0]) => {
    setSelectedWallet(wallet.name);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    alert(`Processing payment via ${selectedWallet}... This is a demo implementation.`);
    onClose();
    setShowConfirmation(false);
    setSelectedWallet('');
  };

  const handleCancel = () => {
    setShowConfirmation(false);
    setSelectedWallet('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wallet size={20} />
            Pay via E-Commerce Wallets
          </DialogTitle>
        </DialogHeader>
        
        {!showConfirmation ? (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Select your preferred wallet to continue</p>
            
            <div className="space-y-3">
              {wallets.map((wallet) => (
                <Button
                  key={wallet.id}
                  variant="outline"
                  className={`w-full h-auto p-4 justify-start ${wallet.color}`}
                  onClick={() => handleWalletSelect(wallet)}
                >
                  <span className="text-3xl mr-4">{wallet.logo}</span>
                  <div className="text-left">
                    <div className="font-semibold">{wallet.name}</div>
                    <div className="text-xs text-gray-600">{wallet.description}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Wallet className="text-green-600" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Confirm Payment</h3>
              <p className="text-gray-600">
                You have selected <span className="font-semibold">{selectedWallet}</span> for payment
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-600">Payment Method:</span>
                <span className="font-medium">{selectedWallet}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Amount:</span>
                <span className="font-semibold text-lg">₹1,000.00</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={handleConfirm}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EWalletModal;