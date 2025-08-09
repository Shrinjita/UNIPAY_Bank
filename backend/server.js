require('dotenv').config();
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const twilio = require('twilio');
const Stripe = require('stripe');

const app = express();
const PORT = process.env.PORT || 5000;

// Twilio config (optional)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhone = process.env.TWILIO_PHONE_NUMBER;
let twilioClient = null;
if (accountSid && authToken) {
  try {
    twilioClient = twilio(accountSid, authToken);
  } catch (e) {
    console.warn('Twilio init failed:', e.message);
  }
}

// Stripe config
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// CORS config allowing your frontend
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:8080'; // Update with your frontend URL
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true); // Allow Postman etc.
    if (origin === FRONTEND_URL) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  }
}));

app.use(express.json());

// Setup upload directory and multer storage
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB

// Serve uploaded files statically
app.use('/uploads', express.static(uploadDir));

// In-memory stores (replace with DB in prod)
const otpStore = new Map();
const otpExpiryMs = 5 * 60 * 1000; // 5 min
const txnStore = new Map();

// --- Routes ---

// Health check
app.get('/', (req, res) => res.send('Unified Backend Server running'));

// Upload KYC file
app.post('/upload-kyc', upload.single('kycFile'), (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, error: 'No file uploaded' });
  const fileURL = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  res.json({ success: true, fileURL });
});

// Send OTP
app.post('/api/send-otp', async (req, res) => {
  const { mobile } = req.body;
  if (!mobile || !/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ success: false, error: 'Invalid mobile number' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    if (!twilioClient) throw new Error('Twilio not configured, sending demo OTP');
    await twilioClient.messages.create({
      body: `Your OTP for UniPay is: ${otp}`,
      from: twilioPhone,
      to: `+91${mobile}`,
    });
    otpStore.set(mobile, { otp, expiresAt: Date.now() + otpExpiryMs });
    return res.json({ success: true, message: 'OTP sent successfully' });
  } catch (err) {
    console.warn('Twilio failed or not configured; using demo OTP:', err.message);
    otpStore.set(mobile, { otp: '123456', expiresAt: Date.now() + otpExpiryMs });
    return res.json({ success: true, message: 'OTP sent (demo) — use 123456' });
  }
});

// Verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) return res.status(400).json({ success: false, error: 'mobile and otp required' });

  const rec = otpStore.get(mobile);
  if (!rec) return res.status(400).json({ success: false, error: 'No OTP requested for this mobile' });
  if (Date.now() > rec.expiresAt) {
    otpStore.delete(mobile);
    return res.status(400).json({ success: false, error: 'OTP expired' });
  }
  if (rec.otp !== otp) return res.status(400).json({ success: false, error: 'Incorrect OTP' });

  otpStore.delete(mobile);
  return res.json({ success: true, message: 'OTP verified' });
});

// Create transaction: generate txnRef and store pending
app.post('/api/create-transaction', (req, res) => {
  const { amount } = req.body;
  if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
    // optionally reject invalid amounts here, currently allowing zero
  }
  const txnRef = `UNI${Date.now()}`;
  txnStore.set(txnRef, { amount: Number(amount) || 0, createdAt: new Date().toISOString(), status: 'pending' });
  return res.json({ success: true, txnRef });
});

// Log UPI intent attempts
app.post('/api/log-intent', (req, res) => {
  try {
    const payload = req.body || {};
    const line = JSON.stringify({ ...payload, serverTime: new Date().toISOString() }) + '\n';
    fs.appendFileSync(path.join(__dirname, 'intent_logs.txt'), line);
    return res.json({ success: true });
  } catch (err) {
    console.error('log-intent error', err);
    return res.status(500).json({ success: false, error: 'Log failed' });
  }
});

// Stripe checkout session creation
app.post('/create-checkout-session', async (req, res) => {
  const { amount } = req.body;
  const parsedAmount = parseInt(amount);

  if (!parsedAmount || isNaN(parsedAmount) || parsedAmount <= 0) {
    return res.status(400).json({ error: 'Invalid amount provided' });
  }

  const hardcodedProductName = 'Premium Service Subscription';
  const hardcodedCustomerEmail = 'sahilvarde77@gmail.com';
  const hardcodedCustomerName = 'Sahil Varde';
  const hardcodedCustomerAddress = {
    line1: '123 Main Street',
    line2: '',
    city: 'Pune',
    state: 'MH',
    postal_code: '410504',
    country: 'IN',
  };

  try {
    const customer = await stripe.customers.create({
      email: hardcodedCustomerEmail,
      name: hardcodedCustomerName,
      address: hardcodedCustomerAddress,
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'inr',
            product_data: { name: hardcodedProductName },
            unit_amount: parsedAmount * 100,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer: customer.id,
      success_url: `${FRONTEND_URL}/NetBanking?success=true`,
      cancel_url: `${FRONTEND_URL}/NetBanking?canceled=true`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
