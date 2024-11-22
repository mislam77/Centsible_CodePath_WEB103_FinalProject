import { Request, Response } from "express";
import { pool } from "../config/database";

// Fetch history data
export const getHistoryData = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    const userId = (req.user as { id: number }).id;
    const { timeframe, year, month } = req.query;

    if (!timeframe || !year) {
      res.status(400).json({ error: "Missing required query parameters" });
      return;
    }

    // Define query for month and year
    let query = `
      SELECT day, month, year, SUM(income) AS income, SUM(expense) AS expense
      FROM Transactions
      WHERE userId = $1 AND year = $2
    `;
    const params: (string | number)[] = [userId, year];

    if (timeframe === "month") {
      if (!month) {
        res.status(400).json({ error: "Month is required for monthly data" });
        return;
      }
      query += " AND month = $3";
      params.push(month);
    }

    query += " GROUP BY day, month, year ORDER BY year, month, day";

    const result = await pool.query(query, params);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching history data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};