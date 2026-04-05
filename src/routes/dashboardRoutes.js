const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const { requireRole } = require('../middleware/roleCheck');

// Dashboard can be viewed by all roles (Viewer, Analyst, Admin)
// But they must be authenticated (which is handled in app.js before these routes)
router.get('/summary', requireRole(['Viewer', 'Analyst', 'Admin']), dashboardController.getSummary);
router.get('/category-totals', requireRole(['Viewer', 'Analyst', 'Admin']), dashboardController.getCategoryTotals);

module.exports = router;
