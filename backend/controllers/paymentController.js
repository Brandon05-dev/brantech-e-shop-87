import axios from 'axios';
import Stripe from 'stripe';
import config from '../config/config.js';
import paystackService from '../services/paystack.service.js';
import Order from '../models/Order.js';
import crypto from 'crypto';

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

// @desc    Paystack payment success callback
// @route   GET /api/payment/payment-success
// @access  Public
export const paystackPaymentSuccess = async (req, res) => {
  try {
    const { reference, trxref } = req.query;

    if (!reference) {
      return res.status(400).send(`
        <html>
          <head>
            <title>Payment Error - Brantech E-shop</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
              .error { color: #dc3545; }
              .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <h1 class="error">Payment Reference Missing</h1>
            <p>No payment reference was provided.</p>
            <a href="/" class="btn">Return to Store</a>
          </body>
        </html>
      `);
    }

    // Verify the payment with Paystack
    const verification = await paystackService.verifyTransaction(reference);

    if (verification.verified) {
      // Update order status in database
      await Order.findOneAndUpdate(
        { paymentReference: reference },
        {
          isPaid: true,
          paidAt: new Date(),
          status: 'paid',
          paymentDetails: {
            reference: verification.data.reference,
            amount: verification.data.amount,
            currency: verification.data.currency,
            paid_at: verification.data.paid_at,
            channel: verification.data.channel
          }
        }
      );

      // Success page
      res.send(`
        <html>
          <head>
            <title>Payment Successful - Brantech E-shop</title>
            <style>
              body {
                font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                text-align: center;
                padding: 50px;
                background: linear-gradient(135deg, #011b33 0%, #023e7d 100%);
                color: white;
                min-height: 100vh;
                margin: 0;
              }
              .container {
                max-width: 600px;
                margin: 0 auto;
                background: rgba(255, 255, 255, 0.1);
                padding: 40px;
                border-radius: 15px;
                backdrop-filter: blur(10px);
              }
              .success-icon {
                font-size: 80px;
                color: #28a745;
                margin-bottom: 20px;
              }
              h1 { font-size: 32px; margin-bottom: 20px; }
              .details {
                background: rgba(255, 255, 255, 0.1);
                padding: 20px;
                border-radius: 10px;
                margin: 20px 0;
                text-align: left;
              }
              .btn {
                display: inline-block;
                padding: 15px 30px;
                background: #28a745;
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                margin: 10px;
                transition: background 0.3s;
              }
              .btn:hover { background: #218838; }
              .btn.secondary { background: #007bff; }
              .btn.secondary:hover { background: #0056b3; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="success-icon">✓</div>
              <h1>Payment Successful!</h1>
              <p>Thank you for your purchase from Brantech E-shop Solutions.</p>

              <div class="details">
                <h3>Payment Details:</h3>
                <p><strong>Reference:</strong> ${verification.data.reference}</p>
                <p><strong>Amount:</strong> KES ${verification.data.amount.toLocaleString()}</p>
                <p><strong>Payment Method:</strong> ${verification.data.channel || 'Paystack'}</p>
                <p><strong>Date:</strong> ${new Date(verification.data.paid_at).toLocaleDateString()}</p>
              </div>

              <p>Your order is being processed and you will receive a confirmation email shortly.</p>

              <a href="/" class="btn">Continue Shopping</a>
              <a href="/orders" class="btn secondary">View My Orders</a>
            </div>
          </body>
        </html>
      `);
    } else {
      // Payment failed
      res.status(400).send(`
        <html>
          <head>
            <title>Payment Failed - Brantech E-shop</title>
            <style>
              body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
              .error { color: #dc3545; font-size: 60px; margin-bottom: 20px; }
              h1 { color: #dc3545; }
              .btn { display: inline-block; padding: 10px 20px; background: #007bff; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px; }
            </style>
          </head>
          <body>
            <div class="error">✗</div>
            <h1>Payment Verification Failed</h1>
            <p>We could not verify your payment. Please contact support if you were charged.</p>
            <p><strong>Reference:</strong> ${reference}</p>
            <a href="/" class="btn">Return to Store</a>
          </body>
        </html>
      `);
    }
  } catch (error) {
    console.error('Payment Success Callback Error:', error);
    res.status(500).send(`
      <html>
        <head>
          <title>Server Error - Brantech E-shop</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; background: #f8f9fa; }
            .error { color: #dc3545; }
          </style>
        </head>
        <body>
          <h1 class="error">Server Error</h1>
          <p>Something went wrong. Please try again later.</p>
          <a href="/">Return to Store</a>
        </body>
      </html>
    `);
  }
};

// @desc    Paystack webhook handler
// @route   POST /api/payment/paystack-webhook
// @access  Public
export const paystackWebhook = async (req, res) => {
  try {
    // Get the signature from headers
    const signature = req.headers['x-paystack-signature'];

    if (!signature) {
      console.error('No Paystack signature provided');
      return res.status(400).json({ error: 'No signature provided' });
    }

    // Get raw body for signature verification (Buffer from raw middleware)
    const rawBody = req.body.toString();

    // Create expected signature
    const expectedSignature = crypto
      .createHmac('sha512', config.PAYSTACK_SECRET_KEY)
      .update(rawBody)
      .digest('hex');

    // Verify signature
    if (signature !== expectedSignature) {
      console.error('Invalid Paystack signature');
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // Parse the JSON body
    const event = JSON.parse(rawBody);

    console.log('Paystack Webhook Event:', event.event);

    switch (event.event) {
      case 'charge.success':
        await handleChargeSuccess(event.data);
        break;

      case 'charge.failure':
        console.log('Payment failed:', event.data.reference);
        // Handle failed payment if needed
        break;

      default:
        console.log('Unhandled webhook event:', event.event);
    }

    // Always respond with 200 to acknowledge receipt
    res.status(200).json({ status: 'success' });

  } catch (error) {
    console.error('Paystack Webhook Error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
};

// Helper function to handle successful charges
const handleChargeSuccess = async (chargeData) => {
  try {
    const { reference, amount, currency, customer, metadata } = chargeData;

    console.log(`Processing successful charge: ${reference}`);

    // Find and update the order
    const order = await Order.findOneAndUpdate(
      { paymentReference: reference },
      {
        isPaid: true,
        paidAt: new Date(),
        status: 'paid',
        paymentDetails: {
          reference,
          amount: amount / 100, // Convert from kobo/cents
          currency,
          customer,
          metadata,
          paymentMethod: 'paystack',
          verifiedAt: new Date()
        }
      },
      { new: true }
    );

    if (order) {
      console.log(`Order ${order._id} marked as paid`);
      // Here you could send confirmation emails, update inventory, etc.
    } else {
      console.warn(`Order with payment reference ${reference} not found`);
    }

  } catch (error) {
    console.error('Error handling charge success:', error);
    throw error;
  }
};
