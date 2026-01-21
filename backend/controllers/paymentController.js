import axios from 'axios';
import Stripe from 'stripe';
import config from '../config/config.js';
import paystackService from '../services/paystack.service.js';
import Order from '../models/Order.js';

const stripe = new Stripe(config.STRIPE_SECRET_KEY);

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

// @desc    Initialize Paystack payment
// @route   POST /api/payment/paystack/initialize
// @access  Private
export const initializePaystackPayment = async (req, res) => {
  try {
    const { email, amount, orderId, callback_url, metadata } = req.body;

    if (!email || !amount) {
      return res.status(400).json({
        success: false,
        message: 'Email and amount are required'
      });
    }

    // Generate unique reference
    const reference = paystackService.generateReference();

    // Convert amount to kobo/cents
    const amountInKobo = paystackService.toSmallestUnit(amount);

    const transactionData = {
      email,
      amount: amountInKobo,
      reference,
      callback_url: callback_url || `${config.CLIENT_URL}/payment/callback`,
      metadata: {
        orderId,
        ...metadata
      }
    };

    const result = await paystackService.initializeTransaction(transactionData);

    res.status(200).json({
      success: true,
      message: 'Payment initialized successfully',
      data: {
        ...result.data,
        reference
      }
    });
  } catch (error) {
    console.error('Payment Initialization Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Verify Paystack payment
// @route   POST /api/payment/verify-payment
// @access  Public
export const verifyPaystackPayment = async (req, res) => {
  try {
    const { reference } = req.body;

    const result = await paystackService.verifyTransaction(reference);

    if (result.verified) {
      // Payment successful - you can add order update logic here
      // Example: Update order status in database
      // await Order.findOneAndUpdate(
      //   { paymentReference: reference },
      //   {
      //     isPaid: true,
      //     paidAt: new Date(),
      //     status: 'paid',
      //     paymentDetails: result.data
      //   }
      // );

      res.status(200).json({
        success: true,
        message: result.message,
        data: result.data
      });
    } else {
      res.status(400).json({
        success: false,
        message: result.message,
        data: result.data
      });
    }
  } catch (error) {
    console.error('Payment Verification Error:', error.message);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
