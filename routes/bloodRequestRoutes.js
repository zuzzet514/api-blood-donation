import express from "express";
import {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest
} from "../controllers/bloodRequestController.js";

const router = express.Router();

import authMiddleware from '../middlewares/authMiddleware.js';

router.use(authMiddleware);

router.post("/", createRequest);
router.get("/", getAllRequests);
router.get("/:id", getRequestById);
router.put("/:id", updateRequest);
router.delete("/:id", deleteRequest);

export default router;
