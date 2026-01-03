import Actu from '../../models/actus.model.js';
import AppError from '../../utils/app-error.js';
import logger from '../../utils/logger.js';

/**
 * Récupère la liste publique des actus
 * @route GET /api/public/actus
 * @queryparam {number} [limit] Nombre maximum d'actus à retourner (optionnel)
 * @returns {Promise<Object>} Liste d'actus normalisées
 */
export const getPublicActus = async (req, res, next) => {
  try {
    const limit = req.query.limit ? Math.min(Number(req.query.limit) || 0, 100) : 0;

    const query = Actu.find().sort({ created_at: -1 });
    if (limit > 0) query.limit(limit);

    const actus = await query.lean();

    const defaultImageUrl = `${req.protocol}://${req.get('host')}/static/images/default_image_actus.png`;
    const normalized = actus.map(a => ({
      id: a._id,
      titre: a.titre,
      contenu: a.contenu,
      excerpt: a.contenu ? (a.contenu.length > 300 ? `${a.contenu.slice(0, 300)}...` : a.contenu) : '',
      image: a.image && a.image.length ? a.image : defaultImageUrl,
      created_at: a.created_at,
      updated_at: a.updated_at
    }));

    return res.status(200).json({ status: 'success', data: { actus: normalized } });
  } catch (err) {
    logger.error({ err }, 'Error fetching public actus');
    return next(new AppError(500, err.message));
  }
};

/**
 * Récupère une actu publique par id
 * @route GET /api/public/actus/:id
 */
export const getPublicActu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actu = await Actu.findById(id).lean();
    if (!actu) return next(new AppError(404, 'Actu not found'));

    const defaultImageUrl = `${req.protocol}://${req.get('host')}/static/images/default_image_actus.png`;
    const normalized = {
      id: actu._id,
      titre: actu.titre,
      contenu: actu.contenu,
      image: actu.image && actu.image.length ? actu.image : defaultImageUrl,
      created_at: actu.created_at,
      updated_at: actu.updated_at
    };

    return res.status(200).json({ status: 'success', data: { actu: normalized } });
  } catch (err) {
    logger.error({ err }, 'Error fetching public actu');
    return next(new AppError(500, err.message));
  }
};

export default { getPublicActus, getPublicActu };