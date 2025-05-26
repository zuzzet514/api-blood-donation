import express from "express";
const router = express.Router();

import authRoutes from "./authRoutes.js"
import donorRoutes from "./donorRoutes.js"
import bloodRequestRoutes from "./bloodRequestRoutes.js";

router.use('/auth', authRoutes);
router.use('/donor', donorRoutes);
router.use('/blood-request', bloodRequestRoutes);
/*


router.use('/requester');
router.use('/account')

 */

export default router;