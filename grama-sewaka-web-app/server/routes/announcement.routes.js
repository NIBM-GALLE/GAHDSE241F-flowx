import express from 'express';
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcement.controller.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

//announcement routes with role-based protection
router.post('/:userType', protect, authorize('admin', 'government_officer', 'grama_sevaka'), createAnnouncement);
router.get('/:userType', protect, authorize('admin', 'government_officer', 'grama_sevaka'), getAnnouncements);
router.get('/:userType/:id', protect, authorize('admin', 'government_officer', 'grama_sevaka'), getAnnouncementById);
router.put('/:userType/:id', protect, authorize('admin', 'government_officer', 'grama_sevaka'), updateAnnouncement);
router.delete('/:userType/:id', protect, authorize('admin', 'government_officer', 'grama_sevaka'), deleteAnnouncement);

export default router;