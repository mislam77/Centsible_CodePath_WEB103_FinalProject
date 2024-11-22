import express from "express";
import { getUserSettings, updateUserCurrency } from "../controllers/userSettingsController";

const router = express.Router();

// Route to fetch user settings
router.get("/", getUserSettings);

// Route to update user currency
router.patch("/", updateUserCurrency);

export default router;