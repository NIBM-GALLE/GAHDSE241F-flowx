import express from 'express';
import {
    createShelter,
    getShelterRequests,
    getApprovedRequests,
    getShelters,
    updateShelter,
    approveShelterRequest,
    getShelterRequestsByGS,
    getApprovedRequestsByGS
} from '../controllers/shelter.controller.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

//all routes protected
router.use(protect);

//government officer routes
router.use('/officer', authorize('government_officer'));
router.post('/officer/create', createShelter);
router.get('/officer/requests/pending', getShelterRequests);
router.get('/officer/requests/approved', getApprovedRequests);
router.get('/officer/all', getShelters);
router.put('/officer/update/:shelter_id', updateShelter);
router.post('/officer/approve/:shelter_request_id', approveShelterRequest);

//grama Sevaka routes
router.use('/gs', authorize('grama_sevaka'));
router.get('/gs/requests/pending', getShelterRequestsByGS);
router.get('/gs/requests/approved', getApprovedRequestsByGS);
router.post('/gs/approve/:shelter_request_id', approveShelterRequest);

export default router;