import express from 'express';
import { 
    requestShelter,
    getShelterInfo,
    getShelterRequestHistory,
    getUserRelatedShelters,
    
} from '../controllers/shelter.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/request', verifyToken, requestShelter);
router.get('/assigned', verifyToken, getAssignedShelter);

export default router;