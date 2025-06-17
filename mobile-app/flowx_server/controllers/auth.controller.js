import { pool } from "../utils/db.js";
import logger from "../utils/logger.js";
import { errorHandler } from "../middlewares/errorHandler.js";
import { hashPassword, comparePassword, generateToken } from "../utils/authUtils.js";

//register User
export const registerUser = async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    phone,
    houseId,
    address,
    members,
    distance_to_river,
    grama_niladhari_division_id,
    divisional_secretariat_id,
    district_id
  } = req.body;

  //required fields validation
  if (!firstName || !lastName || !email || !password || !phone) {
    return next(errorHandler(400, "First name, last name, email, password and phone are required"));
  }

  //validate house ID only 6 numbers
  if (houseId && !/^[a-zA-Z0-9]{1,6}$/.test(houseId)) {
    return next(errorHandler(400, "House ID must be 1-6 alphanumeric characters"));
  }
  //validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return next(errorHandler(400, "Invalid email format"));
  }
  //validate phone number format
  const phoneRegex = /^\+?[0-9]{10,12}$/;
  if (!phoneRegex.test(phone)) {
    return next(errorHandler(400, "Invalid phone number format"));
  }
  //validate password strength
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,}$/;
  if (!passwordRegex.test(password)) {
    return next(errorHandler(400, "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, and one number"));
  }

  try {
    //check if user exists by email
    const [existingUser] = await pool.query(
      "SELECT member_id FROM member WHERE member_email = ?",
      [email]
    );

    if (existingUser.length > 0) {
      return next(errorHandler(400, "Email already registered"));
    }

    let finalHouseId = houseId;

    //if houseId is not provided, create a new house
    if (houseId) {
      const [existingHouse] = await pool.query(
        "SELECT house_id FROM house WHERE house_id = ?",
        [houseId]
      );

      if (existingHouse.length === 0) {
        //validate required fields for new house
        if (!address || !grama_niladhari_division_id || !divisional_secretariat_id || !district_id) {
          return next(errorHandler(400, "For new house, address and administrative divisions are required"));
        }
        //create new house (latitude/longitude removed)
        await pool.query(
          `INSERT INTO house 
          (house_id, address, members, distance_to_river, grama_niladhari_division_id, divisional_secretariat_id, district_id)
          VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [
            houseId,
            address,
            members,
            distance_to_river || 0.0,
            grama_niladhari_division_id,
            divisional_secretariat_id,
            district_id
          ]
        );
      }
      finalHouseId = houseId;
    } else {
      //create new house if not provided
      if (!address || !grama_niladhari_division_id || !divisional_secretariat_id || !district_id) {
        return next(errorHandler(400, "For new house, address and administrative divisions are required"));
      }
      const [houseResult] = await pool.query(
        `INSERT INTO house (address, members, distance_to_river, grama_niladhari_division_id, divisional_secretariat_id, district_id)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [address, members, distance_to_river || 0.0, grama_niladhari_division_id, divisional_secretariat_id, district_id]
      );
      finalHouseId = houseResult.insertId;
    }

    //hash password
    const hashedPassword = await hashPassword(password);

    //insert new member
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

    //generate token
    const token = generateToken(memberResult.insertId);

    //get house details and member count
    const [houseDetails] = await pool.query(
      `SELECT h.*, COUNT(m.member_id) as member_count
       FROM house h
       LEFT JOIN member m ON h.house_id = m.house_id
       WHERE h.house_id = ?
       GROUP BY h.house_id`,
      [finalHouseId]
    );

    //response data
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

//login User
export const loginUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(errorHandler(400, "Email and password are required"));
  }

  try {
    //get user with password and house info
    const [users] = await pool.query(
      `SELECT m.member_id as id, m.member_password as password, 
       m.first_name as firstName, m.last_name as lastName, 
       m.member_email as email, m.member_phone_number as phone,
       m.house_id, h.address as house_address,
       h.members as house_members
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
    
    //compare passwords
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return next(errorHandler(401, "Invalid credentials"));
    }

    //generate token (Bearer)
    const token = generateToken(user.id);

    // Prepare user data for response
    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      house_id: user.house_id
    };

    res.status(200).json({
      success: true,
      token,
      user: userData
    });
  } catch (error) {
    logger.error("Login error:", error);
    next(errorHandler(500, "Login failed"));
  }
};

//logout User
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

//check House ID availability
export const checkHouseId = async (req, res, next) => {
  const { houseId } = req.params;
  
  if (!/^[a-zA-Z0-9]{1,6}$/.test(houseId)) {
    return next(errorHandler(400, "House ID must be 1-6 alphanumeric characters"));
  }
  
  try {
    // Remove latitude and longitude from SELECT for checkHouseId
    const [house] = await pool.query(
      `SELECT house_id, address FROM house WHERE house_id = ?`,
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

//get user profile
export const getUserProfile = async (req, res, next) => {
  try {
    const [user] = await pool.query(
      `SELECT *
       FROM member m
       JOIN house h ON m.house_id = h.house_id
       WHERE m.member_id = ?`,
      [req.user.member_id]
    );

    if (user.length === 0) {
      return next(errorHandler(404, "User not found"));
    }

    res.status(200).json({
      success: true,
      user: user[0]
    });
  } catch (error) {
    logger.error("Get user profile error:", error);
    next(errorHandler(500, "Failed to retrieve user profile"));
  }
};

//update user profile
export const updateUserProfile = async (req, res, next) => {
  // Remove latitude and longitude from allowedFields, update logic, and house update logic
  const allowedFields = [
    'firstName', 'lastName', 'email', 'phone', 'houseId', 'address'
  ];
  const updates = {};
  for (const key of allowedFields) {
    if (req.body[key] !== undefined) {
      updates[key] = req.body[key];
    }
  }

  if (Object.keys(updates).length === 0) {
    return next(errorHandler(400, "No fields provided for update"));
  }

  try {
    //check if user exists
    const [user] = await pool.query(
      `SELECT member_id, house_id FROM member WHERE member_id = ?`,
      [req.user.member_id]
    );
    if (user.length === 0) {
      return next(errorHandler(404, "User not found"));
    }
    const currentHouseId = user[0].house_id;

    //update member fields
    const memberFields = [];
    const memberParams = [];
    if (updates.firstName) {
      memberFields.push('first_name = ?');
      memberParams.push(updates.firstName);
    }
    if (updates.lastName) {
      memberFields.push('last_name = ?');
      memberParams.push(updates.lastName);
    }
    if (updates.email) {
      memberFields.push('member_email = ?');
      memberParams.push(updates.email);
    }
    if (updates.phone) {
      memberFields.push('member_phone_number = ?');
      memberParams.push(updates.phone);
    }
    if (memberFields.length > 0) {
      await pool.query(
        `UPDATE member SET ${memberFields.join(', ')} WHERE member_id = ?`,
        [...memberParams, req.user.member_id]
      );
    }

    //update house fields if any
    const houseFields = [];
    const houseParams = [];
    if (updates.houseId) {
      houseFields.push('house_id = ?');
      houseParams.push(updates.houseId);
    }
    if (updates.address) {
      houseFields.push('address = ?');
      houseParams.push(updates.address);
    }
    if (houseFields.length > 0) {
      await pool.query(
        `UPDATE house SET ${houseFields.join(', ')} WHERE house_id = ?`,
        [...houseParams, currentHouseId]
      );
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully"
    });
  } catch (error) {
    logger.error("Update profile error:", error);
    next(errorHandler(500, "Failed to update profile"));
  }
};

//get user house details
export const getUserHouseDetails = async (req, res, next) => {
  try {
    // Remove latitude and longitude from SELECT/response for house details
    const [house] = await pool.query(
      `SELECT h.house_id, h.address, h.members, h.distance_to_river, 
              h.grama_niladhari_division_id, 
              h.divisional_secretariat_id, 
              h.district_id
       FROM house h
       JOIN member m ON h.house_id = m.house_id
       WHERE m.member_id = ?`,
      [req.user.member_id]
    );

    if (house.length === 0) {
      return next(errorHandler(404, "House not found"));
    }

    res.status(200).json({
      success: true,
      house: house[0]
    });
  } catch (error) {
    logger.error("Get user house details error:", error);
    next(errorHandler(500, "Failed to retrieve house details"));
  }
};

//get user house members
export const getUserHouseMembers = async (req, res, next) => {
  try {
    const [members] = await pool.query(
      `SELECT member_id, first_name, last_name, member_email, member_phone_number
       FROM member
       WHERE house_id = (SELECT house_id FROM member WHERE member_id = ?)
       ORDER BY first_name, last_name`,
      [req.user.member_id]
    );

    res.status(200).json({
      success: true,
      members: members
    });
  } catch (error) {
    logger.error("Get user house members error:", error);
    next(errorHandler(500, "Failed to retrieve house members"));
  }
};