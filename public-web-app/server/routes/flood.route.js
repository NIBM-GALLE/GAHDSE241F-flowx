import express from 'express';
import {
  getCurrentFlood,
  getTodayFloodDetails,
  predictFloodRiskForUser,
  predictFloodML,
  getUserFloodRiskFromDB,
  calculateFloodRisk
} from '../controllers/flood.controller.js';

const router = express.Router();

//existing routes
router.get('/current', getCurrentFlood);
router.get('/details/today', getTodayFloodDetails);
router.post('/predict-ml', predictFloodML);

//flood risk prediction routes
router.post('/predict-user-risk', predictFloodRiskForUser);
router.post('/calculate-risk', calculateFloodRisk);
router.get('/user-risk', getUserFloodRiskFromDB);

export default router;