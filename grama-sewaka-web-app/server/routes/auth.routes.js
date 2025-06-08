import express from 'express';
import { 
    registerUser, 
    loginUser,
    getUserDetails,
    updateUserDetails
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register/:role', registerUser);
router.post('/login', loginUser);
router.get('/user/:role/:id', getUserDetails);
router.put('/user/:role/:id', updateUserDetails);

export default router;