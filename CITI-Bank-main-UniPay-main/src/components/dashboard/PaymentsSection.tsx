
import React, { useState } from 'react';
import { CreditCard, Building2, Smartphone, ShoppingBag } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import CreditCardModal from './payments/CreditCardModal';
import NetBankingModal from './payments/NetBankingModal';
import UPIModal from './payments/UPIModal';
import ECommerceModal from './payments/ECommerceModal';

const PaymentsSection = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: 'card',
      title: 'Credit/Debit Card',
      description: 'Pay securely with your card',
      icon: <CreditCard size={24} />,
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      id: 'netbanking',
      title: 'Net Banking',
      description: 'Pay through your bank',
      icon: <Building2 size={24} />,
      bgColor: 'bg-green-50 hover:bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      id: 'upi',
      title: 'UPI Payment',
      description: 'Pay using UPI apps',
      icon: <Smartphone size={24} />,
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      id: 'ecommerce',
      title: 'Shop with E-Commerce',
      description: 'Pay with top e-commerce brands',
      icon: <ShoppingBag size={24} />,
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      iconColor: 'text-orange-600'
    }
  ];

  return (
    <>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-6">Payments</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {paymentMethods.map((method) => (
            <Card 
              key={method.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${method.bgColor} border-0`}
              onClick={() => setActiveModal(method.id)}
            >
              <CardContent className="p-6 text-center">
                <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full ${method.bgColor} ${method.iconColor} mb-4`}>
                  {method.icon}
                </div>
                <h3 className="font-semibold text-sm mb-2">{method.title}</h3>
                <p className="text-xs text-gray-600">{method.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Payment Modals */}
      <CreditCardModal 
        open={activeModal === 'card'} 
        onClose={() => setActiveModal(null)} 
      />
      <NetBankingModal 
        open={activeModal === 'netbanking'} 
        onClose={() => setActiveModal(null)} 
      />
      <UPIModal 
        open={activeModal === 'upi'} 
        onClose={() => setActiveModal(null)} 
      />
      <ECommerceModal 
        open={activeModal === 'ecommerce'} 
        onClose={() => setActiveModal(null)} 
      />
    </>
  );
};

export default PaymentsSection;