import express from 'express';
import {
  getCurrentFlood,
  getTodayFloodDetails
} from '../controllers/flood.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

//all routes protected 
router.use(protect);

router.get('/current', getCurrentFlood);
router.get('/details/today', getTodayFloodDetails);
router.post('/predict-ml', (req, res) => {
  import('../controllers/flood.controller.js').then(({ predictFloodML }) => predictFloodML(req, res));
});

export default router;