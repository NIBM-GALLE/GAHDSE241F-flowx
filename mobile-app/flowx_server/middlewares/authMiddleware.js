import jwt from 'jsonwebtoken';
import { errorHandler } from './errorHandler.js';
import logger from '../utils/logger.js';
import { pool } from '../utils/db.js';

//protect middleware for member authentication
export const protect = async (req, res, next) => {
  console.log('🔐 [protect] Called for', req.method, req.originalUrl);
  console.log('🔐 [protect] Headers:', req.headers);
  let token;

  //extract token from cookies or Authorization header
  if (req.cookies?.access_token) {
    token = req.cookies.access_token;
  } else if (req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(errorHandler(401, 'Not authorized: No token provided'));
  }

  try {
    //verify JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //only member table is supported here
    //accept both member_id and id for compatibility
    const memberId = decoded.member_id || decoded.id;
    const [users] = await pool.query(
      'SELECT * FROM member WHERE member_id = ?',
      [memberId]
    );

    if (!users.length) {
      return next(errorHandler(401, 'User not found in database'));
    }

    //attach user to request
    req.user = {
      ...users[0],
      id: memberId,
      role: 'member',
      member_id: memberId
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

//authorize middleware for future extensibility
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!allowedRoles.includes(req.user.role)) {
      return next(errorHandler(403, `Role ${req.user.role} is not authorized to access this route`));
    }
    next();
  };
};

//enhanced role-checking middleware (for future use)
export const requireRole = (role) => {
  return [protect, authorize(role)];
};