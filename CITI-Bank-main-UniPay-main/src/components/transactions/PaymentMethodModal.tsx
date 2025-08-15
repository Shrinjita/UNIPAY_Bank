// PaymentMethodModal.tsx
'use client';
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useToast } from '@/hooks/use-toast'; 
import type { Transaction } from '@/types/transaction';
import { motion, AnimatePresence } from 'framer-motion';

// --- Utilities ---
const formatINR = (val: string | number) => {
  const num = typeof val === 'string' ? Number(val) : val;
  if (!isFinite(num)) return '';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(num);
};

const isAndroid = () => /Android/i.test(typeof navigator !== 'undefined' ? navigator.userAgent : '');
const isMobile = () =>
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    typeof navigator !== 'undefined' ? navigator.userAgent : ''
  );

// naive map; in real world keep a config store
const knownMerchantVpa: Record<string, string> = {
  'amazon india': 'amazonpay@apl',
  'swiggy': 'swiggy@icici',
  'zomato': 'zomato@hdfcbank',
  'flipkart': 'flipkart@icici',
  'myntra': 'myntra@icici',
};

// Build a UPI deeplink (pay intent). Most apps (GPay/PhonePe/Paytm) will catch this.
function buildUpiPayUrl({
  vpa,
  name,
  amount,
  note,
  txnRef,
}: {
  vpa: string;
  name: string;
  amount: number;
  note: string;
  txnRef: string;
}) {
  const params = new URLSearchParams({
    pa: vpa,           // payee VPA
    pn: name || 'Merchant',
    am: String(amount),
    cu: 'INR',
    tn: note || 'Payment',
    tr: txnRef,        // transaction reference
  });
  return `upi://pay?${params.toString()}`;
}

// Best-effort merchant->domain for a logo service (no SDK needed)
const merchantLogoUrl = (merchant: string) => {
  const slug = merchant?.trim().toLowerCase().replace(/\s+/g, '');
  if (!slug) return '';
  return `https://logo.clearbit.com/${slug}.com`;
};

