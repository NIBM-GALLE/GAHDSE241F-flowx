import { Router } from 'express';
import {
  createVictimRequest,
  getVictimRequests
} from '../controllers/victim.controller.js';

const router = Router();

router.post('/request', createVictimRequest);
router.get('/requests', getVictimRequests);

export default router;
