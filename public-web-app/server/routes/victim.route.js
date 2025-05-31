import express from 'express';
import { 
  createVictimRequest, 
  getVictimRequests 
} from '../controllers/victim.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/request', protect, createVictimRequest);
router.get('/history', protect, getVictimRequests);

export default router;