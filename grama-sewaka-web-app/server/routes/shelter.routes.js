import express from 'express';
import {
    createShelter,
    getShelterRequests,
    getApprovedRequests,
    getShelters,
    updateShelter,
    approveShelterRequest,
    getShelterRequestsByGS,
    getApprovedRequestsByGS,
    updateShelterRequestStatus
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
router.put('/officer/update/:shelter_id', updateShelter);
router.post('/officer/approve/:shelter_request_id', approveShelterRequest);
router.post('/officer/update-status/:shelter_request_id', updateShelterRequestStatus);

router.get('/all', getShelters);

//grama Sevaka routes
router.use('/gs', authorize('grama_sevaka'));
router.get('/gs/requests/pending', getShelterRequestsByGS);
router.get('/gs/requests/approved', getApprovedRequestsByGS);
router.post('/gs/approve/:shelter_request_id', approveShelterRequest);
router.post('/gs/update-status/:shelter_request_id', updateShelterRequestStatus);

export default router;