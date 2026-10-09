import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';

export function authenticate(req, res, next) {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Bearer ')) {
    return next(new AppError('Not authenticated', 401));
  }

  const token = header.slice(7);

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role };
    next();
  } catch (error) {
    next(new AppError('Invalid or expired token', 401));
  }
}
