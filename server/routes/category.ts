import express from "express";
import { ensureAuthenticated } from "../middleware/authMiddleware";
import {
    getCategories,
    createCategory,
    deleteCategory,
} from "../controllers/categoryController";

const router = express.Router();

// Wrapper for async route handlers
const asyncHandler =
    (fn: Function) =>
    (req: express.Request, res: express.Response, next: express.NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };

// Fetch categories
router.get("/", ensureAuthenticated, asyncHandler(getCategories));

// Create a new category
router.post("/", ensureAuthenticated, asyncHandler(createCategory));

// Delete a category
router.delete("/:id", ensureAuthenticated, asyncHandler(deleteCategory));

export default router;