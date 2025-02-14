'use strict';

const express = require('express');
const router = express.Router();
const swaggerDocs = require('./swagger');
const armiesRoutes = require('./armies');
const generalsRoutes = require('./generals');
const utilities = require('../utilities/index');

// Mount the Swagger routes to serve the API documentation
router.use('/', utilities.handleErrors(swaggerDocs));

// Mount a sub-router to handle all routes under /armies
router.use('/armies', utilities.handleErrors(armiesRoutes));

// Mount a sub-router to handle all routes under /generals
router.use('/generals', utilities.handleErrors(generalsRoutes));

module.exports = router;
