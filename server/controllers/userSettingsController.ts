import { Request, Response } from "express";
import { pool } from "../config/database";

// Fetch user settings
export const getUserSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ensure the user is authenticated
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = (req.user as { id: number }).id; // Get user ID from authenticated user

    const result = await pool.query(
      "SELECT currency FROM UserSettings WHERE userId = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "User settings not found" });
      return;
    }

    res.json(result.rows[0]); // Send the user's currency
  } catch (err) {
    console.error("Error fetching user settings:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update user currency
export const updateUserCurrency = async (req: Request, res: Response): Promise<void> => {
  try {
    // Ensure the user is authenticated
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = (req.user as { id: number }).id; // Get user ID from authenticated user
    const { currency } = req.body;

    if (!currency) {
      res.status(400).json({ error: "Currency is required" });
      return;
    }

    const result = await pool.query(
      "UPDATE UserSettings SET currency = $1 WHERE userId = $2 RETURNING *",
      [currency, userId]
    );

    if (result.rows.length === 0) {
      res.status(404).json({ error: "User settings not found" });
      return;
    }

    res.json(result.rows[0]); // Send the updated settings
  } catch (err) {
    console.error("Error updating currency:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};