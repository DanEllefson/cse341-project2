'use strict';

const express = require('express');
const { authenticateJWT, authorizeRoles } = require('../utilities/authentication');
const usersController = require('../controllers/users');
const utilities = require('../utilities/index');
const usersValidate = require('../utilities/users-validation');

const router = express.Router();

// Return all users (must be logged in to access)
router.get('/getall', authenticateJWT, utilities.handleErrors(usersController.getAllUsers));

// Return a single user (must be logged in to access)
router.get(
  '/:id',
  authenticateJWT,
  usersValidate.idRules(),
  usersValidate.checkId,
  utilities.handleErrors(usersController.getSingleUser)
);

// Delete a single user (only accessible by the user or admin)
router.delete(
  '/:id',
  authenticateJWT,
  usersValidate.idRules(),
  usersValidate.checkId,
  utilities.handleErrors(usersController.deleteSingleUser)
);

// Update user info (only accessible by the user or admin)
router.put(
  '/update/:id',
  authenticateJWT,
  usersValidate.idRules(),
  usersValidate.checkId,
  usersValidate.userRules(),
  usersValidate.checkUser,
  utilities.handleErrors(usersController.updateSingleUser)
);

// Logout route
router.get('/logout', utilities.handleErrors(usersController.userLogout));

module.exports = router;
