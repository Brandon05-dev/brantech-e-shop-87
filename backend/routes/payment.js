import express from 'express';
import {
  initiateMpesaPayment,
  mpesaCallback,
  initializePaystackPayment,
  verifyPaystackPayment
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/mpesa/initiate', protect, initiateMpesaPayment);
router.post('/mpesa/callback', mpesaCallback);
router.post('/paystack/initialize', protect, initializePaystackPayment);
router.post('/verify-payment', verifyPaystackPayment);

export default router;
