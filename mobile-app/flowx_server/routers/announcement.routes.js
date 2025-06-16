import { Router } from 'express';
import {
  getCurrentFloodAnnouncementsForUser,
  getAllCurrentFloodAnnouncements,
  getAdminAnnouncementsForCurrentFlood,
  getGovOfficerAnnouncementsForCurrentFlood,
  getGramaSevakaAnnouncementsForCurrentFlood
} from '../controllers/announcement.controller.js';

const router = Router();

router.get('/current/user', getCurrentFloodAnnouncementsForUser);
router.get('/current/all', getAllCurrentFloodAnnouncements);
router.get('/current/admin', getAdminAnnouncementsForCurrentFlood);
router.get('/current/gov-officer', getGovOfficerAnnouncementsForCurrentFlood);
router.get('/current/grama-sevaka', getGramaSevakaAnnouncementsForCurrentFlood);

export default router;
