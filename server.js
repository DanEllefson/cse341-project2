'use strict';

// Import the required modules
require('dotenv').config(); // This must load before other modules
const express = require('express');
const https = require('https');
const fs = require('fs');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const mongodb = require('./db/connect');
const routes = require('./routes/index');
const utilites = require('./utilities/index');

// Initialize Passport and restore authentication state
require('./auth/passportConfig');

// Ensure all Mongoose schemas are registered
require('./models/army.model');
require('./models/general.model');
require('./models/wave.model');
require('./models/glyph.model');
require('./models/user.model');

const app = express();
const port = process.env.PORT || 3000;
const httpsPort = process.env.HTTPS_PORT || 8443;

// Load SSL certificates generated by mkcert
const sslOptions = {
  key: fs.readFileSync('localhost-key.pem'),
  cert: fs.readFileSync('localhost.pem')
};

// Mount CORS middleware
app.use(
  cors({
    origin: [
      'https://localhost:8443',
      'https://localhost:8443/api-docs',
      'http://localhost:8080',
      'https://cse341-project2-t7en.onrender.com'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
  })
);

// Add CORS preflight handling
app.options('*', cors());

// Middleware setup
app.use(express.json({ strict: false }));
app.use(express.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Global response headers
app.use('/', (_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  next();
});

// Routes
app.use('/', utilites.handleErrors(routes));

// Global error handler
app.use((err, req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Start HTTP server
const httpServer = app.listen(port, async () => {
  try {
    await mongodb.connectMongoose();
    console.log(`HTTP server running at http://localhost:${port}`);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
});

// Start HTTPS server
const httpsServer = https.createServer(sslOptions, app);
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS server running at https://localhost:${httpsPort}`);
});

// Graceful shutdown handlers
const shutdown = () => {
  console.log('Shutting down servers...');
  httpServer.close(() => console.log('HTTP server closed.'));
  httpsServer.close(() => console.log('HTTPS server closed.'));
};

process.once('SIGUSR2', () => {
  shutdown();
  process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
