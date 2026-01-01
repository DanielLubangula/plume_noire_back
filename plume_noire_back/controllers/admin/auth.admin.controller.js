import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../../models/admin.model.js';
import AppError from '../../utils/app-error.js';

/**
 * Authentifie un administrateur
 * @route POST /api/admin/login
 * @returns {Promise<Object>} Token JWT
 */
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) {
      return next(new AppError(401, 'Identifiants invalides'));
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password_hash);
    if (!isPasswordValid) {
      return next(new AppError(401, 'Identifiants invalides'));
    }

    const token = jwt.sign(
      { adminId: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      status: 'success',
      token
    });
  } catch (err) {
    next(new AppError(500, err.message));
  }
};

/**
 * Met à jour le profil admin (email et/ou mot de passe)
 * @route PUT /api/admin/profile
 * @returns {Promise<Object>} Message de succès
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { email, password, currentPassword } = req.body;
    const admin = req.admin;

    // Vérifier le mot de passe actuel
    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isCurrentPasswordValid) {
      return next(new AppError(401, 'Mot de passe actuel incorrect'));
    }

    const updateData = {};

    // Mettre à jour l'email si fourni
    if (email && email !== admin.email) {
      const existingAdmin = await Admin.findOne({ email, _id: { $ne: admin._id } });
      if (existingAdmin) {
        return next(new AppError(400, 'Cet email est déjà utilisé'));
      }
      updateData.email = email;
    }

    // Mettre à jour le mot de passe si fourni
    if (password) {
      const saltRounds = 12;
      updateData.password_hash = await bcrypt.hash(password, saltRounds);
    }

    if (Object.keys(updateData).length === 0) {
      return next(new AppError(400, 'Aucune modification fournie'));
    }

    await Admin.findByIdAndUpdate(admin._id, updateData);

    res.status(200).json({
      status: 'success',
      message: 'Profil mis à jour avec succès'
    });
  } catch (err) {
    next(new AppError(500, err.message));
  }
};