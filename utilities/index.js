'use strict';

const Util = {};

// Middleware For Handling Errors
Util.handleErrors = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = Util;
