import { Request, Response } from "express";
import { pool } from "../config/database";

interface AuthenticatedUser {
    id: number;
    username: string;
}

// Fetch categories based on type
export const getCategories = async (req: Request, res: Response) => {
  try {
    const { type } = req.query;

    if (!type) {
      return res.status(400).json({ error: "Transaction type is required" });
    }

    const result = await pool.query(
      "SELECT * FROM Category WHERE type = $1",
      [type]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
    try {
      // Extract the authenticated user's ID
      const userId = (req.user as AuthenticatedUser)?.id; // Ensure `req.user` is populated
      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }
  
      const { name, icon, type } = req.body;
  
      // Validate input
      if (!name || !icon || !type) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Insert the category, including `userId`
      const result = await pool.query(
        `
        INSERT INTO Category (name, icon, type, userId)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
        `,
        [name, icon, type, userId]
      );
  
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error("Error creating category:", error);
      res.status(500).json({ error: "Internal server error" });
    }
};  

// Delete category
export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const userId = (req.user as AuthenticatedUser)?.id;
        const { id } = req.params;

        if (!userId) {
            return res.status(401).json({ error: "Unauthorized" });
        }

        if (!id) {
            return res.status(400).json({ error: "Category ID is required" });
        }

        const result = await pool.query(
            `
            DELETE FROM Category 
            WHERE id = $1 AND userId = $2
            RETURNING *;
            `,
            [id, userId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: "Category not found or unauthorized" });
        }

        res.status(200).json({ message: "Category deleted successfully" });
    } catch (error) {
        console.error("Error deleting category:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};