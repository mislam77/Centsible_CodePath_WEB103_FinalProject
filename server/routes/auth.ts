import express from "express";
import passport from "../config/passport";
import { pool } from "../config/database";

const router = express.Router();

// Signup Route
router.post("/signup", (req, res, next) => {
  passport.authenticate(
    "local-signup",
    (
      err: Error | null,
      user: { id: number; username: string } | false,
      info: { message: string } | undefined
    ) => {
      if (err) {
        console.error("Error during signup:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!user) {
        return res
          .status(400)
          .json({ message: info?.message || "Signup failed" });
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error("Error during login after signup:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        return res.status(200).json({ redirectTo: "/wizard" });
      });
    }
  )(req, res, next);
});

// Signin Route
router.post("/signin", (req, res, next) => {
  passport.authenticate(
    "local-signin",
    (
      err: Error | null,
      user: { id: number; username: string } | false,
      info: { message: string } | undefined
    ) => {
      if (err) {
        console.error("Error during signin:", err);
        return res.status(500).json({ message: "Internal server error" });
      }
      if (!user) {
        return res
          .status(400)
          .json({ message: info?.message || "Invalid username or password" });
      }
      req.logIn(user, (err) => {
        if (err) {
          console.error("Error during login:", err);
          return res.status(500).json({ message: "Internal server error" });
        }
        return res.status(200).json({ message: "Signin successful!" });
      });
    }
  )(req, res, next);
});

// Fetch Authenticated User Route
interface AuthenticatedUser {
  id: number;
  username: string;
}

router.get("/user", (req, res) => {
    console.log("Is Authenticated:", req.isAuthenticated());
    console.log("User:", req.user);
  
    if (req.isAuthenticated()) {
      res.json({
        username: (req.user as AuthenticatedUser).username,
      });
    } else {
      res.status(401).json({ error: "Not authenticated" });
    }
});   

export default router;