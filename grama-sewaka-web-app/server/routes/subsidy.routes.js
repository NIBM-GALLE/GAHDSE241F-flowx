import express from 'express';
import {
  createSubsidyRequest,
  createSubsidy,
  getSubsidyRequestsByGramaSevaka,
  updateSubsidyRequestStatus,
  getSubsidiesForCurrentFlood,
  getSubsidyRequestsByDivisionalSecretariat,
  updateSubsidy
} from '../controllers/subsidy.controller.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

// All routes protected
router.use(protect);

// Grama Sevaka and Government Officer shared routes
router.get('/current', authorize('government_officer', 'grama_sevaka'), getSubsidiesForCurrentFlood);
router.post('/requests', authorize('grama_sevaka'), createSubsidyRequest);
router.get('/requests', authorize('grama_sevaka'), getSubsidyRequestsByGramaSevaka);
router.put('/requests/:subsidy_house_id/status', authorize('grama_sevaka'), updateSubsidyRequestStatus);

// Government officer only
router.post('/new', authorize('government_officer'), createSubsidy);
router.put('/:subsidy_id', authorize('government_officer'), updateSubsidy);
router.get('/division-requests', authorize('government_officer'), getSubsidyRequestsByDivisionalSecretariat);

export default router;