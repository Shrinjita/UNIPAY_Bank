
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ShoppingBag } from 'lucide-react';

interface ECommerceModalProps {
  open: boolean;
  onClose: () => void;
}

const ECommerceModal: React.FC<ECommerceModalProps> = ({ open, onClose }) => {
  const ecommercePlatforms = [
    { 
      name: 'Amazon', 
      url: 'https://www.amazon.in',
      logo: '📦',
      color: 'bg-orange-50 hover:bg-orange-100'
    },
    { 
      name: 'Flipkart', 
      url: 'https://www.flipkart.com',
      logo: '🛒',
      color: 'bg-blue-50 hover:bg-blue-100'
    },
    { 
      name: 'Myntra', 
      url: 'https://www.myntra.com',
      logo: '👗',
      color: 'bg-pink-50 hover:bg-pink-100'
    },
    { 
      name: 'Nykaa', 
      url: 'https://www.nykaa.com',
      logo: '💄',
      color: 'bg-purple-50 hover:bg-purple-100'
    }
  ];

  const handlePlatformClick = (url: string) => {
    window.open(url, '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ShoppingBag size={20} />
            Select an E-Commerce Platform
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-gray-600">Choose your preferred platform to start shopping</p>
          
          <div className="grid grid-cols-2 gap-3">
            {ecommercePlatforms.map((platform) => (
              <Button
                key={platform.name}
                variant="outline"
                className={`h-auto p-4 flex flex-col items-center gap-2 ${platform.color} transition-all duration-200`}
                onClick={() => handlePlatformClick(platform.url)}
              >
                <span className="text-3xl">{platform.logo}</span>
                <span className="font-semibold text-sm">{platform.name}</span>
              </Button>
            ))}
          </div>
          
          <div className="text-xs text-gray-500 text-center mt-4">
            Clicking on a platform will open it in a new tab
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ECommerceModal;