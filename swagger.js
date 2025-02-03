'use strict';

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

// Define the Swagger JSDoc options
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'HeroScape API',
      description: 'This API manages a database of HeroScape figures and their associated data.'
    },
    servers: [
      {
        url: 'http://localhost:8080'
      }
    ]
  },
  // Path to the API docs
  apis: ['./controllers/*.js'] // You can update this path to match where your API routes and controller are defined
};

// Initialize swagger-jsdoc
const swaggerSpec = swaggerJSDoc(options);

// Create a route to serve the Swagger UI
const swaggerDocs = (app) => {
  // Serve the Swagger UI
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};

module.exports = swaggerDocs;
