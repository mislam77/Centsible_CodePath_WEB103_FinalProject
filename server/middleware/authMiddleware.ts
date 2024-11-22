import { Request, Response, NextFunction } from "express";

export const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {
  if (req.isAuthenticated() && req.user) {
    next();
  } else {
    res.status(401).json({ error: "Unauthorized" });
  }
};
