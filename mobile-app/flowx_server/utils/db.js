import mysql2 from "mysql2/promise";
import dotenv from "dotenv";
import logger from "./logger.js";

dotenv.config();

export const pool = mysql2.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

export const connectDB = async () => {
  try {
    await pool.getConnection();
    logger.info("Connected to the database");
  } catch (error) {
    logger.error("Error connecting to the database:", error);
    throw error;
  }
};

export const closeDB = async () => {
  try {
    await pool.end();
    logger.info("Database connection pool closed");
  } catch (error) {
    logger.error("Error closing the database connection pool:", error);
    throw error;
  }
};

export default pool;