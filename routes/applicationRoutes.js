import express from "express";
const router = express.Router();

import { apply } from "../controllers/applicationController.js";
import authMiddleware from '../middlewares/authMiddleware.js';

router.use(authMiddleware);



export default router;