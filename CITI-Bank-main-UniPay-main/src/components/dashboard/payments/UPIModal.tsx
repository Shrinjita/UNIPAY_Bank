import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Smartphone } from 'lucide-react';

interface UPIModalProps {
  open: boolean;
  onClose: () => void;
}

const UPIModal: React.FC<UPIModalProps> = ({ open, onClose }) => {
  const [upiId, setUpiId] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [selectedApp, setSelectedApp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  const upiApps = [
    { id: 'gpay', name: 'Google Pay', logo: '🔵', color: 'bg-blue-50 hover:bg-blue-100' },
    { id: 'phonepe', name: 'PhonePe', logo: '🟣', color: 'bg-purple-50 hover:bg-purple-100' },
    { id: 'paytm', name: 'Paytm', logo: '🔵', color: 'bg-blue-50 hover:bg-blue-100' },
    { id: 'amazon', name: 'Amazon Pay', logo: '🟠', color: 'bg-orange-50 hover:bg-orange-100' },
    { id: 'bhim', name: 'BHIM', logo: '🟢', color: 'bg-green-50 hover:bg-green-100' },
    { id: 'razorpay', name: 'Razorpay', logo: '🔵', color: 'bg-blue-50 hover:bg-blue-100' },
  ];

  const handleVerifyUpiId = () => {
    if (upiId.includes('@')) {
      setIsVerified(true);
      alert('UPI ID verified successfully!');
    } else {
      alert('Please enter a valid UPI ID (e.g., user@paytm)');
    }
  };

  const handleGenerateOtp = async () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      alert('Please enter a valid 10-digit mobile number');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: mobileNumber }),
      });

      const data = await response.json();

      if (data.success) {
        setIsOtpSent(true);
        setIsOtpVerified(false);
        alert('OTP sent successfully!');
      } else {
        alert(data.error || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      alert('An error occurred while sending OTP.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert('Please enter OTP');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mobile: mobileNumber, otp }),
      });

      const data = await response.json();

      if (data.success) {
        setIsOtpVerified(true);
        alert('OTP Verified Successfully!');
      } else {
        alert(data.error || 'Incorrect OTP. Please try again.');
      }
    } catch (err) {
      alert('An error occurred while verifying OTP.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handlePayNow = () => {
  if (selectedApp && isVerified && isOtpVerified) {
    alert(`Redirecting to ${selectedApp} for payment... This is a demo implementation.`);
    // Clear all fields and states
    setUpiId('');
    setMobileNumber('');
    setOtp('');
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setIsVerified(false);
    setSelectedApp('');
    setLoading(false);

    onClose();
  } else {
    alert('Please verify UPI ID, mobile number, and OTP before proceeding.');
  }
};
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone size={20} />
            Pay via UPI
          </DialogTitle>
          <p className="text-sm text-gray-600">Select any UPI App to pay using your UPI ID</p>
        </DialogHeader>

        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block">Enter UPI ID</label>
            <div className="flex gap-2">
              <Input
                placeholder="yourname@paytm"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="flex-1"
                disabled={isVerified}
              />
              <Button variant="outline" onClick={handleVerifyUpiId} disabled={!upiId || isVerified}>
                VERIFY
              </Button>
            </div>
            {isVerified && (
              <p className="text-green-600 text-xs mt-1">✓ UPI ID verified successfully</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Enter Mobile Number</label>
            <div className="flex gap-2">
              <Input
                placeholder="10-digit mobile number"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                className="flex-1"
                type="tel"
                disabled={isOtpSent}
              />
              <Button
                variant="outline"
                onClick={handleGenerateOtp}
                disabled={!mobileNumber || loading || isOtpSent}
              >
                {loading ? 'Sending...' : 'Generate OTP'}
              </Button>
            </div>
          </div>

          {isOtpSent && (
            <div>
              <label className="text-sm font-medium mb-2 block">Enter OTP</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="flex-1"
                  type="number"
                  disabled={isOtpVerified}
                />
                <Button
                  variant="outline"
                  onClick={handleVerifyOtp}
                  disabled={!otp || loading || isOtpVerified}
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </Button>
              </div>
              {isOtpVerified && (
                <p className="text-green-600 text-xs mt-1">✓ OTP verified successfully</p>
              )}
            </div>
          )}

          <div>
            <label className="text-sm font-medium mb-3 block">Select UPI App</label>
            <div className="grid grid-cols-2 gap-3">
              {upiApps.map((app) => (
                <Button
                  key={app.id}
                  variant="outline"
                  className={`h-auto p-4 flex flex-col items-center gap-2 ${app.color} ${
                    selectedApp === app.name ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => setSelectedApp(app.name)}
                >
                  <span className="text-2xl">{app.logo}</span>
                  <span className="text-xs font-medium">{app.name}</span>
                </Button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
           <Button
  onClick={handlePayNow}
  className="w-full bg-green-600 hover:bg-green-700"
  disabled={!selectedApp || !isVerified || !isOtpVerified}
>
  PAY NOW
</Button>

            <div className="text-center text-xs text-gray-500">
              {selectedApp && isVerified && isOtpVerified
                ? `Ready to pay with ${selectedApp}`
                : 'Please verify UPI ID, mobile number and OTP'}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UPIModal;
