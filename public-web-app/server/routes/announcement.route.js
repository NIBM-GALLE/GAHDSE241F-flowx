import express from 'express';
import {
  getCurrentFloodAnnouncements,
} from '../controllers/announcement.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/all', verifyToken, getCurrentFloodAnnouncements);

export default router;