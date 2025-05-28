import express from 'express';
import {
    createShelter,
    getShelterRequests,
    getApprovedRequests,
    getShelters,
    updateShelter,
    approveShelterRequest
} from '../controllers/shelter.controller.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { verifyGovernmentOfficer } from '../middlewares/roleMiddleware.js';

const router = express.Router();

//create new shelter
router.post('/create', verifyToken, verifyGovernmentOfficer, createShelter);

//get pending shelter requests
router.get('/requests/pending', verifyToken, verifyGovernmentOfficer, getShelterRequests);

//get approved shelter requests
router.get('/requests/approved', verifyToken, verifyGovernmentOfficer, getApprovedRequests);

//get all shelters
router.get('/all', verifyToken, verifyGovernmentOfficer, getShelters);

//update shelter
router.put('/update/:shelter_id', verifyToken, verifyGovernmentOfficer, updateShelter);

//approve shelter request and assign shelter
router.post('/approve/:shelter_request_id', verifyToken, verifyGovernmentOfficer, approveShelterRequest);

export default router;