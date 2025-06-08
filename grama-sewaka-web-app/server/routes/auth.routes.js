import express from 'express';
import { 
    registerUser, 
    loginUser,
    getUserDetails
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register/:role', registerUser);
router.post('/login', loginUser);
router.get('/user/:role/:id', getUserDetails);

export default router;