import express from 'express';
import { getPublicActus, getPublicActu } from '../../controllers/public/actus.controller.js';
import { actusIdValidationRules, validate } from '../../middlewares/validator.js';

const router = express.Router();

// GET /api/public/actus
router.get('/actus', getPublicActus);

// GET /api/public/actus/:id
router.get('/actus/:id', actusIdValidationRules(), validate, getPublicActu);

export default router;