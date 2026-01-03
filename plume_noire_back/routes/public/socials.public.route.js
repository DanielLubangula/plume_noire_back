import express from 'express';
import { getSocials } from '../../controllers/public/socials.controller.js';

const router = express.Router();

// GET /api/public/socials
router.get('/socials', getSocials);

export default router;