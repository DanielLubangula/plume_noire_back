import express from 'express';
import { getHome } from '../../controllers/public/home.controller.js';

const router = express.Router();

// GET /api/public/home
router.get('/home', getHome);

export default router;