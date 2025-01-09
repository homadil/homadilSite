const { check } = require("express-validator");

// category validation rules
exports.FAQValidationRules = [
  // name is required for both create and update
  check("email").isEmail().withMessage("Email is required"),
  check("subject").notEmpty().withMessage("Subject is required"),
  check("question").notEmpty().withMessage("Question is required"),
];

exports.ContactValidationRules = [
  // name is required for both create and update
  check("name").notEmpty().withMessage("Name is required"),
  check("email").isEmail().withMessage("Email is required"),
  check("subject").notEmpty().withMessage("Subject is required"),
  check("question").notEmpty().withMessage("Question is required"),
];

exports.AppointmentValidationRules = [
  // Name is required
  check("name").notEmpty().withMessage("Name is required"),

  // Email is required and must be valid
  check("email").isEmail().withMessage("Please enter a valid email address"),

  // Date validation (optional, if it's required)
  check("date").custom((value) => {
    if (!value) {
      throw new Error("Date is required");
    }
    // Check if the date is a valid date (add any specific date format validation if needed)
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date format");
    }
    return true;
  }),
  // Validate phone_number (optional, add length or other validation as required)
  check("phone_number").notEmpty().withMessage("Phone number is required"),

  // Validate the service_type (must not be empty or invalid)
  check("service_type")
    .isArray()
    .withMessage("Service types should be an array"),

  // Validate newsletter (ensure it is a boolean)
  check("newsletter")
    .isBoolean()
    .withMessage("Newsletter flag must be a boolean"),

  // Validate other fields as necessary (jobsite_address, city, etc.)
  check("jobsite_address")
    .notEmpty()
    .withMessage("Jobsite address is required"),
  check("city").notEmpty().withMessage("City is required"),
  check("state").notEmpty().withMessage("State is required"),
];
