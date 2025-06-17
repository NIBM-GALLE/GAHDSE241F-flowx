import { Router } from 'express';
import {
  requestShelter,
  getShelterInfo,
  getShelterRequestHistory,
  getUserRelatedShelters
} from '../controllers/shelter.controller.js';

const router = Router();

router.post('/request', requestShelter);
router.get('/info', getShelterInfo);
router.get('/history', getShelterRequestHistory);
router.get('/related', getUserRelatedShelters);

export default router;
