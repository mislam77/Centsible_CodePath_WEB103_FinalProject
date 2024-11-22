import { Request, Response } from "express";
import { pool } from "../config/database";

export const getHistoryPeriods = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = (req.user as { id: number }).id;

    const query = `
      SELECT DISTINCT year
      FROM Transactions
      WHERE userId = $1
      ORDER BY year DESC
    `;
    const result = await pool.query(query, [userId]);

    res.json(result.rows.map((row) => row.year));
  } catch (error) {
    console.error("Error fetching history periods:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};