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
    houseId,
    address,
    latitude,
    longitude,
    distance_to_river,
    grama_niladhari_division_id,
    divisional_secretariat_id,
    district_id
  } = req.body;

  // Required fields validation
  if (!firstName || !lastName || !email || !password || !phone) {
    return next(errorHandler(400, "First name, last name, email, password and phone are required"));
  }

  // Validate house ID format if provided
  if (houseId && !/^[a-zA-Z0-9]{1,6}$/.test(houseId)) {
    return next(errorHandler(400, "House ID must be 1-6 alphanumeric characters"));
  }

  try {
    // Check if user exists by email
    const [existingUser] = await pool.query(
      "SELECT member_id FROM member WHERE member_email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return next(errorHandler(400, "Email already registered"));
    }

    let finalHouseId = houseId;

    // If houseId is not provided, create a new house
    if (houseId) {
    const [existingHouse] = await pool.query(
        "SELECT house_id FROM house WHERE house_id = ?",
        [houseId]
    );

    if (existingHouse.length === 0) {
        // Validate required fields for new house
        if (!address || !latitude || !longitude || !grama_niladhari_division_id || 
            !divisional_secretariat_id || !district_id) {
        return next(errorHandler(400, "For new house, address, location coordinates and administrative divisions are required"));
        }

        // Create new house
        await pool.query(
        `INSERT INTO house 
        (house_id, address, latitude, longitude, distance_to_river, 
        grama_niladhari_division_id, divisional_secretariat_id, district_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            houseId,
            address,
            latitude,
            longitude,
            distance_to_river || 0.0,
            grama_niladhari_division_id,
            divisional_secretariat_id,
            district_id
        ]
        );
    }
    // Use user-provided houseId
    finalHouseId = houseId;
    }


    // Hash password
    const hashedPassword = await hashPassword(password);

    // Insert new member
    const [memberResult] = await pool.query(
      `INSERT INTO member 
      (first_name, last_name, member_email, member_password, member_phone_number, house_id)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        firstName,
        lastName,
        email,
        hashedPassword,
        phone,
        finalHouseId
      ]
    );

    // Generate token
    const token = generateToken(memberResult.insertId);

    // Get house details and member count
    const [houseDetails] = await pool.query(
      `SELECT h.*, COUNT(m.member_id) as member_count
       FROM house h
       LEFT JOIN member m ON h.house_id = m.house_id
       WHERE h.house_id = ?
       GROUP BY h.house_id`,
      [finalHouseId]
    );

    // Response data
    const userData = {
      id: memberResult.insertId,
      firstName,
      lastName,
      email,
      phone,
      house: houseDetails[0]
    };

    res.status(201)
      .cookie('access_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
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
    // Get user with password and house info
    const [users] = await pool.query(
      `SELECT m.member_id as id, m.member_password as password, 
       m.first_name as firstName, m.last_name as lastName, 
       m.member_email as email, m.member_phone_number as phone,
       m.house_id, h.address as house_address,
       COUNT(m2.member_id) as house_members
       FROM member m
       JOIN house h ON m.house_id = h.house_id
       LEFT JOIN member m2 ON m.house_id = m2.house_id
       WHERE m.member_email = ?
       GROUP BY m.member_id, h.house_id`,
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
        sameSite: 'strict',
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
      sameSite: 'strict'
    })
    .status(200)
    .json({
      success: true,
      message: "Logout successful"
    });
};

// Check House ID Availability
export const checkHouseId = async (req, res, next) => {
  const { houseId } = req.params;
  
  if (!/^[a-zA-Z0-9]{1,6}$/.test(houseId)) {
    return next(errorHandler(400, "House ID must be 1-6 alphanumeric characters"));
  }
  
  try {
    const [house] = await pool.query(
      `SELECT house_id, address, latitude, longitude 
       FROM house WHERE house_id = ?`,
      [houseId]
    );
    
    res.status(200).json({
      exists: house.length > 0,
      house: house.length > 0 ? house[0] : null
    });
  } catch (error) {
    next(errorHandler(500, "House ID check failed"));
  }
};