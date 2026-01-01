import express from 'express';
import authRoutes from './auth.admin.route.js';
import firstSetupRoutes from './first-setup.admin.route.js';
import dashboardRoutes from './dashboard.admin.route.js';
import booksRoutes from './books.admin.route.js';
import actusRoutes from './actus.admin.route.js';

const router = express.Router();

// Each child router contains only route definitions and references controllers
router.use('/', authRoutes);
router.use('/', firstSetupRoutes);
router.use('/', dashboardRoutes);
router.use('/', booksRoutes);
router.use('/', actusRoutes);

export default router;
