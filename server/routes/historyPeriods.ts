import express from "express";
import { getHistoryPeriods } from "../controllers/historyPeriodsController";
import { ensureAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/", ensureAuthenticated, getHistoryPeriods);

export default router;