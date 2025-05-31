import express from 'express';
import { 
    requestShelter,
    getShelterInfo,
    getShelterRequestHistory,
    getUserRelatedShelters
} from '../controllers/shelter.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Request a new shelter
router.post('/request', protect, requestShelter);
// Get assigned shelter and all available shelters
router.get('/info', protect, getShelterInfo);
// Get shelter request history
router.get('/history', protect, getShelterRequestHistory);
// Get user related shelters
router.get('/related', protect, getUserRelatedShelters);

export default router;