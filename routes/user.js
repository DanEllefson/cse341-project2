'use strict';

const express = require('express');
const { authenticateJWT } = require('../utilities/authentication');
const usersController = require('../controllers/users');
const utilities = require('../utilities/index');
const usersValidate = require('../utilities/users-validation');

const router = express.Router();

// Return all users
router.get('/', authenticateJWT, utilities.handleErrors(usersController.getAllUsers));

// Update user info (only accessible by the user or admin)
router.put(
  '/:id',
  authenticateJWT,
  usersValidate.idRules(),
  usersValidate.checkId,
  usersValidate.userRules(),
  usersValidate.checkUser,
  utilities.handleErrors(usersController.updateSingleUser)
);

module.exports = router;
