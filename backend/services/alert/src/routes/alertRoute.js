// src/routes/feu.routes.js
const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

// Routes CRUD
router.get('/', alertController.getAllWarnings); // Admin
//router.get('/:id', alertController.getWarningById);
//router.post('/:id', alertController.acknowledgeWarning);
router.get('/user/:id', alertController.getWarningsByUser); // Company User
router.get('/visitor/:id', alertController.getWarningsByVisitor); // Visitor

module.exports = router;
