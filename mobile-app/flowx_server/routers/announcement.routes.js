import { Router } from 'express';
import {
  getCurrentFloodAnnouncementsForUser,
  getAllCurrentFloodAnnouncements,
  getAdminAnnouncementsForCurrentFlood,
  getGovOfficerAnnouncementsForCurrentFlood,
  getGramaSevakaAnnouncementsForCurrentFlood
} from '../controllers/announcement.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = Router();

router.get('/current/user', protect, getCurrentFloodAnnouncementsForUser);
router.get('/current/all', getAllCurrentFloodAnnouncements);
router.get('/current/admin', getAdminAnnouncementsForCurrentFlood);
router.get('/current/gov-officer', getGovOfficerAnnouncementsForCurrentFlood);
router.get('/current/grama-sevaka', getGramaSevakaAnnouncementsForCurrentFlood);

export default router;
