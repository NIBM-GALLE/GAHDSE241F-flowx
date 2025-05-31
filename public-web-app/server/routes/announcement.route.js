import express from 'express';
import {
  getCurrentFloodAnnouncementsForUser,
  getAllCurrentFloodAnnouncements,
  getAdminAnnouncementsForCurrentFlood
} from '../controllers/announcement.controller.js';
import { protect } from '../middlewares/authMiddleware.js';


const router = express.Router();

//user-specific announcements
router.get('/all', protect, getCurrentFloodAnnouncementsForUser);
router.get('/all-for-flood', protect, getAllCurrentFloodAnnouncements);

//admin-specific announcements
router.get('/', getAdminAnnouncementsForCurrentFlood);

export default router;