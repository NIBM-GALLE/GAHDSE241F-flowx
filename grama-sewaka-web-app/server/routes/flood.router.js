import express from 'express';
import {
  insertFlood,
  insertFloodDetails,
  updateFloodStatus,
  updateFloodDetails,
  getAllFloods,
  getFloodDetails,
  updateFlood,
  getCurrentFlood,
  getPastFloods,
  getCurrentFloodDetails,
  getPastFloodDetails,
  updateFloodDetailsFields,
  getTodayFloodDetails,
  predictFloodML,
  predictFloodRiskForUser,
  getFloodStatistics,
  getCurrentFloodSummary,
  getPastFloodsSummary,
} from '../controllers/flood.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// public routes
router.get('/details/today', getTodayFloodDetails);
router.post('/predict-ml', predictFloodML);
router.post('/predict-user-risk', predictFloodRiskForUser);
router.get('/statistics', getFloodStatistics);
router.get('/summary/current', getCurrentFloodSummary);
router.get('/summary/past', getPastFloodsSummary);

// protect all other routes
router.use(protect);

router.post('/', insertFlood);
router.post('/details', insertFloodDetails);
router.put('/:flood_id/status', updateFloodStatus);
router.put('/details/:flood_details_id', updateFloodDetails);
router.put('/:flood_id', updateFlood);
router.put('/details/:flood_details_id/fields', updateFloodDetailsFields);

router.get('/current', getCurrentFlood);
router.get('/past', getPastFloods);
router.get('/', getAllFloods);
router.get('/:flood_id/details', getFloodDetails);
router.get('/details/current', getCurrentFloodDetails);
router.get('/details/past', getPastFloodDetails);

export default router;