// --- Component ---
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
  const [amountRaw, setAmountRaw] = useState('');
  const [merchant, setMerchant] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [steps, setSteps] = useState<string[]>([]);
  const [referenceId, setReferenceId] = useState('');
  const [partialRef, setPartialRef] = useState('');
  const [methodLabel, setMethodLabel] = useState('');
  const [validation, setValidation] = useState<{ amount?: string; merchant?: string }>({});
  const [status, setStatus] = useState<'IDLE'|'INITIATED'|'PENDING'|'COMPLETED'|'FAILED'>('IDLE');
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  const pollTimer = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  const amount = useMemo(() => Number(amountRaw || '0'), [amountRaw]);
  const canPay = amount > 0 && merchant.trim().length >= 3 && !isProcessing;

  // --- Live validation ---
  useEffect(() => {
    const next: typeof validation = {};
    if (amountRaw && (Number.isNaN(Number(amountRaw)) || Number(amountRaw) <= 0)) {
      next.amount = 'Enter an amount greater than ₹0';
    }
    if (merchant && merchant.trim().length < 3) {
      next.merchant = 'Merchant name too short';
    }
    setValidation(next);
  }, [amountRaw, merchant]);

  // Reset when modal closes
  useEffect(() => {
    if (!open) {
      stopAllTimers();
      setIsProcessing(false);
      setCurrentStep(0);
      setSteps([]);
      setReferenceId('');
      setPartialRef('');
      setMethodLabel('');
      setStatus('IDLE');
      setValidation({});
      setAmountRaw('');
      setMerchant('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

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

  // --- Core flow entrypoint ---
  const handlePay = async (methodId: string, methodName: string) => {
    if (!canPay) {
      toast({
        title: 'Missing details',
        description: 'Please enter a valid amount and merchant.',
        variant: 'destructive'
      });
      return;
    }

    setMethodLabel(methodName);
    // new reference (UTR-like)
    const ref = `${methodId.toUpperCase()}-${Date.now().toString(36).toUpperCase()}-${Math.random()
      .toString(36)
      .substring(2, 6)
      .toUpperCase()}`;
    setReferenceId(ref);
    setPartialRef(ref.slice(0, 8) + '••••');
    setStatus('INITIATED');

    // UX steps like a real UPI app
    const baseSteps = [
      'Connecting to bank...',
      'Verifying details...',
      'Initiating payment...',
      'Awaiting app confirmation...'
    ];
    setSteps(baseSteps);
    setCurrentStep(0);
    setIsProcessing(true);

    // Advance steps quickly for realism
    stepperAdvance(baseSteps.length);

    // Try to deep-link to a UPI app (Android/mobile). If it fails or desktop, keep simulation.
    tryUpiDeepLink(methodId, ref);
    // Start polling "server" (simulated) for final status
    startStatusPolling(methodId, ref, amount, merchant);
  };

  // --- Stepper animation ---
  const stepperAdvance = (total: number) => {
    stopTimer(progressTimer);
    let i = 0;
    progressTimer.current = setInterval(() => {
      i += 1;
      setCurrentStep((prev) => Math.min(prev + 1, total - 1));
      // Reveal more of the reference as we progress
      setPartialRef((prev) => {
        const visible = Math.min(referenceId.length, (i + 1) * 4);
        return referenceId ? referenceId.slice(0, visible) + (visible < referenceId.length ? '••' : '') : prev;
      });
      // when we reach last pre-confirm step, we rely on polling to complete
      if (i >= total - 1) {
        stopTimer(progressTimer);
      }
    }, 850);
  };

  const stopTimer = (ref: React.MutableRefObject<NodeJS.Timeout | null>) => {
    if (ref.current) {
      clearInterval(ref.current);
      ref.current = null;
    }
  };

  const stopAllTimers = () => {
    stopTimer(progressTimer);
    stopTimer(pollTimer);
  };

  // --- Polling simulation (server confirms after user returns from UPI app) ---
  const startStatusPolling = (
    methodId: string,
    ref: string,
    amt: number,
    mch: string
  ) => {
    stopTimer(pollTimer);
    setStatus('PENDING');

    let ticks = 0;
    const maxTicks = 8; // ~8*700ms ≈ 5.6s average
    pollTimer.current = setInterval(() => {
      ticks += 1;

      // Randomize success (90%) with some jitter so it feels real
      const willFinish = ticks >= 3 && (Math.random() > 0.4 || ticks >= maxTicks);
      if (willFinish) {
        const isSuccess = Math.random() > 0.1;
        completeTransaction(isSuccess, methodId, ref, amt, mch);
        stopTimer(pollTimer);
      }
    }, 700);
  };

  const completeTransaction = (isSuccess: boolean, methodId: string, ref: string, amt: number, mch: string) => {
    setIsProcessing(false);
    setStatus(isSuccess ? 'COMPLETED' : 'FAILED');

    const transaction: Transaction = {
      id: `tx-${methodId}-${Date.now()}`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString(),
      description: `Payment via ${methodLabel}`,
      merchant: mch,
      amount: -Math.abs(amt),
      type: 'Payment',
      category: 'Digital Payment',
      status: isSuccess ? 'Completed' : 'Failed',
      reference: ref.replace(/-/g, '').toUpperCase(),
      location: 'Online'
    };

    onTransaction(transaction);

    toast({
      title: isSuccess ? 'Payment Successful' : 'Payment Failed',
      description: isSuccess
        ? `${formatINR(amt)} paid to ${mch} via ${methodLabel}`
        : `Payment to ${mch} failed. Please try again.`,
      variant: isSuccess ? 'default' : 'destructive'
    });

    // auto-close on success after a tiny delay (keeps UX snappy)
    if (isSuccess) {
      setTimeout(() => {
        onClose();
        // reset primary fields so the form re-opens clean
        setAmountRaw('');
        setMerchant('');
      }, 600);
    }
  };

  // --- Attempt a real UPI deep link (Android/mobile) ---
  const tryUpiDeepLink = (methodId: string, ref: string) => {
    const mch = merchant.trim();
    const vpa = knownMerchantVpa[mch.toLowerCase()] || 'test@upi';
    const upiUrl = buildUpiPayUrl({
      vpa,
      name: mch || 'Merchant',
      amount: amount,
      note: `Paying ${mch} via ${methodId.toUpperCase()}`,
      txnRef: ref,
    });

    // Some wallets support package-specific deep links via intent: URIs on Android Chrome.
    // We'll do a best-effort: on mobile, open the UPI URL; on Android Chrome this usually
    // opens a chooser with GPay/PhonePe/Paytm.
    if (isMobile()) {
      // Use an invisible iframe fallback technique for better app-open success rates.
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      iframe.src = upiUrl;
      document.body.appendChild(iframe);

      // If it doesn't open, remove iframe after a second. (No harm if it did open)
      setTimeout(() => {
        try {
          document.body.removeChild(iframe);
        } catch {}
      }, 1200);

      toast({
        title: 'Opening payment app…',
        description: `Redirecting to ${methodLabel} (if installed).`,
      });
    } else {
      // Desktop fallback: we keep the simulated flow; user can't complete native UPI.
      toast({
        title: 'Simulating payment',
        description: 'UPI apps open on mobile devices. Proceeding with demo mode on desktop.',
      });
    }
  };

  // --- Render ---
  const merchantImg = merchantLogoUrl(merchant);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            {!!merchantImg && (
              // soft image load; if it 404s, the default alt will show nothing intrusive
              // we keep layout unchanged by keeping size small
              <img
                src={merchantImg}
                alt=""
                className="h-6 w-6 rounded"
                onError={(e) => {
                  // hide broken images
                  (e.currentTarget as HTMLImageElement).style.display = 'none';
                }}
              />
            )}
            <div className="flex-1">
              <DialogTitle>Quick Payment</DialogTitle>
              <DialogDescription>Simulate payment using various methods (Demo Mode)</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Amount and Merchant Input (unchanged layout) */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="amount">Amount (₹)</Label>
              <Input
                id="amount"
                inputMode="decimal"
                type="number"
                value={amountRaw}
                onChange={(e) => setAmountRaw(e.target.value)}
                placeholder="0.00"
                disabled={isProcessing}
              />
              {amountRaw && !validation.amount && (
                <div className="text-xs text-muted-foreground">
                  {formatINR(amount)}
                </div>
              )}
              {validation.amount && (
                <div className="text-xs text-red-500">{validation.amount}</div>
              )}
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
              {validation.merchant && (
                <div className="text-xs text-red-500">{validation.merchant}</div>
              )}
            </div>
          </div>

          {/* Payment Methods (unchanged layout, but smarter click) */}
          <div className="grid grid-cols-2 gap-3">
            {paymentMethods.map((method) => {
              const disabled = !canPay || isProcessing;
              return (
                <Card
                  key={method.id}
                  className={`cursor-pointer transition-all ${method.color} ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
                  onClick={() => handlePay(method.id, method.name)}
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
              );
            })}
          </div>

          {/* Shopping Simulation (unchanged layout) */}
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
                    setAmountRaw('299');
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
                    setAmountRaw('150');
                    setMerchant('Swiggy');
                  }}
                >
                  Swiggy (₹150)
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Processing & Real-time feel (same space; no new layout blocks) */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                className="text-center py-4 space-y-2"
              >
                {/* Progress ring */}
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-300 border-t-purple-600"></div>
                  <div className="text-sm text-gray-600">
                    {steps[currentStep] || 'Processing payment...'}
                  </div>
                </div>

                {/* UTR / Ref progressive reveal */}
                {referenceId && (
                  <div className="text-xs text-muted-foreground">
                    Ref: <span className="font-mono">{partialRef || referenceId.slice(0, 6) + '••'}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Terminal message once finished (uses same area, no layout change) */}
          {!isProcessing && status !== 'IDLE' && (
            <div className="text-center py-2">
              {status === 'COMPLETED' ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-green-600 text-sm font-medium">
                  ✅ Payment Successful
                </motion.div>
              ) : status === 'FAILED' ? (
                <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="text-red-600 text-sm font-medium">
                  ❌ Payment Failed
                </motion.div>
              ) : (
                <div className="text-sm text-gray-600">Awaiting confirmation…</div>
              )}
              {referenceId && (
                <div className="text-xs text-muted-foreground mt-1">
                  Ref: <span className="font-mono">{referenceId}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
