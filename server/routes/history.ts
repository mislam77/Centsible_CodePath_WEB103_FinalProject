import express from "express";
import { getHistoryData } from "../controllers/historyController";
import { ensureAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

// Fetch history data
router.get("/", ensureAuthenticated, getHistoryData);

export default router;