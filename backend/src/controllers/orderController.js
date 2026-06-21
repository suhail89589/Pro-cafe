import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Food from '../models/Food.js';
import mongoose from 'mongoose';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

  try {
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Verify stock and price details
    const orderItems = [];
    for (const item of items) {
      if (!mongoose.Types.ObjectId.isValid(item.foodId)) {
        return res.status(400).json({ message: `Invalid food item identifier: ${item.foodId}` });
      }
      const food = await Food.findById(item.foodId);
      if (!food) {
        return res.status(404).json({ message: `Food item not found: ${item.foodId}` });
      }

      // Check stock
      if (food.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${food.name}` });
      }

      // Deduct stock
      food.stock -= item.quantity;
      await food.save();

      orderItems.push({
        foodId: item.foodId,
        name: food.name,
        quantity: item.quantity,
        price: food.price,
      });
    }

    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryAddress,
      paymentMethod,
      paymentStatus: paymentMethod === 'Card' ? 'Paid' : 'Pending',
      orderStatus: 'Pending',
    });

    const createdOrder = await order.save();

    // Clear user cart since order is placed
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders
// @access  Private
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid order identifier' });
  }
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (order) {
      // Check user permission
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders (Admin Only)
// @route   GET /api/orders/admin
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
export const updateOrderStatus = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid order identifier' });
  }
  const { status, paymentStatus } = req.body;

  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (status) {
        order.orderStatus = status;
      }
      if (paymentStatus) {
        order.paymentStatus = paymentStatus;
      }

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Cancel order
// @route   DELETE /api/orders/:id
// @access  Private
export const cancelOrder = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid order identifier' });
  }
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Authorize: Owner or Admin
      if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to cancel this order' });
      }

      if (order.orderStatus !== 'Pending') {
        return res.status(400).json({ message: 'Order can only be cancelled while pending' });
      }

      // Restore stock
      for (const item of order.items) {
        const food = await Food.findById(item.foodId);
        if (food) {
          food.stock += item.quantity;
          await food.save();
        }
      }

      order.orderStatus = 'Cancelled';
      await order.save();
      res.json({ message: 'Order cancelled successfully', order });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
