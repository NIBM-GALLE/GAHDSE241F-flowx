import jwt from 'jsonwebtoken';
import { errorHandler } from './errorHandler.js';
import logger from '../utils/logger.js';

export const verifyToken = (req, res, next) => {
  let token = req.cookies?.access_token;

  //check for token in Authorization header
  if (!token && req.headers.authorization?.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(errorHandler(401, 'Unauthorized'));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return next(errorHandler(403, 'Forbidden'));

    logger.info('Token verified successfully:', user);

    req.user = user;
    next();
  });
};