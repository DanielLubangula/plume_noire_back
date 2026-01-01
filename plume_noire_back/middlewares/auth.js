import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import AppError from '../utils/app-error.js';

/**
 * Middleware d'authentification admin via JWT
 */
export const requireAdminAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return next(new AppError(401, 'Unauthorized'));
    }

    const token = authHeader.split(' ')[1];
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return next(new AppError(401, 'Unauthorized'));
    }

    const admin = await Admin.findById(payload.adminId);
    if (!admin) {
      return next(new AppError(401, 'Unauthorized'));
    }

    req.admin = admin;
    return next();
  } catch (err) {
    return next(new AppError(500, err.message));
  }
};

export default { requireAdminAuth };
