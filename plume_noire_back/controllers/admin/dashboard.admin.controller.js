import Book from '../../models/book.model.js';
import Sale from '../../models/sale.model.js';
import Message from '../../models/message.model.js';
import AppError from '../../utils/app-error.js';

/**
 * Récupère les métriques du tableau de bord admin
 * @route GET /api/admin/dashboard
 * @returns {Promise<Object>} Metrics
 */
export const getDashboard = async (req, res, next) => {
  try {
    const nombre_livres = await Book.countDocuments();
    const nombre_ventes = await Sale.countDocuments();
    const nombre_messages = await Message.countDocuments();

    // Ventes des 7 derniers jours (groupées par date)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);

    const ventesLast7Days = await Sale.aggregate([
      { $match: { created_at: { $gte: new Date(sevenDaysAgo.toDateString()) } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$created_at' } },
          count: { $sum: 1 },
          totalAmount: { $sum: '$amount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Revenus totaux
    const revenusAgg = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } }
    ]);
    const revenus_total = revenusAgg[0]?.total || 0;

    // Ventes ce mois
    const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const ventesCeMois = await Sale.countDocuments({ created_at: { $gte: firstDayOfMonth } });

    const statistiques_simples = {
      ventes_last_7_days: ventesLast7Days,
      revenus_total,
      ventes_ce_mois: ventesCeMois,
      livres_gratuits: await Book.countDocuments({ statut: 'gratuit' }),
      livres_payants: await Book.countDocuments({ statut: 'payant' })
    };

    return res.status(200).json({
      status: 'success',
      nombre_livres,
      nombre_ventes,
      nombre_messages,
      statistiques_simples
    });
  } catch (err) {
    return next(new AppError(500, err.message));
  }
};