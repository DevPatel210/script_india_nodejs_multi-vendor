/* eslint-disable no-prototype-builtins,no-restricted-syntax */
const { validationResult } = require('express-validator');
const responseCode = require('../utils/responseCode');
const flatten = require('flat');

module.exports = rules => [
  rules,
  (req, res, next) => {
    let validationErrors = validationResult(req);
    if (validationErrors.isEmpty()) return next();
    validationErrors = validationErrors.mapped();
    let errors = {};
    for (const key in validationErrors) {
      if (validationErrors.hasOwnProperty(key)) {
        let newKey = key;
        const array = key.split(/(?:\.|\[|\])+/);
        if (array.length > 2) {
          newKey = array.join('.');
        }

        errors[newKey] = validationErrors[key].msg;
      }
    }
    errors = flatten.unflatten(errors, { save: true });
    return res.status(responseCode.badRequest).send({
      status: 'BAD_REQUEST',
      message: 'The request cannot be fulfilled due to bad syntax',
      data: errors,
    });
  },
];