import express from 'express';
import {
  getNewDonations,
  getPendingDonations,
  getDonationHistory,
  updateDonationStatus
} from '../controllers/donation.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All routes protected and only for government officers
router.use(protect);

router.get('/new', getNewDonations);
router.get('/pending', getPendingDonations);
router.get('/history', getDonationHistory);
router.put('/:donationId/status', updateDonationStatus);

export default router;