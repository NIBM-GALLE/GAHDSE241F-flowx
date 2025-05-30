import express from 'express';
import {
  insertFlood,
  insertFloodDetails,
  updateFloodStatus,
  updateFloodDetails,
  getAllFloods,
  getFloodDetails
} from '../controllers/flood.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

//all routes protected and only for administrators
router.use(protect);

router.post('/', insertFlood);
router.post('/details', insertFloodDetails);
router.put('/:flood_id/status', updateFloodStatus);
router.put('/details/:flood_details_id', updateFloodDetails);
router.get('/', getAllFloods);
router.get('/:flood_id/details', getFloodDetails);

export default router;