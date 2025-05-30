import jwt from 'jsonwebtoken';
import pool from '../utils/db.js';

export const protect = async (req, res, next) => {
  let token;

  //extract token from headers
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized: No token provided'
    });
  }

  try {
    //verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    //determine user table based on role
    let table, idField;
    switch (decoded.role) {
      case 'admin':
        table = 'admin';
        idField = 'admin_id';
        break;
      case 'government_officer':
        table = 'government_officer';
        idField = 'government_officer_id';
        break;
      case 'grama_sevaka':
        table = 'grama_sevaka';
        idField = 'grama_sevaka_id';
        break;
      default:
        return res.status(401).json({
          success: false,
          message: 'Invalid user role'
        });
    }

    //fetch user from database
    const [users] = await pool.query(
      `SELECT * FROM ${table} WHERE ${idField} = ?`,
      [decoded.id]
    );

    if (!users.length) {
      return res.status(401).json({
        success: false,
        message: 'User not found in database'
      });
    }

    //attach user to request
    req.user = {
      ...users[0],
      role: decoded.role,
      id: decoded.id,
      [idField]: decoded.id
    };

    //debug log (remove in production)
    console.log('Authenticated User:', {
      id: req.user.id,
      role: req.user.role,
      email: req.user.email
    });

    next();
  } catch (err) {
    console.error('Authentication Error:', err.message);
    return res.status(401).json({
      success: false,
      message: 'Not authorized: Invalid token'
    });
  }
};

export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Role ${req.user.role} is not authorized to access this route`
      });
    }
    next();
  };
};

//enhanced role-checking middleware
export const requireRole = (role) => {
  return [protect, authorize(role)];
};
