import { Router } from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  checkHouseId,
  getUserProfile,
  updateUserProfile,
  getUserHouseDetails,
  getUserHouseMembers
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/check-house/:houseId', checkHouseId);
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.get('/house-details', protect, getUserHouseDetails);
router.get('/house-members', protect, getUserHouseMembers);

export default router;
