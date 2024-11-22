import express from "express";
import { getOverview } from "../controllers/overviewController";
import { ensureAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

// Fetch overview data
router.get("/", ensureAuthenticated, getOverview);

export default router;
