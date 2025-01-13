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
  OfferLetterValidationRules,
} = require("../middleware/validations/extra");
const upload = require("../config/multerConfig");

router.post("/faq", FAQValidationRules, returnValidation, Extra.faq);

router.post(
  "/contact",
  ContactValidationRules,
  returnValidation,
  Extra.contact
);

router.post(
  "/offer_letter",
  upload,
  (req, res, next) => {
    console.log(req.body);
    next();
  },
  OfferLetterValidationRules,
  returnValidation,
  Extra.offer_letter
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
