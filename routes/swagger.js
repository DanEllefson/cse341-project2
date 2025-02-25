'use strict';

const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

router.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    oauth: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      scopes: ['profile', 'email'],
      usePkceWithAuthorizationCodeGrant: true
    },
    oauth2RedirectUrl: 'https://localhost:8443/api-docs/oauth2-redirect.html'
  })
);

router.get(
  '/api-docs',
  swaggerUi.setup(swaggerDocument)
  // #swagger.ignore = true
);

module.exports = router;
