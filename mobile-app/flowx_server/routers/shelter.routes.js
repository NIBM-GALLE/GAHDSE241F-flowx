import { Router } from 'express';
import {
  requestShelter,
  getShelterInfo,
  getShelterRequestHistory,
  getUserRelatedShelters,
  getNearbySheltersWithUser
} from '../controllers/shelter.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.post('/request', protect, requestShelter);
router.get('/info', protect, getShelterInfo);
router.get('/history', protect, getShelterRequestHistory);
router.get('/related', protect, getUserRelatedShelters);
router.get('/map',protect, getNearbySheltersWithUser);

export default router;
