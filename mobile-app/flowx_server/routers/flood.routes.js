import { Router } from 'express';
import {
  getCurrentFlood,
  getTodayFloodDetails,
  predictFloodML,
  predictFloodRiskForUser,
  getUserFloodRiskFromDB,
  calculateFloodRisk
} from '../controllers/flood.controller.js';

const router = Router();

router.get('/current', getCurrentFlood);
router.get('/today-details', getTodayFloodDetails);
router.post('/predict-ml', predictFloodML);
router.post('/predict-risk', predictFloodRiskForUser);
router.all('/user-risk', getUserFloodRiskFromDB);
router.post('/calculate-risk', calculateFloodRisk);

export default router;
