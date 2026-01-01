import Author from '../../models/author.model.js';
import Book from '../../models/book.model.js';
import AppError from '../../utils/app-error.js';
import logger from '../../utils/logger.js';

/**
 * Récupère les informations de la page d'accueil publique
 * @route GET /api/public/home
 * @returns {Promise<Object>} Informations auteur + livres mis en avant
 */
export const getHome = async (req, res, next) => {
  try {
    // Récupérer l'auteur (il n'y a qu'un seul document Author)
    let author = await Author.findOne().lean();

    // Valeurs par défaut si aucun auteur
    if (!author) {
      author = {
        nom: '',
        photo: `${req.protocol}://${req.get('host')}/static/images/default_image_actus.png`,
        biographie: '',
        short_biographie: '',
        message_accroche: ''
      };
    }

    // Récupérer uniquement les livres mis en avant (is_featured = true)
    const books = await Book.find({ is_featured: true }).sort({ created_at: -1 }).limit(3).select('titre description extrait couverture statut').lean();

    const featured = books.map(b => ({
      id: b._id,
      titre: b.titre,
      resume: b.extrait || b.description || '',
      couverture: b.couverture || '',
      statut: b.statut || 'gratuit'
    }));

    // Construire la courte biographie si absente
    const courteBio = author.short_biographie && author.short_biographie.length
      ? author.short_biographie
      : (author.biographie ? author.biographie.slice(0, 300) : '');

    return res.status(200).json({
      status: 'success',
      data: {
        nom_auteur: author.nom || '',
        photo_auteur: author.photo && author.photo.length ? author.photo : `${req.protocol}://${req.get('host')}/static/images/default_image_actus.png`,
        courte_biographie: courteBio,
        livre_mis_en_avant: featured,
        message_accroche: author.message_accroche || ''
      }
    });
  } catch (err) {
    logger.error({ err }, 'Error fetching public home');
    return next(new AppError(500, err.message));
  }
};

export default { getHome };