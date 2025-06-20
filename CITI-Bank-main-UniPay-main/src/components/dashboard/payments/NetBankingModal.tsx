import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface NetBankingModalProps {
  open: boolean;
  onClose: () => void;
}

const NetBankingModal: React.FC<NetBankingModalProps> = ({ open, onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const preferredBanks = [
    { id: 'citi', name: 'Citi Bank', logo: '🏦' },
  ];

  const popularBanks = [
    { id: 'sbi', name: 'State Bank of India', logo: '🏛️' },
    { id: 'icici', name: 'ICICI Bank', logo: '🏪' },
    { id: 'hdfc', name: 'HDFC Bank', logo: '🏦' },
    { id: 'bom', name: 'Bank of Maharashtra', logo: '🏛️' },
    { id: 'pnb', name: 'Punjab National Bank', logo: '🏪' },
    { id: 'axis', name: 'Axis Bank', logo: '🏦' },
  ];

  const allBanks = [
    { id: 'citi', name: 'Citi Bank', logo: '🏦' },
    { id: 'andhra', name: 'Andhra Bank', logo: '🏛️' },
    { id: 'bob', name: 'Bank of Baroda', logo: '🏪' },
    { id: 'canara', name: 'Canara Bank', logo: '🏦' },
    { id: 'dena', name: 'Dena Bank', logo: '🏛️' },
    { id: 'indian', name: 'Indian Bank', logo: '🏪' },
    { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🏦' },
  ];

  const filteredBanks = allBanks.filter(bank => 
    bank.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleBankSelect = (bankId: string, bankName: string) => {
    if (bankId === 'citi') {
      onClose();
      navigate('/netbanking');
    } else {
      alert(`Redirecting to ${bankName} Net Banking... This is a demo implementation.`);
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 size={20} />
            Pay via Net Banking
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search for your bank..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Preferred Banks */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-gray-700">Preferred Bank</h3>
            <div className="grid grid-cols-1 gap-2">
              {preferredBanks.map((bank) => (
                <Button
                  key={bank.id}
                  variant="outline"
                  className="justify-start h-auto p-4 hover:bg-blue-50 border-blue-200"
                  onClick={() => handleBankSelect(bank.id, bank.name)}
                >
                  <span className="text-2xl mr-3">{bank.logo}</span>
                  <span className="font-medium">{bank.name}</span>
                  <span className="ml-auto text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">Recommended</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Popular Banks */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-gray-700">Popular Banks</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {popularBanks.map((bank) => (
                <Button
                  key={bank.id}
                  variant="outline"
                  className="justify-start h-auto p-3 hover:bg-green-50"
                  onClick={() => handleBankSelect(bank.id, bank.name)}
                >
                  <span className="text-xl mr-3">{bank.logo}</span>
                  <span className="font-medium text-sm">{bank.name}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* All Banks */}
          <div>
            <h3 className="font-semibold text-sm mb-3 text-gray-700">
              {searchTerm ? 'Search Results' : 'All Banks'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto">
              {(searchTerm ? filteredBanks : allBanks).map((bank) => (
                <Button
                  key={bank.id}
                  variant="outline"
                  className="justify-start h-auto p-3 hover:bg-gray-50"
                  onClick={() => handleBankSelect(bank.id, bank.name)}
                >
                  <span className="text-xl mr-3">{bank.logo}</span>
                  <span className="font-medium text-sm">{bank.name}</span>
                </Button>
              ))}
            </div>
            {searchTerm && filteredBanks.length === 0 && (
              <p className="text-center text-gray-500 py-4">No banks found matching "{searchTerm}"</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NetBankingModal;