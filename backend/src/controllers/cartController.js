import Cart from '../models/Cart.js';
import Food from '../models/Food.js';
import mongoose from 'mongoose';

// Helper to populate and calculate subtotals in the cart response
const getPopulatedCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId }).populate('items.foodId');
  if (!cart) {
    cart = await Cart.create({ user: userId, items: [] });
  }
  return cart;
};

// @desc    Get user cart
// @route   GET /api/cart
// @access  Private
export const getCart = async (req, res) => {
  try {
    const cart = await getPopulatedCart(req.user._id);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add item to cart
// @route   POST /api/cart/add
// @access  Private
export const addToCart = async (req, res) => {
  const { foodId, quantity } = req.body;
  if (!mongoose.Types.ObjectId.isValid(foodId)) {
    return res.status(400).json({ message: 'Invalid food item identifier' });
  }

  try {
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(item => item.foodId.toString() === foodId);

    const price = food.price;
    const qty = Number(quantity) || 1;

    if (itemIndex > -1) {
      // Item already exists, increment quantity
      cart.items[itemIndex].quantity += qty;
      cart.items[itemIndex].subtotal = cart.items[itemIndex].quantity * price;
    } else {
      // New item
      cart.items.push({
        foodId,
        quantity: qty,
        subtotal: qty * price,
      });
    }

    await cart.save();
    const populatedCart = await getPopulatedCart(req.user._id);
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/update
// @access  Private
export const updateCartItem = async (req, res) => {
  const { foodId, quantity } = req.body;
  if (!mongoose.Types.ObjectId.isValid(foodId)) {
    return res.status(400).json({ message: 'Invalid food item identifier' });
  }

  try {
    const food = await Food.findById(foodId);
    if (!food) {
      return res.status(404).json({ message: 'Food item not found' });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(item => item.foodId.toString() === foodId);

    if (itemIndex > -1) {
      const qty = Number(quantity);
      if (qty <= 0) {
        cart.items.splice(itemIndex, 1);
      } else {
        cart.items[itemIndex].quantity = qty;
        cart.items[itemIndex].subtotal = qty * food.price;
      }
      await cart.save();
      const populatedCart = await getPopulatedCart(req.user._id);
      res.json(populatedCart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/remove/:id
// @access  Private
export const removeFromCart = async (req, res) => {
  const foodId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(foodId)) {
    return res.status(400).json({ message: 'Invalid food item identifier' });
  }

  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(item => item.foodId.toString() !== foodId);
    await cart.save();

    const populatedCart = await getPopulatedCart(req.user._id);
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Clear user cart
// @route   DELETE /api/cart/clear
// @access  Private
export const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    const populatedCart = await getPopulatedCart(req.user._id);
    res.json(populatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
