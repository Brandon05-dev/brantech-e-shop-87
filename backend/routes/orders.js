import express from 'express';
import {
  createOrder,
  getOrders,
  getOrder,
  updateOrderStatus,
  getUserOrders,
  deleteOrder
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .post(protect, createOrder)
  .get(protect, admin, getOrders);

router.get('/myorders', protect, getUserOrders);

router.route('/:id')
  .get(protect, getOrder)
  .put(protect, admin, updateOrderStatus)
  .delete(protect, admin, deleteOrder);

export default router;
