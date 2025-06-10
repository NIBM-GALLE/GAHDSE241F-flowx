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
} from '../controllers/flood.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// public routes
router.get('/details/today', getTodayFloodDetails);
router.post('/predict-ml', predictFloodML);
router.post('/predict-user-risk', predictFloodRiskForUser);

// protect all other routes
router.use(protect);

router.post('/', insertFlood);
router.post('/details', insertFloodDetails);
router.put('/:flood_id/status', updateFloodStatus);
router.put('/details/:flood_details_id', updateFloodDetails);
router.put('/:flood_id', updateFlood);
router.put('/details/:flood_details_id/fields', updateFloodDetailsFields); // Update only changed fields for flood_details

router.get('/current', getCurrentFlood);
router.get('/past', getPastFloods);
router.get('/', getAllFloods);
router.get('/:flood_id/details', getFloodDetails);
router.get('/details/current', getCurrentFloodDetails); // Get most recent flood_details
router.get('/details/past', getPastFloodDetails); // Get all past flood_details (excluding current)

export default router;