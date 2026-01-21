import express from 'express';
import {
  initiateMpesaPayment,
  mpesaCallback,
  initializePaystackPayment,
  verifyPaystackPayment,
  paystackPaymentSuccess,
  paystackWebhook
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/mpesa/initiate', protect, initiateMpesaPayment);
router.post('/mpesa/callback', mpesaCallback);
router.post('/paystack/initialize', protect, initializePaystackPayment);
router.post('/verify-payment', verifyPaystackPayment);

// Paystack callback and webhook routes
router.get('/payment-success', paystackPaymentSuccess);
router.post('/paystack-webhook', paystackWebhook);

export default router;
