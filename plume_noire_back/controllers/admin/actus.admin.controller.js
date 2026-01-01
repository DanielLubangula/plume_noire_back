import Actu from '../../models/actus.model.js';
import AppError from '../../utils/app-error.js';
import { uploadBuffer, deleteResource } from '../../utils/cloudinary.js';
import logger from '../../utils/logger.js';

/**
 * Crée une actualité
 * @route POST /api/admin/actus
 */
export const createActu = async (req, res, next) => {
  try {
    const { titre, contenu } = req.body;

    const actusData = { titre, contenu };

    // Default image URL (will be absolute using request host)
    const defaultImageUrl = `${req.protocol}://${req.get('host')}/static/images/default_image_actus.png`;

    // If image file provided (multipart/form-data), upload to Cloudinary
    if (req.file) {
      try {
        const uploadResult = await uploadBuffer(req.file.buffer, {
          folder: 'plume-noire/actus/images',
          resource_type: 'image'
        });
        actusData.image = uploadResult.secure_url;
        actusData.image_public_id = uploadResult.public_id;
      } catch (e) {
        logger.error({ err: e }, 'Error uploading actu image');        // Cloudinary "Stale request" often means server clock is out of sync
        if (e?.message && e.message.includes('Stale request')) {
          return next(new AppError(400, 'Erreur upload image : horloge du serveur désynchronisée. Synchronisez l\'horloge (NTP) et réessayez.'));
        }
        return next(new AppError(500, 'Erreur upload image'));
      }
    } else {
      // No image provided; use default image URL
      actusData.image = defaultImageUrl;
      actusData.image_public_id = '';
    }

    const created = await Actu.create(actusData);

    // Ensure created.actu has image set (should already)
    if (!created.image) created.image = defaultImageUrl;

    return res.status(201).json({ status: 'success', actu: created });
  } catch (err) {
    logger.error({ err }, 'Error creating actu');
    return next(new AppError(500, err.message));
  }
};

/**
 * Mettre à jour une actualité
 * @route PUT /api/admin/actus/:id
 */
export const updateActu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { titre, contenu } = req.body;

    const actu = await Actu.findById(id);
    if (!actu) return next(new AppError(404, 'Actu not found'));

    const updateData = {};
    if (titre !== undefined) updateData.titre = titre;
    if (contenu !== undefined) updateData.contenu = contenu;

    // Handle optional image replacement
    if (req.file) {
      // delete previous image if present
      if (actu.image_public_id) {
        try {
          await deleteResource(actu.image_public_id, { resource_type: 'image' });
        } catch (e) {
          logger.warn({ err: e }, 'Erreur suppression ancienne image actu sur Cloudinary');
        }
      }
      // upload new image
      try {
        const uploadResult = await uploadBuffer(req.file.buffer, {
          folder: 'plume-noire/actus/images',
          resource_type: 'image'
        });
        updateData.image = uploadResult.secure_url;
        updateData.image_public_id = uploadResult.public_id;
      } catch (e) {
        logger.error({ err: e }, 'Error uploading actu image');
        if (e?.message && e.message.includes('Stale request')) {
          return next(new AppError(400, 'Erreur upload image : horloge du serveur désynchronisée. Synchronisez l\'horloge (NTP) et réessayez.'));
        }
        return next(new AppError(500, 'Erreur upload image'));
      }
    }

    updateData.updated_at = new Date();

    if (Object.keys(updateData).length === 1 && updateData.updated_at) {
      return next(new AppError(400, 'Aucune modification fournie'));
    }

    const updated = await Actu.findByIdAndUpdate(id, updateData, { new: true });
    return res.status(200).json({ status: 'success', actu: updated });
  } catch (err) {
    logger.error({ err }, 'Error updating actu');
    return next(new AppError(500, err.message));
  }
};

/**
 * Supprimer une actualité
 * @route DELETE /api/admin/actus/:id
 */
export const deleteActu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actu = await Actu.findById(id);
    if (!actu) return next(new AppError(404, 'Actu not found'));

    // delete image from Cloudinary if present
    if (actu.image_public_id) {
      try {
        await deleteResource(actu.image_public_id, { resource_type: 'image' });
      } catch (e) {
        logger.warn({ err: e }, 'Erreur suppression image actu sur Cloudinary');
      }
    }

    await Actu.findByIdAndDelete(id);
    return res.status(200).json({ status: 'success', message: 'Actu deleted' });
  } catch (err) {
    logger.error({ err }, 'Error deleting actu');
    return next(new AppError(500, err.message));
  }
};

/**
 * Récupère toutes les actus
 * @route GET /api/admin/actus
 */
export const getActus = async (req, res, next) => {
  try {
    const actus = await Actu.find().sort({ created_at: -1 });

    const defaultImageUrl = `${req.protocol}://${req.get('host')}/static/images/default_image_actus.png`;
    const normalized = actus.map(a => ({
      ...a.toObject(),
      image: a.image && a.image.length ? a.image : defaultImageUrl
    }));

    return res.status(200).json({ status: 'success', data: { actus: normalized } });
  } catch (err) {
    logger.error({ err }, 'Error fetching actus');
    return next(new AppError(500, err.message));
  }
};

/**
 * Récupère une actu
 * @route GET /api/admin/actus/:id
 */
export const getActu = async (req, res, next) => {
  try {
    const { id } = req.params;
    const actu = await Actu.findById(id);
    if (!actu) return next(new AppError(404, 'Actu not found'));

    const defaultImageUrl = `${req.protocol}://${req.get('host')}/static/images/default_image_actus.png`;
    const normalized = { ...actu.toObject(), image: actu.image && actu.image.length ? actu.image : defaultImageUrl };

    return res.status(200).json({ status: 'success', data: { actu: normalized } });
  } catch (err) {
    logger.error({ err }, 'Error fetching actu');
    return next(new AppError(500, err.message));
  }
};

export default { createActu, updateActu, deleteActu, getActus, getActu };