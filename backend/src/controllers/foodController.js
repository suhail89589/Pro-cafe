import Food from '../models/Food.js';
import mongoose from 'mongoose';

// @desc    Get all food items
// @route   GET /api/foods
// @access  Public
export const getFoods = async (req, res) => {
  const category = req.query.category;
  const filter = {};

  if (category && category !== 'All') {
    filter.category = category;
  }

  try {
    const foods = await Food.find(filter);
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single food item
// @route   GET /api/foods/:id
// @access  Public
export const getFoodById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid food item identifier' });
  }
  try {
    const food = await Food.findById(req.params.id);

    if (food) {
      res.json(food);
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a food item
// @route   POST /api/foods
// @access  Private/Admin
export const createFood = async (req, res) => {
  const { name, price, description, image, category, rating, stock, ingredients, availability, isSpecial, isBOGOEligible, isVeg } = req.body;

  try {
    const food = new Food({
      name,
      price,
      description,
      image,
      category,
      rating,
      stock,
      ingredients,
      availability,
      isSpecial,
      isBOGOEligible,
      isVeg,
    });

    const createdFood = await food.save();
    res.status(201).json(createdFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update a food item
// @route   PUT /api/foods/:id
// @access  Private/Admin
export const updateFood = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid food item identifier' });
  }
  const { name, price, description, image, category, rating, stock, ingredients, availability, isSpecial, isBOGOEligible, isVeg } = req.body;

  try {
    const food = await Food.findById(req.params.id);

    if (food) {
      food.name = name ?? food.name;
      food.price = price ?? food.price;
      food.description = description ?? food.description;
      food.image = image ?? food.image;
      food.category = category ?? food.category;
      food.rating = rating ?? food.rating;
      food.stock = stock ?? food.stock;
      food.ingredients = ingredients ?? food.ingredients;
      food.availability = availability ?? food.availability;
      food.isSpecial = isSpecial ?? food.isSpecial;
      food.isBOGOEligible = isBOGOEligible ?? food.isBOGOEligible;
      food.isVeg = isVeg ?? food.isVeg;

      const updatedFood = await food.save();
      res.json(updatedFood);
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a food item
// @route   DELETE /api/foods/:id
// @access  Private/Admin
export const deleteFood = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid food item identifier' });
  }
  try {
    const result = await Food.deleteOne({ _id: req.params.id });

    if (result.deletedCount > 0) {
      res.json({ message: 'Food item removed' });
    } else {
      res.status(404).json({ message: 'Food item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
