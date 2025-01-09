const { check } = require("express-validator");

exports.EstateValidationRules = [
  check("name")
    .notEmpty()
    .withMessage("Name is required.")
    .isString()
    .withMessage("Name must be a string."),
  check("director")
    .optional()
    .isString()
    .withMessage("Director must be a string."),
  check("estimate")
    .optional()
    .isString()
    .withMessage("Estimate must be a numeric value."),
  check("area").optional().isString().withMessage("Area must be a string."),
  check("amenities")
    .optional()
    .isString() // Ensures amenities is an array
    .withMessage("Amenities must be a valid array."),
  check("nearbyLocations")
    .optional()
    .isString() // Ensures nearbyLocations is an array
    .withMessage("Nearby Locations must be a valid array."),
  check("description")
    .optional()
    .isString()
    .withMessage("Description must be a string."),
  check("status")
    .notEmpty()
    .withMessage("Status is required.")
    .isIn(["pending", "approved", "completed"]) // Ensures status is one of the allowed options
    .withMessage("Status must be one of: pending, approved, or completed."),
  check("price_range")
    .optional()
    .isString()
    .withMessage("Price range must be a string."),
  check("show").optional().isString().withMessage("Show must be a string."),
  check("number_of_units")
    .optional()
    .isInt()
    .withMessage("Number of units must be an integer."),
];
