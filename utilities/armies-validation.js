'use strict';

const { body, validationResult } = require('express-validator');
const armiesValidate = {};

/*************************************
 *  MongoId validation rules
 *************************************/
armiesValidate.idRules = () => {
  return [body('id').isMongoId().withMessage('Invalid ID')];
};

/*************************************
 *  Check MongoId validation
 *************************************/
armiesValidate.checkId = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};

/*************************************
 *  Army validation rules
 *************************************/
armiesValidate.armyRules = () => {
  return [
    body('name')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide an army name.'),

    body('type')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide an army type.'),

    body('general').isMongoId().withMessage('Invalid ID'),

    body('attack').isInt({ min: 0 }).withMessage('Attack must be a positive number.'),

    body('defense').isInt({ min: 0 }).withMessage('Defense must be a positive number.'),

    body('move').isInt({ min: 0 }).withMessage('Move must be a positive number.'),

    body('range').isInt({ min: 0 }).withMessage('Range must be a positive number.'),

    body('life').isInt({ min: 0 }).withMessage('Life must be a positive number.'),

    body('cost').isInt({ min: 0 }).withMessage('Cost must be a positive number.'),

    body('specialPowers')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide a description of the special powers.'),

    body('class')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide an army class.'),

    body('species')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide an army species.'),

    body('personality')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide an army personality.'),

    body('size')
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage('Please provide an army size.'),

    body('height').isInt({ min: 1 }).withMessage('Height must be 1 or greater.'),

    body('url').isURL().notEmpty().withMessage('Please provide an image URL.'),

    body('wave').isMongoId().withMessage('Invalid ID')
  ];
};

/*************************************
 *  Army validation check
 *************************************/
armiesValidate.checkArmy = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }
  return res.status(400).json({ errors: errors.array() });
};

module.exports = armiesValidate;
