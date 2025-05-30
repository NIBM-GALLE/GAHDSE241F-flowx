import express from 'express';
import {
  createSubsidyRequest,
  getSubsidyRequestsByGramaSevaka,
  updateSubsidyRequestStatus,
  getSubsidiesForCurrentFlood,
  getSubsidyRequestsByDivisionalSecretariat
} from '../controllers/subsidy.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

//all routes protected
router.use(protect);

//grama Sevaka routes
router.post('/requests', createSubsidyRequest);
router.get('/requests', getSubsidyRequestsByGramaSevaka);
router.put('/requests/:requestId/status', updateSubsidyRequestStatus);

//shared routes
router.get('/current', getSubsidiesForCurrentFlood);

//government officer routes
router.get('/division-requests', getSubsidyRequestsByDivisionalSecretariat);

export default router;