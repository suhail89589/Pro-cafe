import mongoose from 'mongoose';

const foodSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a food name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
    },
    rating: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating must be at most 5'],
    },
    stock: {
      type: Number,
      default: 99,
    },
    ingredients: {
      type: [String],
      default: [],
    },
    availability: {
      type: Boolean,
      default: true,
    },
    isSpecial: {
      type: Boolean,
      default: false,
    },
    isBOGOEligible: {
      type: Boolean,
      default: false,
    },
    isVeg: {
      type: Boolean,
      default: true,
    }
  },
  {
    timestamps: true,
  }
);

const Food = mongoose.model('Food', foodSchema);
export default Food;
