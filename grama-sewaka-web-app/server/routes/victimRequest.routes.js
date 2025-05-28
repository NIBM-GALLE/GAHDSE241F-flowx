const express = require('express');
const router = express.Router();
const { gramaSevaka, governmentOfficer } = require('../controllers/victimController');
const { authenticateGramaSevaka, authenticateGovernmentOfficer } = require('../middlewares/auth');

// GRAMA SEVAKA ROUTES
router.get('/grama-sevaka/pending', authenticateGramaSevaka, gramaSevaka.getPendingRequests);
router.put('/grama-sevaka/update-status/:victim_request_id', authenticateGramaSevaka, gramaSevaka.updateRequestStatus);
router.get('/grama-sevaka/approved', authenticateGramaSevaka, gramaSevaka.getApprovedRequests);
router.get('/grama-sevaka/history', authenticateGramaSevaka, gramaSevaka.getRequestHistory);

// GOVERNMENT OFFICER ROUTES
router.get('/government-officer/pending', authenticateGovernmentOfficer, governmentOfficer.getPendingRequests);
router.put('/government-officer/update-status/:victim_request_id', authenticateGovernmentOfficer, governmentOfficer.updateRequestStatus);
router.get('/government-officer/approved', authenticateGovernmentOfficer, governmentOfficer.getApprovedRequests);
router.get('/government-officer/history', authenticateGovernmentOfficer, governmentOfficer.getRequestHistory);

module.exports = router;