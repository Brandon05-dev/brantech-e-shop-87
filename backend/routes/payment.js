import express from 'express';
import {
  initiateMpesaPayment,
  mpesaCallback,
  createStripePaymentIntent
} from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/mpesa/initiate', protect, initiateMpesaPayment);
router.post('/mpesa/callback', mpesaCallback);
router.post('/stripe/create-intent', protect, createStripePaymentIntent);

export default router;
