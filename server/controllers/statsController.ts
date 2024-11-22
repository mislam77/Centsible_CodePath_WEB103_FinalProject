import { Request, Response } from "express";
import { pool } from "../config/database";

export const getBalanceStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = (req.user as { id: number }).id;
    const { from, to } = req.query;

    if (!from || !to) {
      res.status(400).json({ error: "Missing required date range" });
      return;
    }

    const query = `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
      FROM Transactions
      WHERE userId = $1 AND date >= $2 AND date <= $3
    `;

    const result = await pool.query(query, [userId, from, to]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching balance stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCategoryStats = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = (req.user as { id: number }).id;
    const { from, to } = req.query;

    if (!from || !to) {
      res.status(400).json({ error: "Missing required date range" });
      return;
    }

    const query = `
      SELECT 
        category,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
      FROM Transactions
      WHERE userId = $1 AND date >= $2 AND date <= $3
      GROUP BY category
      ORDER BY category ASC
    `;

    const result = await pool.query(query, [userId, from, to]);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching category stats:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};