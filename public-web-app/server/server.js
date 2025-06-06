import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB, pool } from "./utils/db.js";
import logger from "./utils/logger.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";

//import routes
import authRoutes from "./routes/auth.route.js";
import floodRoutes from "./routes/flood.route.js";
import areaRoutes from "./routes/area.route.js";
import donationRoutes from "./routes/donation.route.js";
import announcementRoutes from "./routes/announcement.route.js";
import victimRoutes from "./routes/victim.route.js";
import subsidiesRoutes from "./routes/subsidies.route.js";
import shelterRoutes from "./routes/shelter.route.js";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(
  morgan(
    ":date[iso] :method :url :http-version :user-agent :status (:response-time ms)"
  )
);

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/flood", floodRoutes);
app.use("/api/area", areaRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/announcements", announcementRoutes);
app.use("/api/victims", victimRoutes);
app.use("/api/subsidies", subsidiesRoutes);
app.use("/api/shelters", shelterRoutes);

// Validate environment variables
if (
  !process.env.DB_HOST ||
  !process.env.DB_USER ||
  !process.env.DB_PASSWORD ||
  !process.env.DB_NAME
) {
  logger.error("Database connection details are missing in .env file");
  process.exit(1);
}

const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  try {
    connectDB();
  } catch (error) {
    logger.error("Error starting the server:", error);
    process.exit(1);
  }
});

process.on("SIGINT", async () => {
  logger.info("\nShutting down gracefully...");
  try {
    await pool.end();
    logger.info("Database connection pool closed");
    server.close(() => {
      logger.info("Server closed");
      process.exit(0);
    });
  } catch (error) {
    logger.error("Error during shutdown:", error);
    process.exit(1);
  }
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});