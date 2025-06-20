'use client';
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { CreditCard, Lock, Shield, DollarSign } from 'lucide-react';
import { db } from '../../../firebase/firebaseConfig';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

interface CreditCardModalProps {
  open: boolean;
  onClose: () => void;
}

const CreditCardModal: React.FC<CreditCardModalProps> = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    amount: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: '',
    saveCard: false,
    merchantName: '',
    date: '',
    description: '',
    category: '',
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.amount || parseFloat(formData.amount) <= 0) newErrors.amount = 'Enter a valid amount';
    if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 16) newErrors.cardNumber = 'Invalid card number';
    if (!formData.expiryDate || !/^\d{2}\/\d{2}$/.test(formData.expiryDate)) newErrors.expiryDate = 'Invalid expiry date';
    if (!formData.cvv || formData.cvv.length < 3) newErrors.cvv = 'Invalid CVV';
    if (!formData.nameOnCard.trim()) newErrors.nameOnCard = 'Name required';
    if (!formData.merchantName.trim()) newErrors.merchantName = 'Merchant name required';
    if (!formData.date || !/^\d{4}-\d{2}-\d{2}$/.test(formData.date)) newErrors.date = 'Date must be in YYYY-MM-DD';
    if (!formData.description.trim()) newErrors.description = 'Description required';
    if (!formData.category.trim()) newErrors.category = 'Category required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      try {
        await addDoc(collection(db, 'payments'), {
          ...formData,
          status: 'success', // ✅ Added status field
          timestamp: Timestamp.now(),
        });
        alert(`Payment of $${formData.amount} recorded.`);
        onClose();
      } catch (error) {
        alert('Failed to store payment. Check console.');
        console.error('Firebase Error:', error);
      }
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\D/g, '');
    const parts = [];
    for (let i = 0; i < v.length; i += 4) {
      parts.push(v.substring(i, i + 4));
    }
    return parts.join(' ');
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\D/g, '');
    return v.length >= 2 ? v.substring(0, 2) + '/' + v.substring(2, 4) : v;
  };

  const formatAmount = (value: string) => {
    const cleaned = value.replace(/[^0-9.]/g, '');
    const parts = cleaned.split('.');
    return parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : cleaned;
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard size={20} />
            Pay via Credit/Debit Card
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2">

          {/* Amount */}
          <div>
            <label className="text-sm font-medium mb-2 block">Amount</label>
            <div className="relative">
              <Input
                placeholder="0.00"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: formatAmount(e.target.value) })}
                className={errors.amount ? 'border-red-500 pl-8' : 'pl-8'}
              />
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            </div>
            {errors.amount && <p className="text-red-500 text-xs mt-1">{errors.amount}</p>}
          </div>

          {/* Merchant Name */}
          <div>
            <label className="text-sm font-medium mb-2 block">Merchant Name</label>
            <Input
              placeholder="Amazon, Walmart etc."
              value={formData.merchantName}
              onChange={(e) => setFormData({ ...formData, merchantName: e.target.value })}
              className={errors.merchantName ? 'border-red-500' : ''}
            />
            {errors.merchantName && <p className="text-red-500 text-xs mt-1">{errors.merchantName}</p>}
          </div>

          {/* Date */}
          <div>
            <label className="text-sm font-medium mb-2 block">Transaction Date</label>
            <Input
              type="date"
              value={formData.date}
              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              className={errors.date ? 'border-red-500' : ''}
            />
            {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
          </div>

          {/* Description */}
          <div>
            <label className="text-sm font-medium mb-2 block">Description</label>
            <Input
              placeholder="Short description of the payment"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none ${
                errors.category ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Select a category</option>
              <option value="Groceries">Groceries</option>
              <option value="Utilities">Utilities</option>
              <option value="Travel">Travel</option>
              <option value="Dining">Dining</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Education">Education</option>
              <option value="Others">Others</option>
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>

          {/* Card Number */}
          <div>
            <label className="text-sm font-medium mb-2 block">Card Number</label>
            <Input
              placeholder="1234 5678 9012 3456"
              value={formData.cardNumber}
              onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
              maxLength={19}
              className={errors.cardNumber ? 'border-red-500' : ''}
            />
            {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
          </div>

          {/* Expiry + CVV */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Expiry Date</label>
              <Input
                placeholder="MM/YY"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: formatExpiryDate(e.target.value) })}
                maxLength={5}
                className={errors.expiryDate ? 'border-red-500' : ''}
              />
              {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">CVV</label>
              <Input
                placeholder="123"
                type="password"
                value={formData.cvv}
                onChange={(e) => setFormData({ ...formData, cvv: e.target.value.replace(/\D/g, '') })}
                maxLength={4}
                className={errors.cvv ? 'border-red-500' : ''}
              />
              {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
            </div>
          </div>

          {/* Name on Card */}
          <div>
            <label className="text-sm font-medium mb-2 block">Name on Card</label>
            <Input
              placeholder="Cardholder Name"
              value={formData.nameOnCard}
              onChange={(e) => setFormData({ ...formData, nameOnCard: e.target.value })}
              className={errors.nameOnCard ? 'border-red-500' : ''}
            />
            {errors.nameOnCard && <p className="text-red-500 text-xs mt-1">{errors.nameOnCard}</p>}
          </div>

          {/* Save card */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="save-card"
              checked={formData.saveCard}
              onCheckedChange={(checked) => setFormData({ ...formData, saveCard: checked as boolean })}
            />
            <label htmlFor="save-card" className="text-sm">
              I agree to save my card details for future use
            </label>
          </div>

          {/* Info */}
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
            <Shield size={16} />
            <span>PCI DSS Compliant</span>
            <Lock size={16} className="ml-auto" />
            <span>Secure Checkout</span>
          </div>

          {/* Button */}
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700"
            disabled={!formData.amount || !formData.cardNumber || !formData.expiryDate || !formData.cvv || !formData.nameOnCard}
          >
            {formData.amount ? `PAY $${formData.amount}` : 'PROCEED'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreditCardModal;
