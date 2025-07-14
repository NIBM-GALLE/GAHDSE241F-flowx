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

// Public endpoint to get all shelters (for map display)
router.get('/all-public', async (req, res, next) => {
    try {
        const [shelters] = await req.app.get('db').query(
            `SELECT s.*, ds.divisional_secretariat_name
             FROM shelter s
             JOIN divisional_secretariat ds ON s.divisional_secretariat_id = ds.divisional_secretariat_id
             ORDER BY s.shelter_name`
        );
        res.status(200).json({
            success: true,
            message: shelters.length > 0 ? "Shelters found" : "No shelters found",
            data: shelters
        });
    } catch (error) {
        next(error);
    }
});

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