import Admin from '../../models/admin.model.js';
import AppError from '../../utils/app-error.js';
import logger from '../../utils/logger.js';

/**
 * Récupère les réseaux sociaux publiques de l'admin
 * @route GET /api/public/socials
 * @returns {Promise<Object>} { social_links: [{ network, url }] }
 */
export const getSocials = async (req, res, next) => {
  try {
    const admin = await Admin.findOne().select('social_links').lean();

    const socials = (admin && Array.isArray(admin.social_links)) ? admin.social_links : [];

    return res.status(200).json({ status: 'success', data: { social_links: socials } });
  } catch (err) {
    logger.error({ err }, 'Error fetching public socials');
    return next(new AppError(500, err.message));
  }
};

export default { getSocials };