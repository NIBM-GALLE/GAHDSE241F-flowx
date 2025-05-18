import express from 'express';
import { 
    registerUser, 
    loginUser, 
    logoutUser,
    checkHouseId
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', verifyToken, logoutUser);
router.get('/check-house/:houseId', checkHouseId);

export default router;