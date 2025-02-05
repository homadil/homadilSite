const { check } = require("express-validator");

exports.projectValidationRules = [
  check("plot")
    .notEmpty()
    .withMessage("Plot is required.")
    .isString()
    .withMessage("Plot must be a string."),
  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),
  check("content")
    .optional()
    .isString()
    .withMessage("Content must be a string."),
  check("start_date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Start date must be a valid date."),
  check("end_date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("End date must be a valid date."),
  check("client")
    .optional()
    .isString()
    .withMessage("Client name must be a string."),
  check("director")
    .optional()
    .isString()
    .withMessage("Director name must be a string."),
  check("location_id").optional(),
  check("estate").notEmpty().withMessage("Estate is Required"),
  check("budget")
    .optional()
    .isDecimal()
    .withMessage("Budget must be a decimal value."),
];
