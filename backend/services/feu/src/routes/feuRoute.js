// src/routes/feu.routes.js
const express = require('express');
const router = express.Router();
const feuController = require('../controllers/feuController');

// Routes CRUD
router.post('/', feuController.createFeu);
router.get('/', feuController.getAllFeux);
router.get('/:id', feuController.getFeuById);
router.get('/user/:id', feuController.getFeuxByUser);
router.get('/visitor/:id', feuController.getFeuxByVisitor);
router.put('/:id', feuController.updateFeu);
router.delete('/:id', feuController.deleteFeu);

module.exports = router;
