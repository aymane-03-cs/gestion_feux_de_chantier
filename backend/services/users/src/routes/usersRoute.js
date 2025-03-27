// src/routes/feu.routes.js
const express = require('express');
const router = express.Router();
const users = require('../controllers/userController');

// Routes CRUD
router.post('/', users.createUser);
router.get('/', users.getAllUsers);
router.get('/:id', users.getUserById);
router.put('/:id', users.updateUser);
router.delete('/:id', users.deleteUser);

module.exports = router;
