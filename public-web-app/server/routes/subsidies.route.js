import express from 'express';
import { 
    getNewSubsidies,
    getSubsidiesHistory,
    getAllSubsidiesForFlood
} from '../controllers/subsidies.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/available', protect, getNewSubsidies);
router.get('/history', protect, getSubsidiesHistory);
router.get('/all-for-flood', getAllSubsidiesForFlood);

export default router;