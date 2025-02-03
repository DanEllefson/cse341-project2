'use strict';

/**
 * @file server.js
 * @description This file sets up and runs the Express server, connects to MongoDB, and handles graceful shutdown.
 * @module server
 */

require('dotenv').config(); // This must load before other modules
const express = require('express');
const cors = require('cors');
const mongodb = require('./db/connect');

// Ensure all Mongoose schemas are registered
require('./models/army.model');
require('./models/general.model');
require('./models/wave.model');

const app = express();
const port = process.env.PORT || 8080;

/**
 * @function setupCors
 * @description Mount the CORS middleware to allow requests from any origin
 */
app.use(cors());

/**
 * @function setupBodyParser
 * @description Mount the body parsing middleware
 */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * @function setupHeaders
 * @description Set headers to allow all origins for all incoming requests
 * @param {Object} _req - The request object
 * @param {Object} res - The response object
 * @param {Function} next - The next middleware function
 */
app.use('/', (_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

/**
 * @function setupRoutes
 * @description All incoming requests are passed through the routes/index.js file
 */
app.use('/', require('./routes'));

/**
 * @function startServer
 * @description Starts the server and connects to MongoDB
 * @param {Object} _req - The request object
 * @param {Object} _res - The response object
 */
const server = app.listen(port, async (_req, _res) => {
  try {
    await mongodb.connectMongoose();
    console.log(`Server is running on http://localhost:${port}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
});

/**
 * @function handleNodemonRestart
 * @description Graceful shutdown when Nodemon restarts the server
 */
process.once('SIGUSR2', () => {
  console.log('Nodemon restart detected. Closing server...');
  server.close(() => {
    console.log('Server closed. Restarting...');
    process.kill(process.pid, 'SIGUSR2'); // Send SIGUSR2 to restart the process
  });
});

/**
 * @function handleProcessTermination
 * @description Handle termination signals (Ctrl+C or external signals)
 */
process.on('SIGINT', () => {
  console.log('Process terminated. Closing server...');
  server.close(() => {
    console.log('Server closed.');
  });
});

/**
 * @function handleProcessTerminationExternal
 * @description Handle external termination signals
 */
process.on('SIGTERM', () => {
  console.log('Process terminated by external signal. Closing server...');
  server.close(() => {
    console.log('Server closed.');
  });
});
