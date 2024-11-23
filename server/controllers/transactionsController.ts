import { Request, Response } from "express";
import { pool } from "../config/database";

interface AuthenticatedUser {
  id: number;
  username: string;
}

export const createTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as AuthenticatedUser)?.id; // Assuming Passport.js sets `req.user`
    const { amount, description, date, category, type } = req.body;

    if (!userId || !amount || !description || !date || !category || !type) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    // Resolve the category details (UUID and name)
    const categoryQuery = `
      SELECT id, name FROM Category WHERE name = $1 AND userId = $2 AND type = $3;
    `;
    const categoryResult = await pool.query(categoryQuery, [category, userId, type]);

    if (categoryResult.rowCount === 0) {
      res.status(404).json({ error: "Category not found" });
      return;
    }

    const { id: categoryId, name: categoryName } = categoryResult.rows[0];

    // Insert the transaction, including category name
    const transactionQuery = `
      INSERT INTO Transaction (amount, description, date, userId, categoryId, categoryName, type)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;
    const transactionResult = await pool.query(transactionQuery, [
      amount,
      description,
      date,
      userId,
      categoryId,
      categoryName, // Include the category name
      type,
    ]);

    res.status(201).json(transactionResult.rows[0]);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getTransactions = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as AuthenticatedUser)?.id; // Assuming Passport.js sets `req.user`
    const { from, to } = req.query;

    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }

    if (!from || !to || isNaN(Date.parse(from as string)) || isNaN(Date.parse(to as string))) {
      res.status(400).json({ error: "Invalid or missing date range" });
      return;
    }

    const query = `
      SELECT 
        id, 
        amount, 
        description, 
        date, 
        categoryName, 
        type 
      FROM Transaction
      WHERE userId = $1 AND date BETWEEN $2 AND $3
      ORDER BY date DESC;
    `;

    const transactionsResult = await pool.query(query, [userId, from, to]);

    res.status(200).json(transactionsResult.rows);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteTransaction = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req.user as AuthenticatedUser)?.id; // Assuming Passport.js sets `req.user`
    const { id } = req.params;

    if (!id) {
      res.status(400).json({ error: "Transaction ID is required" });
      return;
    }

    const query = `
      DELETE FROM Transaction
      WHERE id = $1 AND userId = $2
      RETURNING *;
    `;
    const result = await pool.query(query, [id, userId]);

    if (result.rowCount === 0) {
      res.status(404).json({ error: "Transaction not found or not authorized" });
      return;
    }

    res.status(200).json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};