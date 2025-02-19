'use strict';

// Import the required modules
const express = require('express');
const utilities = require('../utilities/index');

// Create a new router
const router = express.Router();

// Login a user with Google OAuth
router.get('/google', utilities.handleErrors(authController.loginGoogle));
router.post('/login', utilities.handleErrors(authController.loginUser));
