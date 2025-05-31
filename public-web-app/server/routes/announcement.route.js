import express from 'express';
import {
  getCurrentFloodAnnouncementsForUser,
  getAllCurrentFloodAnnouncements
} from '../controllers/announcement.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

//user-specific announcements
router.get('/all', verifyToken, getCurrentFloodAnnouncementsForUser);
router.get('/all-for-flood', verifyToken, getAllCurrentFloodAnnouncements);

export default router;