import jwt from 'jsonwebtoken';
import { errorHandler } from './errorHandler.js';
import logger from '../utils/logger.js';
import { pool } from '../utils/db.js';

// Protect middleware for member authentication
export const protect = async (req, res, next) => {
  let token;

  // Extract token from cookies or Authorization header
  if (req.cookies?.access_token) {
    token = req.cookies.access_token;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(errorHandler(401, 'Not authorized: No token provided'));
  }

  try {
    // Verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Only member table is supported here
    const [users] = await pool.query(
      'SELECT * FROM member WHERE member_id = ?',
      [decoded.id]
    );

    if (!users.length) {
      return next(errorHandler(401, 'User not found in database'));
    }

    // Attach user to request
    req.user = {
      ...users[0],
      id: decoded.id,
      role: 'member',
      member_id: decoded.id
    };

    logger.info('Authenticated Member:', {
      id: req.user.id,
      email: req.user.member_email
    });

    next();
  } catch (err) {
    logger.error('Authentication Error:', err.message);
    return next(errorHandler(401, 'Not authorized: Invalid token'));
  }
};

// Authorize middleware for future extensibility
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(errorHandler(403, `Role ${req.user.role} is not authorized to access this route`));
    }
    next();
  };
};

// Enhanced role-checking middleware (for future use)
export const requireRole = (role) => {
  return [protect, authorize(role)];
};