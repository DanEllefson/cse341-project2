'use strict';

const express = require('express');
const router = express.Router();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('../swagger-output.json');

// Determine the base URL dynamically based on environment
const isProduction = process.env.NODE_ENV === 'production';
const BASE_URL = isProduction
  ? 'https://cse341-project2-t7en.onrender.com'
  : 'https://localhost:8443';

// Update Swagger OAuth2 security schema with the correct URLs
swaggerDocument.components.securitySchemes.oauth2.flows.authorizationCode.authorizationUrl = `${BASE_URL}/auth/google`;
swaggerDocument.components.securitySchemes.oauth2.flows.authorizationCode.tokenUrl = `${BASE_URL}/auth/google/callback`;

router.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    oauth: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      scopes: ['profile', 'email'],
      usePkceWithAuthorizationCodeGrant: true
    },
    oauth2RedirectUrl: `${BASE_URL}/api-docs/oauth2-redirect.html`
  })
);

module.exports = router;
