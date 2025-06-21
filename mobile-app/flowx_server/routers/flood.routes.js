import { Router } from 'express';
import {
  getCurrentFlood,
  getTodayFloodDetails,
  predictFloodML,
  predictFloodRiskForUser,
  getUserFloodRiskFromDB,
  calculateFloodRisk
} from '../controllers/flood.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/current', getCurrentFlood);
router.get('/today-details', getTodayFloodDetails);
router.post('/predict-ml', predictFloodML);
router.post('/predict-risk', predictFloodRiskForUser);
router.get('/user-risk', protect, getUserFloodRiskFromDB);
router.post('/calculate-risk', calculateFloodRisk);

console.log('Registering /api/flood routes...');
console.log('Available flood routes:');
console.log(router.stack.map(r => r.route && r.route.path).filter(Boolean));

export default router;
