import express from "express";
const router = express.Router();

import { register, login, getNewAccessToken, logout } from '../controllers/authController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

router.post('/register', register);
router.post('/login', login);
router.post('/token/access-token', getNewAccessToken);

router.get('/', (req, res) => {
  res.send('Auth route funcionando');
});

router.post('/logout', authMiddleware, logout);

export default router;
