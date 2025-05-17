import { pool } from "../utils/db.js";
import logger from "../utils/logger.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import { hashPassword, comparePassword, generateToken } from "../utils/authUtils.js";

// Register User
export const registerUser = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    homeId,
    address,
    location,
    district,
    divisionalSecretariat,
    gramaNiladari
  } = req.body;

  // Required fields validation
  if (!firstName || !lastName || !email || !password || !phone || !address) {
    return next(errorHandler(400, "Required fields are missing"));
  }

  try {
    // Check if user exists
    const [existing] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existing.length > 0) {
      return next(errorHandler(400, "Email already registered"));
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new user
    const [result] = await pool.query(
      `INSERT INTO users 
      (firstName, lastName, email, password, phone, homeId, address, 
       location, district, divisionalSecretariat, gramaNiladari)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        phone,
        homeId || null,
        address,
        location || null,
        district || null,
        divisionalSecretariat || null,
        gramaNiladari || null
      ]
    );

    // Generate token
    const token = generateToken(result.insertId);

    // Response data (excluding password)
    const userData = {
      id: result.insertId,
      firstName,
      lastName,
      email,
      phone,
      address
    };

    res.status(201)
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      })
      .json({
        success: true,
        message: "Registration successful",
        user: userData
      });

  } catch (error) {
    logger.error("Registration error:", error);
    next(errorHandler(500, "Registration failed"));
  }
};

// Login User
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "Email and password are required"));
  }

  try {
    // Get user with password
    const [users] = await pool.query(
      "SELECT id, password, firstName, lastName, email, phone FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    const user = users[0];
    
    // Compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    // Generate token
    const token = generateToken(user.id);

    // Omit password in response
    const { password: _, ...userData } = user;

    res
      .status(200)
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      })
      .json({
        success: true,
        message: "Login successful",
        user: userData
      });
  } catch (error) {
    logger.error("Login error:", error);
    next(errorHandler(500, "Login failed"));
  }
};

// Logout User
export const logoutUser = async (req, res) => {
  res
    .clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    })
    .status(200)
    .json({
      success: true,
      message: "Logout successful"
    });
};