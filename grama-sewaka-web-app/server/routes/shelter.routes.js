import express from 'express';
import {
    createShelter,
    getShelterRequests,
    getApprovedRequests,
    getShelters,
    updateShelter,
    approveShelterRequest
} from '../controllers/shelter.controller.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

//all routes protected
router.use(protect, authorize('government_officer'));

router.post('/create', createShelter);
router.get('/requests/pending', getShelterRequests);
router.get('/requests/approved', getApprovedRequests);
router.get('/all', getShelters);
router.put('/update/:shelter_id', updateShelter);
router.post('/approve/:shelter_request_id', approveShelterRequest);

export default router;