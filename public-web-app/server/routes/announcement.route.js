import express from 'express';
import {
  getCurrentFloodAnnouncementsForUser,
  getAllCurrentFloodAnnouncements
} from '../controllers/announcement.controller.js';
import { protect } from '../middlewares/authMiddleware.js';


const router = express.Router();

//user-specific announcements
router.get('/all', protect, getCurrentFloodAnnouncementsForUser);
router.get('/all-for-flood', protect, getAllCurrentFloodAnnouncements);

export default router;