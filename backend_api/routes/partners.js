const express = require("express");
const router = express.Router();
const Partner = require("../controllers/PartnerController"); // Import the Blog controller
const upload = require("../config/multerConfig");
const { returnValidation } = require("../middleware/validations");
const partnerValidationRules = require("../middleware/validations/partner");

// CREATE - Add a new blog
router.post(
  "/",
  upload,
  partnerValidationRules,
  returnValidation,
  Partner.create
);

// READ - Get all blogs
router.get("/", Partner.getAll);

// READ - Get a single blog by ID
router.get("/:id", Partner.getById);

// UPDATE (PUT) - Update an entire blog by ID
router.put(
  "/:id",
  upload,
  partnerValidationRules,
  returnValidation,
  Partner.update
);

// PARTIAL UPDATE (PATCH) - Partially update a blog by ID
router.patch("/:id", Partner.partialUpdate);

// DELETE - Remove a blog by ID
router.delete("/:id", Partner.delete);

module.exports = router;
