const express = require('express');
const authController = require('../controllers/authController');

const router = express.Router();

// Public routes for signing up and logging in
router.post('/signup', authController.signup);
router.post('/login', authController.login);

module.exports = router;

