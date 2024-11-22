import express from "express";
import { createTransaction } from "../controllers/transactionsController";
import { ensureAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", ensureAuthenticated, createTransaction);

export default router;
