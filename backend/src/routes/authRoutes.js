import express from 'express';
import {
  registerUser,
  authUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  refreshAccessToken,
  getUsers,
} from '../controllers/authController.js';
import protect from '../middlewares/authMiddleware.js';
import admin from '../middlewares/adminMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/refresh', refreshAccessToken);
router.post('/logout', logoutUser);

router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/users').get(protect, admin, getUsers);

export default router;
