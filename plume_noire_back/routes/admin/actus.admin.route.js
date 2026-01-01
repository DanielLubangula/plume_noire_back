import express from 'express';
import { createActu, updateActu, deleteActu, getActus, getActu } from '../../controllers/admin/actus.admin.controller.js';
import { requireAdminAuth } from '../../middlewares/auth.js';
import { actusIdValidationRules, createActuValidationRules, updateActuValidationRules, validate } from '../../middlewares/validator.js';
import { uploadSingleImage } from '../../middlewares/upload.js';

const router = express.Router();

router.get('/actus', requireAdminAuth, getActus);
router.get('/actus/:id', requireAdminAuth, actusIdValidationRules(), validate, getActu);
router.post('/actus', requireAdminAuth, uploadSingleImage, createActuValidationRules(), validate, createActu);
router.put('/actus/:id', requireAdminAuth, actusIdValidationRules(), uploadSingleImage, updateActuValidationRules(), validate, updateActu);
router.delete('/actus/:id', requireAdminAuth, actusIdValidationRules(), validate, deleteActu);

export default router;
