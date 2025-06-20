
import React from 'react';
import { 
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle
} from '@/components/ui/drawer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Download, MapPin, Clock } from 'lucide-react';
import { Transaction } from '@/types/transaction';

interface TransactionModalProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
  onDownloadPDF: (transaction: Transaction) => void;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({ 
  transaction, 
  open, 
  onClose,
  onDownloadPDF
}) => {
  if (!transaction) return null;

  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <DrawerTitle className="text-xl">Transaction Details</DrawerTitle>
              <DrawerDescription>
                Reference ID: {transaction.reference}
              </DrawerDescription>
            </div>
            <DrawerClose asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <X size={18} />
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <div className="px-4 py-6 overflow-y-auto">
          {/* Amount Display */}
          <div className="text-center mb-8">
            <div className="text-3xl font-semibold mb-2">
              <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                {transaction.amount >= 0 ? '+' : ''}₹{Math.abs(transaction.amount).toLocaleString()}
              </span>
            </div>
            <Badge className={`
              ${transaction.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-blue-100 text-blue-800'}`
            }>
              {transaction.status}
            </Badge>
          </div>
          
          {/* Transaction Details Grid */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock size={16} className="text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">Date & Time</span>
                </div>
                <p className="text-lg">
                  {new Date(`${transaction.date}T${transaction.time}`).toLocaleString()}
                </p>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-1">Description</div>
                <p className="text-lg">{transaction.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">Merchant</div>
                  <p>{transaction.merchant}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">Type</div>
                  <p>{transaction.type}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700 mb-1">Category</div>
                  <Badge variant="outline">{transaction.category}</Badge>
                </div>
                
                {transaction.location && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={14} className="text-gray-500" />
                      <span className="text-sm font-medium text-gray-700">Location</span>
                    </div>
                    <p>{transaction.location}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        <DrawerFooter className="border-t border-gray-200">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={() => onDownloadPDF(transaction)}
            >
              <Download size={16} className="mr-2" />
              Download Receipt
            </Button>
            <Button onClick={onClose} className="flex-1">
              Close
            </Button>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};