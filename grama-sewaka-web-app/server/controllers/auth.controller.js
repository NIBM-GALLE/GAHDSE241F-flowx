import pool from '../utils/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { validateSecurityCode } from '../utils/securityCodes.js';

export const registerUser = async (req, res, next) => {
  const { role } = req.params;
  const {
    nic,
    firstname,
    lastname,
    email,
    phone,
    address,
    password,
    securityCode,
    district_id,
    divisional_secretariat_id,
    grama_niladhari_division_id
  } = req.body;

  try {
    // Validate security code
    const isValidCode = validateSecurityCode(securityCode, role);
    if (!isValidCode) {
      return res.status(400).json({
        success: false,
        message: "Invalid security code for this role"
      });
    }

    // Check if email or NIC already exists
    let checkQuery, checkParams;
    if (role === 'admin') {
      checkQuery = `
        SELECT admin_id FROM admin 
        WHERE admin_email = ? OR NIC = ?
      `;
    } else if (role === 'government_officer') {
      checkQuery = `
        SELECT government_officer_id FROM government_officer 
        WHERE government_officer_email = ? OR nic = ?
      `;
    } else {
      checkQuery = `
        SELECT grama_sevaka_id FROM grama_sevaka 
        WHERE grama_sevaka_email = ? OR nic = ?
      `;
    }
    checkParams = [email, nic];

    const [existing] = await pool.query(checkQuery, checkParams);
    if (existing.length > 0) {
      return res.status(400).json({
        success: false,
        message: "User with this email or NIC already exists"
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user based on role
    let insertQuery, insertParams, userId;

    if (role === 'admin') {
      insertQuery = `
        INSERT INTO admin 
        (NIC, first_name, last_name, address, admin_phone_number, admin_email, admin_password)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      insertParams = [nic, firstname, lastname, address, phone, email, hashedPassword];
    } 
    else if (role === 'government_officer') {
      insertQuery = `
        INSERT INTO government_officer 
        (nic, first_name, last_name, government_officer_email, government_officer_password, 
         government_officer_phone_number, address, district_id, divisional_secretariat_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      insertParams = [
        nic, firstname, lastname, email, hashedPassword, 
        phone, address, district_id, divisional_secretariat_id
      ];
    } 
    else { // grama_sevaka
      insertQuery = `
        INSERT INTO grama_sevaka 
        (nic, first_name, last_name, grama_sevaka_phone_number, address, 
         grama_sevaka_email, grama_sevaka_password, grama_niladhari_division_id, 
         divisional_secretariat_id, district_id)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      insertParams = [
        nic, firstname, lastname, phone, address, 
        email, hashedPassword, grama_niladhari_division_id,
        divisional_secretariat_id, district_id
      ];
    }

    const [result] = await pool.query(insertQuery, insertParams);
    userId = result.insertId;

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );

    // Prepare response data
    const userData = {
      id: userId,
      nic,
      firstname,
      lastname,
      email,
      role
    };

    res.status(201).json({
      success: true,
      token,
      user: userData
    });

  } catch (error) {
    console.error("Registration error:", error);
    next(error);
  }
};

export const loginUser = async (req, res, next) => {
  const { email, password, role } = req.body;

  try {
    // Determine which table to query based on role
    let query, table;
    if (role === 'admin') {
      query = 'SELECT * FROM admin WHERE admin_email = ?';
      table = 'admin';
    } else if (role === 'government_officer') {
      query = 'SELECT * FROM government_officer WHERE government_officer_email = ?';
      table = 'government_officer';
    } else {
      query = 'SELECT * FROM grama_sevaka WHERE grama_sevaka_email = ?';
      table = 'grama_sevaka';
    }

    const [users] = await pool.query(query, [email]);
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user[`${table}_password`]);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user[`${table}_id`], role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '30d' }
    );

    // Prepare user data for response
    const userData = {
      id: user[`${table}_id`],
      nic: user.nic,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user[`${table}_email`],
      role
    };

    res.status(200).json({
      success: true,
      token,
      user: userData
    });

  } catch (error) {
    console.error("Login error:", error);
    next(error);
  }
};

// Get user details by role and id
export const getUserDetails = async (req, res, next) => {
  const { role, id } = req.params;
  try {
    let query, params;
    if (role === 'admin') {
      query = 'SELECT * FROM admin WHERE admin_id = ?';
      params = [id];
    } else if (role === 'government_officer') {
      query = 'SELECT * FROM government_officer WHERE government_officer_id = ?';
      params = [id];
    } else if (role === 'grama_sevaka') {
      query = 'SELECT * FROM grama_sevaka WHERE grama_sevaka_id = ?';
      params = [id];
    } else {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    const [users] = await pool.query(query, params);
    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    res.status(200).json({ success: true, data: users[0] });
  } catch (error) {
    console.error('Get user details error:', error);
    next(error);
  }
};

// Update user details by role and id (only changed fields)
export const updateUserDetails = async (req, res, next) => {
  const { role, id } = req.params;
  const updates = req.body;
  try {
    let table, idField, allowedFields = [], updateFields = [], updateParams = [];
    if (role === 'admin') {
      table = 'admin';
      idField = 'admin_id';
      allowedFields = ['NIC', 'first_name', 'last_name', 'address', 'admin_phone_number', 'admin_email'];
    } else if (role === 'government_officer') {
      table = 'government_officer';
      idField = 'government_officer_id';
      allowedFields = ['nic', 'first_name', 'last_name', 'government_officer_email', 'government_officer_phone_number', 'address', 'district_id', 'divisional_secretariat_id'];
    } else if (role === 'grama_sevaka') {
      table = 'grama_sevaka';
      idField = 'grama_sevaka_id';
      allowedFields = ['nic', 'first_name', 'last_name', 'grama_sevaka_phone_number', 'address', 'grama_sevaka_email', 'grama_niladhari_division_id', 'divisional_secretariat_id', 'district_id'];
    } else {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }
    for (const key of allowedFields) {
      if (updates[key] !== undefined) {
        updateFields.push(`${key} = ?`);
        updateParams.push(updates[key]);
      }
    }
    if (updateFields.length === 0) {
      return res.status(400).json({ success: false, message: 'No valid fields to update' });
    }
    updateParams.push(id);
    const updateQuery = `UPDATE ${table} SET ${updateFields.join(', ')} WHERE ${idField} = ?`;
    const [result] = await pool.query(updateQuery, updateParams);
    if (result.affectedRows === 0) {
      return res.status(404).json({ success: false, message: 'User not found or no changes made' });
    }
    res.status(200).json({ success: true, message: 'User updated successfully' });
  } catch (error) {
    console.error('Update user details error:', error);
    next(error);
  }
};

