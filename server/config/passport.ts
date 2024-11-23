import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { pool } from "./database";

passport.serializeUser((user: any, done) => {
  done(null, user.id); // Serialize the user ID
});

passport.deserializeUser(async (id, done) => {
  try {
    const result = await pool.query("SELECT * FROM Users WHERE id = $1", [id]);
    done(null, result.rows[0]); // Attach the user object to req.user
  } catch (err) {
    done(err, null);
  }
});

// Local signup strategy
passport.use(
  "local-signup",
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, done) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const result = await pool.query(
          "INSERT INTO Users (username, password) VALUES ($1, $2) RETURNING *",
          [username, hashedPassword]
        );
        return done(null, result.rows[0]);
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Local signin strategy
passport.use(
  "local-signin",
  new LocalStrategy(
    { usernameField: "username", passwordField: "password" },
    async (username, password, done) => {
      try {
        const result = await pool.query("SELECT * FROM Users WHERE username = $1", [username]);
        if (result.rows.length === 0) {
          return done(null, false, { message: "Incorrect username" });
        }

        const user = result.rows[0];
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
          return done(null, false, { message: "Incorrect password" });
        }

        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
  )
);

export default passport;