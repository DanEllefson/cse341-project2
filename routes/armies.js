'use strict';

// Import the required modules
const express = require('express');
const armiesController = require('../controllers/armies');
const armiesValidate = require('../utilities/armies-validation');
const utilities = require('../utilities/index');

// Create a new router
const router = express.Router();

// Return all armies
router.get('/', utilities.handleErrors(armiesController.getAll));

// Return a single army
router.get(
  '/:id',
  armiesValidate.idRules(),
  armiesValidate.checkId,
  utilities.handleErrors(armiesController.getSingle)
);

// Delete a single army
router.delete(
  '/:id',
  armiesValidate.idRules(),
  armiesValidate.checkId,
  utilities.handleErrors(armiesController.deleteSingle)
);

// Create a new army
router.post(
  '/',
  armiesValidate.armyRules(),
  armiesValidate.checkArmy,
  utilities.handleErrors(armiesController.createSingle)
);

// Update a single army
router.put(
  '/:id',
  armiesValidate.idRules(),
  armiesValidate.checkId,
  armiesValidate.armyRules(),
  armiesValidate.checkArmy,
  utilities.handleErrors(armiesController.updateSingle)
);

module.exports = router;
