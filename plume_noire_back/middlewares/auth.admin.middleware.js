import jwt from 'jsonwebtoken';
import Admin from '../models/admin.model.js';
import AppError from '../utils/app-error.js';

export const authenticateAdmin = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return next(new AppError(401, 'Token manquant'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const admin = await Admin.findById(decoded.adminId);
    
    if (!admin) {
      return next(new AppError(401, 'Admin non trouvé'));
    }

    req.admin = admin;
    next();
  } catch (err) {
    next(new AppError(401, 'Token invalide'));
  }
};