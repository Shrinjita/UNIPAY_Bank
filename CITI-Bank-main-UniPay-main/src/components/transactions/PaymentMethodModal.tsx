
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smartphone, CreditCard, ShoppingBag, Zap } from 'lucide-react';
import { Transaction } from '@/types/transaction';
import { useToast } from '@/hooks/use-toast';

interface PaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  onTransaction: (transaction: Transaction) => void;
}

export const PaymentMethodModal: React.FC<PaymentMethodModalProps> = ({
  open,
  onClose,
  onTransaction
}) => {
  const [amount, setAmount] = useState('');
  const [merchant, setMerchant] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const simulatePayment = async (method: string, methodName: string) => {
    if (!amount || !merchant) {
      toast({
        title: "Error",
        description: "Please enter amount and merchant details",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // 90% success rate simulation
    const isSuccess = Math.random() > 0.1;
    
    const transaction: Transaction = {
      id: `tx-${method}-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      description: `Payment via ${methodName}`,
      merchant: merchant,
      amount: -parseFloat(amount),
      type: 'Payment',
      category: 'Digital Payment',
      status: isSuccess ? 'Completed' : 'Failed',
      reference: `${method.toUpperCase()}${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
      location: 'Online'
    };

    onTransaction(transaction);
    
    toast({
      title: isSuccess ? "Payment Successful" : "Payment Failed",
      description: isSuccess 
        ? `₹${amount} paid to ${merchant} via ${methodName}` 
        : `Payment to ${merchant} failed. Please try again.`,
      variant: isSuccess ? "default" : "destructive"
    });
    
    setIsProcessing(false);
    onClose();
    setAmount('');
    setMerchant('');
  };

  const paymentMethods = [
    {
      id: 'gpay',
      name: 'Google Pay',
      icon: <Smartphone className="text-blue-600" size={24} />,
      color: 'border-blue-200 hover:border-blue-300'
    },
    {
      id: 'phonepe',
      name: 'PhonePe',
      icon: <Smartphone className="text-purple-600" size={24} />,
      color: 'border-purple-200 hover:border-purple-300'
    },
    {
      id: 'paytm',
      name: 'Paytm',
      icon: <CreditCard className="text-blue-500" size={24} />,
      color: 'border-blue-200 hover:border-blue-300'
    },
    {
      id: 'upi',
      name: 'UPI Direct',
      icon: <Zap className="text-orange-600" size={24} />,
      color: 'border-orange-200 hover:border-orange-300'
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Quick Payment</DialogTitle>
          <DialogDescription>
            Simulate payment using various methods (Demo Mode)
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Amount and Merchant Input */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                disabled={isProcessing}
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="merchant">Merchant</Label>
              <Input
                id="merchant"
                value={merchant}
                onChange={(e) => setMerchant(e.target.value)}
                placeholder="Merchant name"
                disabled={isProcessing}
              />
            </div>
          </div>
          
          {/* Payment Methods */}
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => (
              <Card 
                key={method.id}
                className={`cursor-pointer transition-all ${method.color} ${isProcessing ? 'opacity-50' : ''}`}
                onClick={() => !isProcessing && simulatePayment(method.id, method.name)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {method.icon}
                    <div>
                      <div className="font-medium">{method.name}</div>
                      <div className="text-xs text-gray-500">Tap to pay</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          {/* Shopping Simulation */}
          <Card className="border-green-200 hover:border-green-300">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <ShoppingBag className="text-green-600" size={20} />
                Demo Shopping
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isProcessing}
                  onClick={() => {
                    setAmount('299');
                    setMerchant('Amazon India');
                  }}
                >
                  Amazon (₹299)
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isProcessing}
                  onClick={() => {
                    setAmount('150');
                    setMerchant('Swiggy');
                  }}
                >
                  Swiggy (₹150)
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {isProcessing && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-300 border-t-purple-600 mx-auto mb-2"></div>
              <p className="text-sm text-gray-600">Processing payment...</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};