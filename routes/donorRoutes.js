import express from "express";
const router = express.Router();

import { requestDonorEligibility, searchEligibleDonors } from "../controllers/personController.js";
import authMiddleware from '../middlewares/authMiddleware.js';

router.use(authMiddleware);
// become a donor
router.post('/', requestDonorEligibility);

// search donors
router.get('/search', searchEligibleDonors);

export default router;