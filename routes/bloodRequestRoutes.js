import express from "express";
import {
    createRequest,
    getAllRequests,
    getRequestById,
    updateRequest,
    deleteRequest, searchRequests
} from "../controllers/bloodRequestController.js";

const router = express.Router();

import authMiddleware from '../middlewares/authMiddleware.js';
import {apply} from "../controllers/applicationController.js";

router.use(authMiddleware);

router.get('/search', searchRequests);

router.post("/", createRequest);
router.get("/", getAllRequests);
router.get("/:id", getRequestById);
router.put("/:id", updateRequest);
router.delete("/:id", deleteRequest);

router.post('/application/:requestId', apply);


export default router;
