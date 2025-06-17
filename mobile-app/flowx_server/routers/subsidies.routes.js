import { Router } from 'express';
import {
  getNewSubsidies,
  getSubsidiesHistory,
  getAllSubsidiesForFlood
} from '../controllers/subsidies.controller.js';

const router = Router();

router.get('/new', getNewSubsidies);
router.get('/history', getSubsidiesHistory);
router.get('/all-for-flood', getAllSubsidiesForFlood);

export default router;
