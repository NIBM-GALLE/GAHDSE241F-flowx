import express from 'express';
import {
    createShelter,
    getShelterRequests,
    getApprovedRequests,
    getShelters,
    updateShelter,
    approveShelterRequest
} from '../controllers/shelter.controller.js';
import { protect } from '../middlewares/authMiddleware.js';
import { verifyGovernmentOfficer } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// All routes protected
router.use(protect);

// Create new shelter
router.post('/create', verifyGovernmentOfficer, createShelter);

// Get pending shelter requests
router.get('/requests/pending', verifyGovernmentOfficer, getShelterRequests);

// Get approved shelter requests
router.get('/requests/approved', verifyGovernmentOfficer, getApprovedRequests);

// Get all shelters
router.get('/all', verifyGovernmentOfficer, getShelters);

// Update shelter
router.put('/update/:shelter_id', verifyGovernmentOfficer, updateShelter);

// Approve shelter request and assign shelter
router.post('/approve/:shelter_request_id', verifyGovernmentOfficer, approveShelterRequest);

export default router;