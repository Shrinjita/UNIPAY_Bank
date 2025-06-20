// backend/server.js
require('dotenv').config(); // Load .env first

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const twilio = require('twilio');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Access environment variables
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

// File upload config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Upload KYC API
app.post('/upload-kyc', upload.single('kycFile'), (req, res) => {
  const filePath = req.file.path;
  res.json({ fileURL: filePath });
});

app.use(cors());
app.use(bodyParser.json());

// In-memory OTP store
const otpStore = new Map();
const otpExpiryTime = 5 * 60 * 1000; // 5 minutes

// Send OTP
app.post('/api/send-otp', async (req, res) => {
  const { mobile } = req.body;
  if (!mobile || !/^\d{10}$/.test(mobile)) {
    return res.status(400).json({ success: false, error: 'Invalid mobile number' });
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  try {
    await client.messages.create({
      body: `Your OTP for UniPay is: ${otp}`,
      from: twilioPhoneNumber,
      to: `+91${mobile}`,
    });

    otpStore.set(mobile, { otp, expiresAt: Date.now() + otpExpiryTime });

    res.json({ success: true, message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error sending OTP:', error.message);
    res.status(500).json({ success: false, error: 'Failed to send OTP' });
  }
});

// Verify OTP
app.post('/api/verify-otp', (req, res) => {
  const { mobile, otp } = req.body;
  if (!mobile || !otp) {
    return res.status(400).json({ success: false, error: 'Mobile and OTP required' });
  }

  const record = otpStore.get(mobile);
  if (!record) {
    return res.status(400).json({ success: false, error: 'No OTP request found for this mobile' });
  }

  if (Date.now() > record.expiresAt) {
    otpStore.delete(mobile);
    return res.status(400).json({ success: false, error: 'OTP expired, please request a new one' });
  }

  if (record.otp !== otp) {
    return res.status(400).json({ success: false, error: 'Incorrect OTP' });
  }

  otpStore.delete(mobile);
  res.json({ success: true, message: 'OTP verified successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
