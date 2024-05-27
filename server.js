require('dotenv').config();

import express from 'express';
import Stripe from 'stripe';
import { json } from 'body-parser';
import cors from 'cors';

const app = express();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

app.use(cors());
app.use(json());

app.post('/create-checkout-session', async (req, res) => {
  const { chrono, authcode, phone, name, userUid, start, selectedCourt } = req.body;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: 'price_1NpSirDfCWORHf3vw20rFL3c',
          quantity: chrono,
        },
      ],
      mode: 'payment',
      success_url: `https://squashredone.firebaseapp.com/paid.html?code=${authcode}&phone=${phone}&name=${name}&userUid=${userUid}&start=${start}&court=${selectedCourt}`,
      cancel_url: 'https://squashredone.firebaseapp.com/booknow.html',
    });

    res.json({ id: session.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
