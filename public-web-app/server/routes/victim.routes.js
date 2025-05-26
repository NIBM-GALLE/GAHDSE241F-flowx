import express from 'express';
import { 
  createVictimRequest, 
  getVictimRequests 
} from '../controllers/victim.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/request', verifyToken, createVictimRequest);
router.get('/history', verifyToken, getVictimRequests);

export default router;