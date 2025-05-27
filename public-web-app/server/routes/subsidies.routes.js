import express from 'express';
import { 
    getAvailableSubsidies,
    getSubsidyHistory
} from '../controllers/subsidies.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/available', verifyToken, getAvailableSubsidies);
router.get('/history', verifyToken, getSubsidyHistory);

export default router;