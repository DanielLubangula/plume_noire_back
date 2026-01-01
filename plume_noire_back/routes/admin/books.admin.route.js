import express from 'express';
import { createBook, updateBook, deleteBook, getBooks, getBook } from '../../controllers/admin/books.admin.controller.js';
import { requireAdminAuth } from '../../middlewares/auth.js';
import { createBookValidationRules, updateBookValidationRules, bookIdValidationRules, validate } from '../../middlewares/validator.js';
import { uploadFields } from '../../middlewares/upload.js';

const router = express.Router();

router.get('/livres', requireAdminAuth, getBooks);
router.get('/livres/:id', requireAdminAuth, bookIdValidationRules(), validate, getBook);
router.post('/livres', requireAdminAuth, uploadFields, createBookValidationRules(), validate, createBook);
router.put('/livres/:id', requireAdminAuth, uploadFields, updateBookValidationRules(), validate, updateBook);
router.delete('/livres/:id', requireAdminAuth, bookIdValidationRules(), validate, deleteBook);

export default router;
