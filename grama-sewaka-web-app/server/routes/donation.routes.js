import express from 'express';
import {
  getNewDonationRequests,
  getPendingDonationRequests,
  getDonationHistory,
  updateDonationStatus,
  getDonationById,
  getDonationStatistics
} from '../controllers/donation.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

//all routes protected and only for government officers
router.use(protect);

router.get('/new', getNewDonationRequests);
router.get('/pending', getPendingDonationRequests);
router.get('/history', getDonationHistory);
router.put('/:donations_id/status', updateDonationStatus);
router.get('/:donations_id', getDonationById);
router.get('/stats/overview', getDonationStatistics);

export default router;