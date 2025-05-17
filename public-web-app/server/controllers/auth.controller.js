import { pool } from "../utils/db.js";
import logger from "../utils/logger.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export const registerUser = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    homeId,
    address,
    location,
    district,
    divisionalSecretariat,
    gramaNiladari,
  } = req.body;

  if (!firstName || !lastName || !email || !phone || !address) {
    return next(errorHandler(400, "Required fields are missing"));
  }

  try {
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return next(errorHandler(400, "User already exists with this email"));
    }

    const [result] = await pool.query(
      `INSERT INTO users 
      (firstName, lastName, email, phone, homeId, address, location, district, divisionalSecretariat, gramaNiladari)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email,
        phone,
        homeId || null,
        address,
        location || null,
        district || null,
        divisionalSecretariat || null,
        gramaNiladari || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      userId: result.insertId,
    });
  } catch (error) {
    logger.error("Error creating user:", error);
    return next(errorHandler(500, "Failed to create user"));
  }
};