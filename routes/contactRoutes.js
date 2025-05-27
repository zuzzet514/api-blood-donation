import express from 'express';
import { getContactLink } from '../controllers/contactController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

const  router = express.Router();

router.get('/whatsapp', authMiddleware, getContactLink);

export default router;
