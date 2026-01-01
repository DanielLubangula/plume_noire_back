import express from 'express';
import rateLimit from 'express-rate-limit';
import { firstSetup } from '../../controllers/admin/first-setup.admin.controller.js';
import { firstSetupValidationRules, validate } from '../../middlewares/validator.js';

const router = express.Router();

const setupLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => res.status(429).json({ status: 'error', statusCode: 429, message: 'Too many requests, please try again later.' })
});

router.post('/first-setup', setupLimiter, firstSetupValidationRules(), validate, firstSetup);

export default router;
