import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from '../controllers/orderController.js';
import protect from '../middlewares/authMiddleware.js';
import admin from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.use(protect);

router.route('/')
  .post(createOrder)
  .get(getMyOrders);

router.route('/admin')
  .get(admin, getAllOrders);

router.route('/:id')
  .get(getOrderById)
  .delete(cancelOrder);

router.route('/:id/status')
  .put(admin, updateOrderStatus);

export default router;
