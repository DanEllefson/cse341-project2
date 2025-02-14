'use strict';

const { body, param, validationResult } = require('express-validator');
const generalsValidate = {};

/*************************************
 *  MongoId validation rules
 *************************************/
generalsValidate.idRules = () => {
  return [param('id').isMongoId().withMessage('Invalid ID')];
};

/*************************************
 *  Check MongoId validation
 *************************************/
generalsValidate.checkId = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};

/*************************************
 *  General validation rules
 *************************************/
generalsValidate.generalRules = () => {
  return [
    body('name')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a general name.'),

    body('background')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a background for the general.'),

    body('symbol').isURL().notEmpty().withMessage('Please provide an image URL.')
  ];
};

/*************************************
 *  General validation check
 *************************************/
generalsValidate.checkGeneral = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};

module.exports = generalsValidate;
