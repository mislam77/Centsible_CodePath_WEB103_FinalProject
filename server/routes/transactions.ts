import express from "express";
import { createTransaction, getTransactions, deleteTransaction } from "../controllers/transactionsController";
import { ensureAuthenticated } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/", ensureAuthenticated, createTransaction);
router.get("/", ensureAuthenticated, getTransactions);
router.delete("/:id", ensureAuthenticated, deleteTransaction);

export default router;
