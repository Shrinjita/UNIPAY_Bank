import React, { useState, useEffect } from 'react';
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
import { X, Edit } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@/types/transaction';

interface TransactionDetailsProps {
  transaction: Transaction | null;
  open: boolean;
  onClose: () => void;
  onUpdate: (updatedTransaction: Transaction) => Promise<void>; // callback for saving updates
}

const categories = [
  'Entertainment', 'Shopping', 'Groceries', 'Utilities', 
  'Dining', 'Travel', 'Healthcare', 'Education', 'Personal',
  'Housing', 'Transportation', 'Salary', 'Investment', 'Cash'
];

const TransactionDetails: React.FC<TransactionDetailsProps> = ({ 
  transaction, 
  open, 
  onClose,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  
  useEffect(() => {
    if (transaction) {
      setSelectedCategory(transaction.category);
      setNotes(transaction.notes || ''); // assuming transaction may have notes property
    }
    setIsEditing(false);
  }, [transaction]);

  if (!transaction) {
    return null;
  }
  
  const handleSave = async () => {
    if (!transaction) return;
    setSaving(true);

    try {
      const updatedTransaction: Transaction = {
        ...transaction,
        category: selectedCategory,
        notes: notes.trim(),
      };
      // Call the update handler passed from parent to update in DB
      await onUpdate(updatedTransaction);

      // If success
      setIsEditing(false);
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Failed to save changes:', error);
      alert('Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  return (
    <Drawer open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DrawerContent className="max-h-[90vh]">
        <DrawerHeader className="border-b border-gray-200 sticky top-0 bg-white z-10">
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
                <span className="sr-only">Close</span>
              </Button>
            </DrawerClose>
          </div>
        </DrawerHeader>
        
        <div className="px-4 py-6 overflow-y-auto">
          {/* Transaction Amount */}
          <div className="mb-8 text-center">
            <div className="text-3xl font-semibold mb-1">
              <span className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                {transaction.amount >= 0 ? '+' : '-'}${Math.abs(transaction.amount).toFixed(2)}
              </span>
            </div>
            <Badge className={`
              ${transaction.status === 'Success' ? 'bg-green-100 text-green-800' : 
                transaction.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                'bg-green-100 text-green-800'}`
            }>
              {transaction.status}
            </Badge>
          </div>
          
          {/* Transaction Details */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Date & Time</h3>
                <p className="font-medium">
                  {new Date(transaction.date).toLocaleDateString()}
                </p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Merchant</h3>
                <p className="font-medium">{transaction.merchantName}</p>
              </div>
              
              <div>
                <h3 className="text-sm text-gray-500 mb-1">Description</h3>
                <p className="font-medium">{transaction.description}</p>
              </div>
              
            
              {transaction.location && (
                <div className="col-span-full">
                  <h3 className="text-sm text-gray-500 mb-1">Location</h3>
                  <p className="font-medium">{transaction.location}</p>
                </div>
              )}
            </div>
            
            {/* Category */}
            <div className="border-t border-gray-200 pt-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm text-gray-500">Category</h3>
                {!isEditing && (
                  <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                    <Edit size={16} className="mr-1" /> Edit
                  </Button>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <Select 
                    value={selectedCategory} 
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  <div>
                    <h3 className="text-sm text-gray-500 mb-2">Add Notes</h3>
                    <Input 
                      placeholder="Add notes about this transaction..." 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <Badge variant="outline" className="bg-gray-50">{transaction.category}</Badge>
              )}
            </div>
          </div>
        </div>
        
        <DrawerFooter className="border-t border-gray-200">
          {isEditing ? (
            <div className="flex gap-2">
              <Button variant="default" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
              <Button variant="outline" onClick={() => setIsEditing(false)} disabled={saving}>Cancel</Button>
            </div>
          ) : (
            <Button onClick={onClose}>Close</Button>
          )}
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default TransactionDetails;
