import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB, pool } from "./utils/db.js";
import logger from "./utils/logger.js"; // logger for logging errors and info
import morgan from "morgan"; //  morgan for logging HTTP requests
import cookieParser from "cookie-parser";

// Import routes

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json({ limit: "10mb" })); // Middleware to parse JSON requests
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser()); // Middleware to parse cookies
app.use(
  morgan(
    ":date[iso] :method :url :http-version :user-agent :status (:response-time ms)"
  )
); // Use morgan to log HTTP requests

// Routes

// Validate environment variables
if (
    !process.env.DB_HOST ||
    !process.env.DB_USER ||
    !process.env.DB_PASSWORD ||
    !process.env.DB_NAME ||
    !process.env.DB_PORT
) {
  logger.error("Database connection details are missing in .env file");
  process.exit(1);
}

const server = app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
  try {
    connectDB(); // Connect to the database
  } catch (error) {
    logger.error("Error starting the server:", error);
    process.exit(1);
  }
});

// Graceful shutdown when the server is terminated
process.on("SIGINT", async () => {
  logger.info("\nShutting down gracefully...");
  try {
    await pool.end(); // Close the database connection pool
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

// error handle
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// Handle uncaught exceptions and unhandled rejections
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});
