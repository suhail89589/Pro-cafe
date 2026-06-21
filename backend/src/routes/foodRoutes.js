import express from 'express';
import {
  getFoods,
  getFoodById,
  createFood,
  updateFood,
  deleteFood,
} from '../controllers/foodController.js';
import protect from '../middlewares/authMiddleware.js';
import admin from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getFoods)
  .post(protect, admin, createFood);

router.route('/:id')
  .get(getFoodById)
  .put(protect, admin, updateFood)
  .delete(protect, admin, deleteFood);

export default router;
