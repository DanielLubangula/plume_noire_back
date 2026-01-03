import Admin from '../../models/admin.model.js';
import AppError from '../../utils/app-error.js';
import logger from '../../utils/logger.js';

/**
 * Récupère la page biographie publique (données de l'admin sans password_hash)
 * @route GET /api/public/biographie
 * @returns {Promise<Object>} Informations publiques de l'admin
 */
export const getBiography = async (req, res, next) => {
  try {
    const admin = await Admin.findOne().select('-password_hash').lean();
    if (!admin) return next(new AppError(404, 'Admin not found'));

    const defaultPhoto = `${req.protocol}://${req.get('host')}/static/images/default_image_actus.png`;

    // Ensure sensible defaults and remove fields we don't want to expose
    const safeAdmin = {
      ...admin,
      photo: admin.photo && admin.photo.length ? admin.photo : defaultPhoto
    };

    return res.status(200).json({ status: 'success', data: { admin: safeAdmin } });
  } catch (err) {
    logger.error({ err }, 'Error fetching public biography');
    return next(new AppError(500, err.message));
  }
};

export default { getBiography };