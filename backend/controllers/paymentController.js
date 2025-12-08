import axios from 'axios';
import Stripe from 'stripe';
import Order from '../models/Order.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Initiate M-Pesa payment
// @route   POST /api/payment/mpesa/initiate
// @access  Private
export const initiateMpesaPayment = async (req, res) => {
  try {
    const { orderId, phoneNumber, amount } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Get M-Pesa access token
    const auth = Buffer.from(
      `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const tokenResponse = await axios.get(
      'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
      {
        headers: {
          Authorization: `Basic ${auth}`
        }
      }
    );

    const accessToken = tokenResponse.data.access_token;

    // STK Push
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3);
    const password = Buffer.from(
      `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`
    ).toString('base64');

    const stkResponse = await axios.post(
      'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
      {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: Math.round(amount),
        PartyA: phoneNumber,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phoneNumber,
        CallBackURL: `${process.env.SERVER_URL}/api/payment/mpesa/callback`,
        AccountReference: order.orderNumber,
        TransactionDesc: `Payment for order ${order.orderNumber}`
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      }
    );

    res.json({
      success: true,
      data: stkResponse.data
    });
  } catch (error) {
    console.error('M-Pesa Error:', error.response?.data || error.message);
    res.status(500).json({ message: error.message });
  }
};

// @desc    M-Pesa callback
// @route   POST /api/payment/mpesa/callback
// @access  Public
export const mpesaCallback = async (req, res) => {
  try {
    const { Body } = req.body;

    if (Body.stkCallback.ResultCode === 0) {
      const metadata = Body.stkCallback.CallbackMetadata.Item;
      const mpesaReceiptNumber = metadata.find(
        item => item.Name === 'MpesaReceiptNumber'
      )?.Value;

      const accountReference = Body.stkCallback.AccountReference;

      // Update order
      await Order.findOneAndUpdate(
        { orderNumber: accountReference },
        {
          'paymentDetails.mpesaReceiptNumber': mpesaReceiptNumber,
          'paymentDetails.paymentStatus': 'completed',
          isPaid: true,
          paidAt: Date.now(),
          status: 'paid'
        }
      );
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Callback Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create Stripe payment intent
// @route   POST /api/payment/stripe/create-intent
// @access  Private
export const createStripePaymentIntent = async (req, res) => {
  try {
    const { amount, orderId } = req.body;

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'kes',
      metadata: {
        orderId: order._id.toString(),
        orderNumber: order.orderNumber
      }
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
