const express = require("express");
const router = express.Router();
const Extra = require("../controllers/ExtraController"); // Import the Blog controller
const {
  returnValidation,
  validateEmail,
} = require("../middleware/validations");
const isAdmin = require("../middleware/auth/isAdmin");
const {
  FAQValidationRules,
  ContactValidationRules,
  AppointmentValidationRules,
} = require("../middleware/validations/extra");
const Appointment = require("../database/models/Appointment");

router.post("/faq", FAQValidationRules, returnValidation, Extra.faq);

router.post(
  "/contact",
  ContactValidationRules,
  returnValidation,
  Extra.contact
);

router.post(
  "/appointment",
  AppointmentValidationRules,
  returnValidation,
  Extra.appointment
);

router.post(
  "/newsletter",
  (req, res, next) => {
    console.log(req.body);
    next();
  },
  validateEmail,
  returnValidation,
  Extra.newsletter
);

module.exports = router;
