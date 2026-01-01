import Actu from '../../models/actus.model.js';
import AppError from '../../utils/app-error.js';
import logger from '../../utils/logger.js';
import { uploadBuffer, deleteResource } from '../../utils/cloudinary.js';

/**
 * Crée une actualité
 * @route POST /api/admin/actus
 */
export const createActu = async (req, res, next) => {
  try {
    const { titre, contenu } = req.body;

    const actusData = { titre, contenu };

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
        logger.error({ err: e }, 'Error uploading actu image');
        return next(new AppError(500, 'Erreur upload image'));
      }
    }

    const created = await Actu.create(actusData);
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
    return res.status(200).json({ status: 'success', data: { actus } });
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
    return res.status(200).json({ status: 'success', data: { actu } });
  } catch (err) {
    logger.error({ err }, 'Error fetching actu');
    return next(new AppError(500, err.message));
  }
};

export default { createActu, updateActu, deleteActu, getActus, getActu };