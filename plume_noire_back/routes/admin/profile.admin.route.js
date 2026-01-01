import express from 'express';
import { authenticateAdmin } from '../../middlewares/auth.admin.middleware.js';
import { getProfile, updateProfile, deletePhoto, deleteSocial } from '../../controllers/admin/profile.admin.controller.js';
import { profileValidationRules, validate } from '../../middlewares/validator.js';
import { uploadSingleImage } from '../../middlewares/upload.js';

const router = express.Router();

router.get('/profil', authenticateAdmin, getProfile);
router.put('/profil', authenticateAdmin, uploadSingleImage, profileValidationRules(), validate, updateProfile);
router.delete('/profil/photo', authenticateAdmin, deletePhoto);
router.delete('/profil/socials/:network', authenticateAdmin, deleteSocial);

export default router;