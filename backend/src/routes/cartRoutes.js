import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from '../controllers/cartController.js';
import protect from '../middlewares/authMiddleware.js';

const router = express.Router();

// Apply protect middleware to all cart endpoints
router.use(protect);

router.route('/')
  .get(getCart);

router.route('/add')
  .post(addToCart);

router.route('/update')
  .put(updateCartItem);

router.route('/remove/:id')
  .delete(removeFromCart);

router.route('/clear')
  .delete(clearCart);

export default router;
