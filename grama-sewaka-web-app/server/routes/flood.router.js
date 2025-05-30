import express from 'express';
import {
  insertFlood,
  insertFloodDetails,
  updateFloodStatus,
  updateFloodDetails,
  getAllFloods,
  getFloodDetails
} from '../controllers/flood.controller.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes protected and only for administrators
router.use(authMiddleware);

router.post('/', insertFlood);
router.post('/details', insertFloodDetails);
router.put('/:floodId/status', updateFloodStatus);
router.put('/details/:floodDetailId', updateFloodDetails);
router.get('/', getAllFloods);
router.get('/:floodId/details', getFloodDetails);

export default router;