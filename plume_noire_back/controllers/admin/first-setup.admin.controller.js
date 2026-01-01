import bcrypt from 'bcryptjs';
import Admin from '../../models/admin.model.js';
import AppError from '../../utils/app-error.js';

/**
 * Crée le premier administrateur
 * @route POST /api/admin/first-setup
 * @returns {Promise<Object>} Message de confirmation
 */
export const firstSetup = async (req, res, next) => {
  try {
    const adminCount = await Admin.countDocuments();
    if (adminCount > 0) {
      return next(new AppError(403, 'Forbidden – Admin already exists'));
    }

    const { email, password } = req.body;
    const password_hash = await bcrypt.hash(password, 10);

    await Admin.create({
      email,
      password_hash
    });

    res.status(201).json({
      status: 'success',
      message: 'First admin created'
    });
  } catch (err) {
    next(new AppError(500, err.message));
  }
};