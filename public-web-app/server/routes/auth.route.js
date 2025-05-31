import express from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser,
    checkHouseId
} from '../controllers/auth.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', protect, logoutUser);
router.get('/check-house/:houseId', checkHouseId);

export default router;