import { Request, Response } from "express";
import { pool } from "../config/database";

export const getHistoryPeriods = async (req: Request, res: Response) => {
  try {
    const userId = (req.user as { id: number }).id;

    const query = `
      SELECT DISTINCT
        EXTRACT(YEAR FROM date) AS year
      FROM Transaction
      WHERE userId = $1
      ORDER BY year DESC;
    `;

    const result = await pool.query(query, [userId]);

    // Extract and return just the years
    const years = result.rows.map((row) => row.year);
    res.json(years);
  } catch (error) {
    console.error("Error fetching history periods:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};