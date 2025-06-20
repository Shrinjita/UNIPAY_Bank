
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Transaction } from '@/types/transaction';

interface ScheduleTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSchedule: (transaction: Transaction) => void;
}

export const ScheduleTransactionModal: React.FC<ScheduleTransactionModalProps> = ({
  open,
  onClose,
  onSchedule
}) => {
  const [formData, setFormData] = useState({
    merchant: '',
    amount: '',
    type: '',
    description: '',
    scheduledDate: '',
    scheduledTime: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transaction: Transaction = {
      id: `tx-scheduled-${Date.now()}`,
      date: formData.scheduledDate,
      time: formData.scheduledTime,
      description: formData.description,
      merchant: formData.merchant,
      amount: parseFloat(formData.amount) * (formData.type === 'credit' ? 1 : -1),
      type: 'Scheduled',
      category: 'Scheduled Payment',
      status: 'Scheduled',
      reference: `REF${Math.random().toString(36).substring(2, 15).toUpperCase()}`,
      scheduledDate: formData.scheduledDate
    };

    onSchedule(transaction);
    onClose();
    
    // Reset form
    setFormData({
      merchant: '',
      amount: '',
      type: '',
      description: '',
      scheduledDate: '',
      scheduledTime: ''
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Transaction</DialogTitle>
          <DialogDescription>
            Schedule a future payment or transfer
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="merchant">Merchant/Recipient</Label>
              <Input
                id="merchant"
                value={formData.merchant}
                onChange={(e) => setFormData(prev => ({ ...prev, merchant: e.target.value }))}
                placeholder="Enter merchant or recipient name"
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Payment description"
                required
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="amount">Amount (₹)</Label>
                <Input
                  id="amount"
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData(prev => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="debit">Payment (Debit)</SelectItem>
                    <SelectItem value="credit">Income (Credit)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="scheduledDate">Scheduled Date</Label>
                <Input
                  id="scheduledDate"
                  type="date"
                  value={formData.scheduledDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledDate: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="scheduledTime">Scheduled Time</Label>
                <Input
                  id="scheduledTime"
                  type="time"
                  value={formData.scheduledTime}
                  onChange={(e) => setFormData(prev => ({ ...prev, scheduledTime: e.target.value }))}
                  required
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              Schedule Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};