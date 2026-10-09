import { AppError } from '../utils/AppError.js';

export function requireRole(role) {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(new AppError('Forbidden', 403));
    }
    next();
  };
}
