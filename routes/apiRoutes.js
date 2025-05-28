import express from "express";
const router = express.Router();

import authRoutes from "./authRoutes.js"
import accountRoutes from "./accountRoutes.js";
import donorRoutes from "./donorRoutes.js"
import bloodRequestRoutes from "./bloodRequestRoutes.js";
import contactRoutes from "./contactRoutes.js";
import applicationRoutes from "./applicationRoutes.js";

router.use('/auth', authRoutes);
router.use('/account', accountRoutes);
router.use('/donors', donorRoutes);
router.use('/blood-requests', bloodRequestRoutes);
router.use('/contact', contactRoutes);



export default router;