import express from 'express';
import { 
    getNewSubsidies,
    getSubsidiesHistory
} from '../controllers/subsidies.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/available', verifyToken, getNewSubsidies);
router.get('/history', verifyToken, getSubsidiesHistory);

export default router;