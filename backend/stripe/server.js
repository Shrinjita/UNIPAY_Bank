// server.js
require('dotenv').config(); // Load env first

const express = require('express');
const Stripe = require('stripe');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5050;

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

// Adjust origin to match your frontend
app.use(cors({ origin: process.env.FRONTEND_URL }));
app.use(express.json());

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
      success_url: `${process.env.FRONTEND_URL}/NetBanking?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/NetBanking?canceled=true`,
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
