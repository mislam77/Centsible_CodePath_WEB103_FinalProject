import express from "express";
import { getBalanceStats } from "../controllers/statsController";
import { getCategoryStats } from "../controllers/statsController";
import { ensureAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

router.get("/balance", ensureAuthenticated, getBalanceStats);
router.get("/categories", ensureAuthenticated, getCategoryStats);

export default router;