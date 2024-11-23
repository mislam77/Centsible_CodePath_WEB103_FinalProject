import express from "express";
import session from "express-session";
import passport from "./config/passport";
import flash from "connect-flash";
import userSettingsRoutes from "./routes/userSettings";
import authRoutes from "./routes/auth";
import historyRoutes from "./routes/history";
import overviewRoutes from "./routes/overview";
import historyPeriodsRoutes from "./routes/historyPeriods";
import statsRoutes from "./routes/stats";
import transactionsRoutes from "./routes/transactions";
import categoryRoutes from "./routes/category";
import cors from "cors";

const app = express();

// Middleware
app.use(
  session({
    secret: "yourSecretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set this to `true` if using HTTPS
      sameSite: "lax", // Ensures cookies are sent with same-site requests
    },
  })
);

// Ensure CORS allows credentials
app.use(
  cors({
    origin: "https://web103-finalproject-centsible-client.onrender.com", // React app origin
    credentials: true, // Allow cookies to be sent
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user-settings", userSettingsRoutes);
app.use("/api/history", historyRoutes);
app.use("/api/overview", overviewRoutes);
app.use("/api/history-periods", historyPeriodsRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/transactions", transactionsRoutes);
app.use("/api/categories", categoryRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});