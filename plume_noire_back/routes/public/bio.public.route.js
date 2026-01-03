import express from 'express';
import { getBiography } from '../../controllers/public/bio.controller.js';

const router = express.Router();

// GET /api/public/biographie
router.get('/biographie', getBiography);

export default router;