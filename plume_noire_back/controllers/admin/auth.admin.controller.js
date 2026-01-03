import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Admin from '../../models/admin.model.js';
import AppError from '../../utils/app-error.js';
import { uploadBuffer, deleteResource } from '../../utils/cloudinary.js';
import logger from '../../utils/logger.js';

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
 * Met à jour le profil admin (email, mot de passe, biographie, photo, réseaux sociaux)
 * @route PUT /api/admin/profile
 * @returns {Promise<Object>} Message de succès et profil mis à jour
 */
export const updateProfile = async (req, res, next) => {
  try {
    const { email, password, currentPassword } = req.body;
    let admin = req.admin;

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

    // Nom, biographie, courte biographie, email de contact et message d'accroche
    if (req.body.nom !== undefined) {updateData.nom = req.body.nom;}
    if (req.body.biographie !== undefined) updateData.biographie = req.body.biographie;
    if (req.body.short_biographie !== undefined) updateData.short_biographie = req.body.short_biographie;
    if (req.body.email_contact !== undefined) updateData.email_contact = req.body.email_contact;
    if (req.body.message_accroche !== undefined) updateData.message_accroche = req.body.message_accroche;

    // Handle optional photo upload (req.file provided by uploadSingleImage middleware)
    if (req.file) {
      // delete previous photo if exists
      if (admin.photo_public_id) {
        try {
          await deleteResource(admin.photo_public_id, { resource_type: 'image' });
        } catch (e) {
          logger.warn({ err: e }, 'Erreur suppression ancienne photo sur Cloudinary (admin)');
        }
      }

      try {
        const uploadResult = await uploadBuffer(req.file.buffer, {
          folder: 'plume-noire/admin/photos',
          resource_type: 'image'
        });
        updateData.photo = uploadResult.secure_url;
        updateData.photo_public_id = uploadResult.public_id;
      } catch (e) {
        logger.error({ err: e }, 'Error uploading admin profile photo');
        if (e?.message && e.message.includes('Stale request')) {
          return next(new AppError(400, "Erreur upload photo : horloge du serveur désynchronisée. Synchronisez l'horloge (NTP) et réessayez."));
        }
        return next(new AppError(500, 'Erreur upload photo'));
      }
    }

    // Handle socials if provided (JSON string or array)
    if (req.body.socials !== undefined) {
      let socials;
      try {
        socials = typeof req.body.socials === 'string' ? JSON.parse(req.body.socials) : req.body.socials;
      } catch (e) {
        return next(new AppError(400, 'Format socials invalide (JSON attendu)'));
      }
      if (!Array.isArray(socials)) return next(new AppError(400, 'Socials doit être un tableau d\'objets {network, url}'));

      const ALLOWED_NETWORKS = ['facebook', 'twitter', 'instagram', 'linkedin', 'youtube', 'tiktok', 'github'];
      for (const s of socials) {
        if (!s.network || !ALLOWED_NETWORKS.includes(s.network)) return next(new AppError(400, `Réseau social invalide: ${s.network}`));
        if (s.url && typeof s.url !== 'string') return next(new AppError(400, 'URL invalide pour un réseau social'));
      }

      // Merge with existing social_links
      const current = admin.social_links || [];
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

    if (Object.keys(updateData).length === 0) {
      return next(new AppError(400, 'Aucune modification fournie'));
    }
    admin = await Admin.findByIdAndUpdate(admin._id, { $set: updateData }, { new: true });
    
    // Sanitize admin for response
    const safe = {
      _id: admin._id,
      email: admin.email,
      nom: admin.nom || '',
      biographie: admin.biographie || '',
      short_biographie: admin.short_biographie || '',
      email_contact: admin.email_contact || '',
      message_accroche: admin.message_accroche || '',
      photo: admin.photo || '',
      social_links: admin.social_links || [],
      created_at: admin.created_at,
      updated_at: admin.updated_at
    };
    res.status(200).json({
      status: 'success',
      message: 'Profil mis à jour avec succès',
      admin: safe
    });
  } catch (err) {
    next(new AppError(500, err.message));
  }
};

/**
 * Supprimer plusieurs réseaux sociaux (Admin)
 * @route DELETE /api/admin/profile/socials
 * @body { networks: string[] }
 */
export const deleteSocials = async (req, res, next) => {
  try {
    const { networks } = req.body;
    if (!Array.isArray(networks) || networks.length === 0) return next(new AppError(400, 'Aucun réseau fourni'));

    const ALLOWED_NETWORKS = ['facebook','whatsapp','twitter','instagram','linkedin','youtube','tiktok','github'];
    for (const n of networks) {
      if (!ALLOWED_NETWORKS.includes(n)) return next(new AppError(400, `Réseau social invalide: ${n}`));
    }

    const admin = req.admin;
    if (!admin) return next(new AppError(401, 'Admin non authentifié'));

    const current = admin.social_links || [];
    const newArray = current.filter(s => !networks.includes(s.network));

    if (newArray.length === current.length) {
      return next(new AppError(404, 'Aucun réseau supprimé'));
    }

    const updated = await Admin.findByIdAndUpdate(admin._id, { $set: { social_links: newArray, updated_at: new Date() } }, { new: true });

    return res.status(200).json({ status: 'success', message: 'Réseaux supprimés', data: { social_links: updated.social_links } });
  } catch (err) {
    next(new AppError(500, err.message));
  }
};