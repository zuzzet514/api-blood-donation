import express from 'express';
const router = express.Router();

import {
    deleteAccountController,
    getAccountController,
    updateAccountController
} from '../controllers/accountController.js';
import authMiddleware from '../middlewares/authMiddleware.js';

router.use(authMiddleware);

router.get('/me', authMiddleware, getAccountController);
router.put('/me', authMiddleware, updateAccountController);
router.delete('/me', authMiddleware, deleteAccountController);

export default router;