import { Router } from 'express';
import {
  createVictimRequest,
  getVictimRequests
} from '../controllers/victim.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/request', protect, createVictimRequest);
router.get('/requests', protect, getVictimRequests);

export default router;
