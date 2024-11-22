import { Request, Response } from "express";
import { pool } from "../config/database";

export const getOverview = async (req: Request, res: Response): Promise<void> => {
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

    const statsQuery = `
      SELECT
        SUM(income) AS totalIncome,
        SUM(expense) AS totalExpense,
        SUM(income) - SUM(expense) AS balance
      FROM Transactions
      WHERE userId = $1 AND date >= $2 AND date <= $3
    `;
    const categoriesQuery = `
      SELECT
        category,
        SUM(income) AS income,
        SUM(expense) AS expense
      FROM Transactions
      WHERE userId = $1 AND date >= $2 AND date <= $3
      GROUP BY category
      ORDER BY category
    `;

    const statsResult = await pool.query(statsQuery, [userId, from, to]);
    const categoriesResult = await pool.query(categoriesQuery, [userId, from, to]);

    res.json({
      stats: statsResult.rows[0],
      categories: categoriesResult.rows,
    });
  } catch (error) {
    console.error("Error fetching overview data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};