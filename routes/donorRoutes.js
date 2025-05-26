import express from "express";
const router = express.Router();

import { requestDonorEligibility } from "../controllers/personController.js";
import authMiddleware from '../middlewares/authMiddleware.js';

router.use(authMiddleware);
router.post('/', requestDonorEligibility);

export default router;