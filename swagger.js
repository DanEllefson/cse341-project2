'use strict';

const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    version: '1.0.0',
    title: 'HeroScape API',
    description: 'This API manages a database of HeroScape figures and their associated data.'
  },
  host: 'localhost:8080',
  schemes: ['http'],
  components: {
    schemas: {
      Army: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          type: { type: 'string' },
          general: { type: 'string' },
          attack: { type: 'number' },
          defense: { type: 'number' },
          move: { type: 'number' },
          range: { type: 'number' },
          life: { type: 'number' },
          cost: { type: 'number' },
          specialPowers: { type: 'string' },
          class: { type: 'string' },
          species: { type: 'string' },
          personality: { type: 'string' },
          size: { type: 'string' },
          height: { type: 'number' },
          url: { type: 'string' },
          wave: { type: 'string' }
        }
      }
    }
  }
};

const outputFile = './swagger-output.json';
const routes = ['./routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);
