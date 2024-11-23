import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware";
import { getHistoryData } from "../controllers/historyController";

const router = express.Router();

router.get("/", ensureAuthenticated, getHistoryData);

export default router;