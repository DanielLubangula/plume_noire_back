import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, updateProfile } from '../../controllers/admin/auth.admin.controller.js';
import { loginValidationRules, updateProfileValidationRules, validate } from '../../middlewares/validator.js';
import { authenticateAdmin } from '../../middlewares/auth.admin.middleware.js';
import { uploadSingleImage } from '../../middlewares/upload.js';

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ status: 'error', statusCode: 429, message: 'Too many requests, please try again later.' })
});

router.post('/login', loginLimiter, loginValidationRules(), validate, login);
router.put('/profile', authenticateAdmin, uploadSingleImage, updateProfileValidationRules(), validate, updateProfile);

export default router;
