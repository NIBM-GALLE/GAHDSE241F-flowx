import express from 'express';
import { 
  registerUser, 
  loginUser, 
  logoutUser 
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);

export default router;