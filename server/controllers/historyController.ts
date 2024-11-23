import { Request, Response } from "express";
import { pool } from "../config/database";

interface AuthenticatedUser {
  id: number;
  username: string;
}

export const getHistoryData = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as AuthenticatedUser)?.id; // Assuming Passport.js sets `req.user`
    const year = parseInt(req.query.year as string, 10);
    const month = req.query.month ? parseInt(req.query.month as string, 10) : undefined;

    if (!userId || isNaN(year)) {
      res.status(400).json({ error: "Invalid parameters" });
      return;
    }

    const query = `
      SELECT
        EXTRACT(YEAR FROM date) AS year,
        EXTRACT(MONTH FROM date) AS month,
        EXTRACT(DAY FROM date) AS day,
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expense
      FROM Transaction
      WHERE userId = $1 AND EXTRACT(YEAR FROM date) = $2
      ${month !== undefined ? "AND EXTRACT(MONTH FROM date) = $3" : ""}
      GROUP BY year, month, day
      ORDER BY year, month, day;
    `;

    const params: (string | number)[] = [userId, year];
    if (month !== undefined) {
      params.push(month);
    }

    const result = await pool.query(query, params);

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error fetching history data:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};