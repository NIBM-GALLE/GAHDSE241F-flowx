import express from 'express';
import {
  createAnnouncement,
  getAnnouncements,
  getAnnouncementById,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController.js';

const router = express.Router();

//user specific announcement routes
router.post('/:userType', createAnnouncement);
router.get('/:userType', getAnnouncements);
router.get('/:userType/:id', getAnnouncementById);
router.put('/:userType/:id', updateAnnouncement);
router.delete('/:userType/:id', deleteAnnouncement);

export default router;