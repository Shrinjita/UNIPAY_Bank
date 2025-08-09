

// src/components/UPIModal.tsx
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Smartphone } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";

/**
 * Hardcoded merchant details (as requested)
 */
const MERCHANT_UPI_ID = "sahilvarde17-1@oksbi";
const MERCHANT_NAME = "Sahil Varde";

interface UPIModalProps {
  open: boolean;
  onClose: () => void;
}

const upiApps = [
  { id: "gpay", name: "Google Pay", logo: "🔵", package: "com.google.android.apps.nbu.paisa.user" },
  { id: "phonepe", name: "PhonePe", logo: "🟣", package: "com.phonepe.app" },
  { id: "paytm", name: "Paytm", logo: "🔵", package: "net.one97.paytm" },
  { id: "amazon", name: "Amazon Pay", logo: "🟠", package: "in.amazon.mShop.android.shopping" },
  { id: "bhim", name: "BHIM", logo: "🟢", package: "" }, // package optional
];

const API_BASE = import.meta.env.VITE_API_BASE || "http://http://192.168.1.102:5000";

const UPIModal: React.FC<UPIModalProps> = ({ open, onClose }) => {
  const [amount, setAmount] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isUpiVerified, setIsUpiVerified] = useState(true); // UPI hardcoded so verified by default
  const [loading, setLoading] = useState(false);
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [txnRef, setTxnRef] = useState<string | null>(null);

  // Validate amount numeric > 0
  const isValidAmount = () => {
    if (!amount) return false;
    const n = Number(amount);
    return !isNaN(n) && n > 0;
  };

  const handleGenerateOtp = async () => {
    if (!/^\d{10}$/.test(mobileNumber)) {
      alert("Enter a valid 10-digit Indian mobile number");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobileNumber }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOtpSent(true);
        setIsOtpVerified(false);
        alert(data.message || "OTP sent. Use 123456 in demo mode.");
      } else {
        alert(data.error || "Failed to send OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      alert("Enter OTP");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mobile: mobileNumber, otp }),
      });
      const data = await res.json();
      if (data.success) {
        setIsOtpVerified(true);
        alert("OTP verified");
      } else {
        alert(data.error || "Incorrect OTP");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying OTP");
    } finally {
      setLoading(false);
    }
  };

  // Ask backend to create a transaction ref
  const createTransactionRef = async (amt: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/create-transaction`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: amt }),
      });
      const data = await res.json();
      if (data.success && data.txnRef) {
        setTxnRef(data.txnRef);
        return data.txnRef;
      }
    } catch (err) {
      console.warn("create txn failed", err);
    }
    const fallback = `TXN${Date.now()}`;
    setTxnRef(fallback);
    return fallback;
  };

  // Build UPI URL
  const buildUpiUrl = (txn: string) => {
    const pa = encodeURIComponent(MERCHANT_UPI_ID);
    const pn = encodeURIComponent(MERCHANT_NAME);
    const am = encodeURIComponent(Number(Number(amount).toFixed(2)).toString());
    const tn = encodeURIComponent(`Order ${txn}`);
    const tr = encodeURIComponent(txn);
    const cu = "INR";
    return `upi://pay?pa=${pa}&pn=${pn}&tn=${tn}&am=${am}&cu=${cu}&tr=${tr}`;
  };

  // Attempt to open UPI intent; optionally pass appPackage for Android intent
  const openUpi = async (appPackage?: string) => {
    if (!isValidAmount()) {
      alert("Enter a valid amount greater than 0");
      return;
    }
    if (!isOtpVerified) {
      alert("Please verify mobile via OTP before proceeding");
      return;
    }

    setLoading(true);
    try {
      const txn = await createTransactionRef(amount);
      const upiUrl = buildUpiUrl(txn);

      // Android intent URI when package present
      let uri = upiUrl;
      if (appPackage) {
        // Intent format — will ask Android to open the specific package
        // NOTE: Some browsers may restrict `intent:`; test on Android Chrome
        const params = `pa=${encodeURIComponent(MERCHANT_UPI_ID)}&pn=${encodeURIComponent(MERCHANT_NAME)}&tn=${encodeURIComponent(
          `Order ${txn}`
        )}&am=${encodeURIComponent(Number(Number(amount).toFixed(2)).toString())}&cu=INR&tr=${encodeURIComponent(txn)}`;
        uri = `intent://upi/pay?${params}#Intent;scheme=upi;package=${appPackage};end`;
      }

      // Log attempt
      fetch(`${API_BASE}/api/log-intent`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          txnRef: txn,
          upiId: MERCHANT_UPI_ID,
          amount,
          appPackage: appPackage || "generic",
          attemptedAt: new Date().toISOString(),
        }),
      }).catch((e) => console.warn("log failed", e));

      // Open the payment URI (mobile browsers will forward to app)
      window.location.href = uri;
    } catch (err) {
      console.error(err);
      alert("Failed to open UPI app. Try scanning the QR code instead.");
    } finally {
      setLoading(false);
    }
  };

  const upiUrlForQr = async () => {
    const txn = await createTransactionRef(amount || "0.00");
    return buildUpiUrl(txn);
  };

  // simple reset
  const resetAll = () => {
    setAmount("");
    setMobileNumber("");
    setOtp("");
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setTxnRef(null);
    setSelectedApp(null);
  };

  // responsive layout + same UI feel as before, with amount section and QR
  return (
    <Dialog open={open} onOpenChange={onClose}>
  <DialogContent
    className="w-full max-w-lg sm:max-w-xl md:max-w-2xl max-h-[90vh] overflow-y-auto p-4 rounded-xl"
  >
    <DialogHeader className="sticky top-0 bg-white z-10 pb-2">
      <DialogTitle className="flex items-center gap-3 text-base sm:text-lg">
        <Smartphone size={20} />
        Pay via UPI
      </DialogTitle>
      <p className="text-xs sm:text-sm text-gray-500">
        Pay to <strong>{MERCHANT_NAME}</strong> ({MERCHANT_UPI_ID})
      </p>
    </DialogHeader>

    <div className="space-y-5 p-1 sm:p-2">
      {/* Amount */}
      <div>
        <label className="text-xs sm:text-sm font-medium mb-2 block">Amount (INR)</label>
        <Input
          placeholder="e.g. 199.00"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full"
          inputMode="decimal"
        />
        <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
          Enter amount to pay. Example: 149.50
        </p>
      </div>

      {/* Mobile + OTP */}
      <div>
        <label className="text-xs sm:text-sm font-medium mb-2 block">Mobile Number</label>
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            placeholder="10-digit mobile number"
            value={mobileNumber}
            onChange={(e) => setMobileNumber(e.target.value)}
            className="flex-1"
            type="tel"
            disabled={isOtpSent}
          />
          <Button
            onClick={handleGenerateOtp}
            disabled={!/^\d{10}$/.test(mobileNumber) || loading || isOtpSent}
            className="w-full sm:w-auto"
          >
            {loading ? "Sending..." : "Generate OTP"}
          </Button>
        </div>

        {isOtpSent && (
          <div className="mt-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1"
              />
              <Button
                onClick={handleVerifyOtp}
                disabled={!otp || loading || isOtpVerified}
                className="w-full sm:w-auto"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </Button>
            </div>
            {isOtpVerified && (
              <p className="text-green-600 text-[10px] sm:text-xs mt-1">✓ OTP verified</p>
            )}
          </div>
        )}
      </div>

      {/* App selection */}
      <div>
        <label className="text-xs sm:text-sm font-medium mb-3 block">
          Choose UPI App (optional)
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {upiApps.map((app) => (
            <button
              key={app.id}
              onClick={() => setSelectedApp(selectedApp === app.name ? null : app.name)}
              className={`p-3 rounded-lg border flex flex-col items-center gap-2 text-[10px] sm:text-xs ${
                selectedApp === app.name ? "ring-2 ring-primary" : ""
              }`}
            >
              <div className="text-xl sm:text-2xl">{app.logo}</div>
              <div className="font-medium">{app.name}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Payment CTA + QR */}
      <div className="space-y-2">
        <Button
          onClick={() => {
            const pkg = upiApps.find((a) => a.name === selectedApp)?.package;
            openUpi(pkg);
          }}
          className="w-full bg-green-600 hover:bg-green-700"
          disabled={!isValidAmount() || !isOtpVerified}
        >
          PAY ₹ {isValidAmount() ? Number(Number(amount).toFixed(2)).toString() : "0.00"}
        </Button>

        <div className="text-center text-[10px] sm:text-xs text-gray-500">
          {isOtpVerified
            ? `Ready to pay ₹${isValidAmount() ? Number(Number(amount).toFixed(2)).toString() : "0.00"} to ${MERCHANT_NAME}`
            : "Verify mobile via OTP to enable payment"}
        </div>

        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 items-center">
          <div className="text-[10px] sm:text-xs text-gray-600">
            <p className="font-medium">Scan QR (desktop users)</p>
            <p className="text-gray-500 text-[10px] sm:text-xs mb-2">
              Scan using your phone's UPI app to pay directly.
            </p>
            {amount && (
              <QRCodeCanvas value={buildUpiUrl(txnRef || `TXN${Date.now()}`)} size={140} />
            )}
          </div>

          <div className="text-[10px] sm:text-xs text-gray-600">
            <p className="font-medium">Manual UPI link</p>
            <p className="text-gray-500 text-[10px] sm:text-xs mb-2 break-words">
              {buildUpiUrl(txnRef || `TXN${Date.now()}`)}
            </p>
            <Button
              onClick={async () => {
                const txn = await createTransactionRef(amount || "0.00");
                const uurl = buildUpiUrl(txn);
                navigator.clipboard?.writeText(uurl).then(() => alert("UPI link copied to clipboard"));
              }}
              className="w-full sm:w-auto"
            >
              Copy UPI Link
            </Button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 justify-between mt-3">
          <Button variant="ghost" onClick={resetAll} className="w-full sm:w-auto">
            RESET
          </Button>
          <Button
            variant="link"
            className="w-full sm:w-auto"
            onClick={() =>
              alert(
                "How it works:\n1) Enter amount and your mobile number\n2) Generate & verify OTP\n3) Tap PAY to open your UPI app with pre-filled details (confirm payment in the UPI app)\n4) Optionally scan the QR from desktop"
              )
            }
          >
            How it works
          </Button>
        </div>
      </div>
    </div>
  </DialogContent>
</Dialog>

  );
};

export default UPIModal;
