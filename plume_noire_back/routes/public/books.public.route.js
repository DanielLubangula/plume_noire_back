import express from 'express';
import { downloadBook } from '../../controllers/public/books.controller.js';
import { bookIdValidationRules, validate } from '../../middlewares/validator.js';

const router = express.Router();

// GET /api/public/livres/:id/telecharger
router.get('/livres/:id/telecharger', bookIdValidationRules(), validate, downloadBook);

export default router;