import jwt from 'jsonwebtoken';
import pool from '../utils/db.js';

export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Determine which table to query based on role
    let query;
    if (decoded.role === 'admin') {
      query = 'SELECT * FROM admin WHERE admin_id = ?';
    } else if (decoded.role === 'government_officer') {
      query = 'SELECT * FROM government_officer WHERE government_officer_id = ?';
    } else {
      query = 'SELECT * FROM grama_sevaka WHERE grama_sevaka_id = ?';
    }

    const [users] = await pool.query(query, [decoded.id]);
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'User not found'
      });
    }

    //debugging log
    req.user = users[0];
    req.user.role = decoded.role;

    console.log('Authenticated User:', req.user);

    req.user = users[0];
    req.user.role = decoded.role;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};