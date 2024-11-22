import { Request, Response } from "express";
import { pool } from "../config/database";

export const createTransaction = async (req: Request, res: Response) => {
  try {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { description, amount, category, type, date } = req.body;
    const userId = (req.user as { id: number }).id;

    const query = `
      INSERT INTO Transactions (description, amount, category, type, date, userId)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *;
    `;

    const values = [description, amount, category, type, date, userId];
    const result = await pool.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
