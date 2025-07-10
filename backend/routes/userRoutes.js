import express from 'express';

import { registerUser } from '../controllers/registrationControllers.js';
import { loginUser } from '../controllers/loginControllers.js';


const app = express;

const router = express.Router();

router.post("/api/users/register", registerUser);
router.post("/api/users/login", loginUser);


export default router
