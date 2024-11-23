import { Request, Response } from "express";
import { pool } from "../config/database";

export const getOverview = async (req: Request, res: Response) => {
  try {
    const { from, to } = req.query;

    if (!from || !to) {
      res.status(400).json({ error: "Missing date range" });
      return;
    }

    const userId = (req.user as { id: number }).id;

    const statsQuery = `
      SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
      FROM Transaction
      WHERE userId = $1 AND date >= $2 AND date <= $3;
    `;

    const statsResult = await pool.query(statsQuery, [userId, from, to]);

    const categoriesQuery = `
      SELECT
        categoryName,
        COALESCE(SUM(amount), 0) AS total,
        type
      FROM Transaction
      WHERE userId = $1 AND date >= $2 AND date <= $3
      GROUP BY categoryName, type
      ORDER BY categoryName ASC;
    `;

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