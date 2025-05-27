import express from 'express';
import { 
    requestShelter,
    getAssignedShelter,
} from '../controllers/shelterController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/request', verifyToken, requestShelter);
router.get('/assigned', verifyToken, getAssignedShelter);

export default router;