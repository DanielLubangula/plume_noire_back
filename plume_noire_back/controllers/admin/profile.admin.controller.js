import Author from '../../models/author.model.js';
import AppError from '../../utils/app-error.js';
import { uploadBuffer, deleteResource } from '../../utils/cloudinary.js';
import logger from '../../utils/logger.js';

const ALLOWED_NETWORKS = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'github'];

/**
 * Récupère le profil auteur
 * @route GET /api/admin/profil
 */
export const getProfile = async (req, res, next) => {
  try {
    let profile = await Author.findOne();
    if (!profile) {
      // return empty default
      profile = new Author();
    }

    const defaultPhoto = `${req.protocol}://${req.get('host')}/static/images/default_image_actus.png`;
    const normalized = {
      ...profile.toObject(),
      photo: profile.photo && profile.photo.length ? profile.photo : defaultPhoto
    };

    return res.status(200).json({ status: 'success', data: { profile: normalized } });
  } catch (err) {
    logger.error({ err }, 'Error fetching profile');
    return next(new AppError(500, err.message));
  }
};

/**
 * Mettre à jour le profil auteur
 * @route PUT /api/admin/profil
 * @description Supports multipart/form-data with optional `photo` file and `socials` JSON string
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { biographie, email_contact } = req.body;
    // Parse socials if provided (JSON string or array)
    let socials = undefined;
    if (req.body.socials) {
      try {
        socials = typeof req.body.socials === 'string' ? JSON.parse(req.body.socials) : req.body.socials;
      } catch (e) {
        return next(new AppError(400, 'Format socials invalide (JSON attendu)'));
      }
      if (!Array.isArray(socials)) return next(new AppError(400, 'Socials doit être un tableau d\'objets {network, url}'));
      for (const s of socials) {
        if (!s.network || !ALLOWED_NETWORKS.includes(s.network)) return next(new AppError(400, `Réseau social invalide: ${s.network}`));
        if (s.url && typeof s.url !== 'string') return next(new AppError(400, 'URL invalide pour un réseau social'));
      }
    }

    let profile = await Author.findOne();
    if (!profile) {
      profile = new Author();
    }

    const updateData = {};
    if (biographie !== undefined) updateData.biographie = biographie;
    if (email_contact !== undefined) updateData.email_contact = email_contact;

    // Handle optional photo
    if (req.file) {
      // delete previous photo if exists
      if (profile.photo_public_id) {
        try {
          await deleteResource(profile.photo_public_id, { resource_type: 'image' });
        } catch (e) {
          logger.warn({ err: e }, 'Erreur suppression ancienne photo sur Cloudinary');
        }
      }

      try {
        const uploadResult = await uploadBuffer(req.file.buffer, {
          folder: 'plume-noire/author/photos',
          resource_type: 'image'
        });
        updateData.photo = uploadResult.secure_url;
        updateData.photo_public_id = uploadResult.public_id;
      } catch (e) {
        logger.error({ err: e }, 'Error uploading profile photo');
        if (e?.message && e.message.includes('Stale request')) {
          return next(new AppError(400, "Erreur upload photo : horloge du serveur désynchronisée. Synchronisez l'horloge (NTP) et réessayez."));
        }
        return next(new AppError(500, 'Erreur upload photo'));
      }
    }

    // Handle socials modifications: socials is an array of {network, url}. If url present -> set/update; if url empty/null -> remove
    if (socials !== undefined) {
      const current = profile.social_links || [];
      const map = new Map(current.map(s => [s.network, s.url]));

      for (const s of socials) {
        const network = s.network;
        const url = s.url;
        if (url === null || url === '') {
          map.delete(network);
        } else {
          map.set(network, url);
        }
      }

      const newArray = Array.from(map.entries()).map(([network, url]) => ({ network, url }));
      updateData.social_links = newArray;
    }

    updateData.updated_at = new Date();

    const updated = await Author.findOneAndUpdate({}, { $set: updateData }, { upsert: true, new: true });

    const defaultPhoto = `${req.protocol}://${req.get('host')}/static/images/default_image_actus.png`;
    const normalized = { ...updated.toObject(), photo: updated.photo && updated.photo.length ? updated.photo : defaultPhoto };

    return res.status(200).json({ status: 'success', profile: normalized });
  } catch (err) {
    logger.error({ err }, 'Error updating profile');
    return next(new AppError(500, err.message));
  }
};

/**
 * Supprimer la photo du profil (réinitialise à image par défaut)
 * @route DELETE /api/admin/profil/photo
 */
export const deletePhoto = async (req, res, next) => {
  try {
    const profile = await Author.findOne();
    if (!profile || !profile.photo_public_id) {
      return next(new AppError(400, 'Aucune photo à supprimer'));
    }

    try {
      await deleteResource(profile.photo_public_id, { resource_type: 'image' });
    } catch (e) {
      logger.warn({ err: e }, 'Erreur suppression photo sur Cloudinary');
    }

    profile.photo = '';
    profile.photo_public_id = '';
    profile.updated_at = new Date();
    await profile.save();

    const defaultPhoto = `${req.protocol}://${req.get('host')}/static/images/default_image_actus.png`;
    return res.status(200).json({ status: 'success', profile: { ...profile.toObject(), photo: defaultPhoto } });
  } catch (err) {
    logger.error({ err }, 'Error deleting profile photo');
    return next(new AppError(500, err.message));
  }
};

/**
 * Supprimer un réseau social par nom (predifined)
 * @route DELETE /api/admin/profil/socials/:network
 */
export const deleteSocial = async (req, res, next) => {
  try {
    const { network } = req.params;
    if (!ALLOWED_NETWORKS.includes(network)) return next(new AppError(400, 'Réseau social inconnu'));

    const profile = await Author.findOne();
    if (!profile) return next(new AppError(404, 'Profile not found'));

    profile.social_links = (profile.social_links || []).filter(s => s.network !== network);
    profile.updated_at = new Date();
    await profile.save();

    return res.status(200).json({ status: 'success', profile });
  } catch (err) {
    logger.error({ err }, 'Error deleting social link');
    return next(new AppError(500, err.message));
  }
};

export default { getProfile, updateProfile, deletePhoto, deleteSocial };
