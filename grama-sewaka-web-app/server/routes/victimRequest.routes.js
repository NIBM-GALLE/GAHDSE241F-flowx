import express from 'express';
import { gramaSevaka, governmentOfficer } from '../controllers/victimRequest.controller.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

//all routes protected
router.use(protect);

//grama Sevaka routes
router.get('/grama-sevaka/requests/pending', gramaSevaka.getPendingRequests);
router.get('/grama-sevaka/requests/approved', gramaSevaka.getApprovedRequests);
router.get('/grama-sevaka/requests/history', gramaSevaka.getRequestHistory);
router.put('/grama-sevaka/requests/:victim_request_id/status', gramaSevaka.updateRequestStatus);

//government Officer routes
router.get('/government-officer/requests/pending', governmentOfficer.getPendingRequests);
router.get('/government-officer/requests/approved', governmentOfficer.getApprovedRequests);
router.get('/government-officer/requests/history', governmentOfficer.getRequestHistory);

export default router;