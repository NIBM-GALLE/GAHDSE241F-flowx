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

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/check-house/:houseId', checkHouseId);
router.get('/profile', getUserProfile);
router.put('/profile', updateUserProfile);
router.get('/house-details', getUserHouseDetails);
router.get('/house-members', getUserHouseMembers);

export default router;
