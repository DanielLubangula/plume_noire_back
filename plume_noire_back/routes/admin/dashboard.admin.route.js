import express from 'express';
import { getDashboard } from '../../controllers/admin/dashboard.admin.controller.js';
import { requireAdminAuth } from '../../middlewares/auth.js';

const router = express.Router();

router.get('/dashboard', requireAdminAuth, getDashboard);

export default router;