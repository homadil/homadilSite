const express = require("express");
const router = express.Router();
const Testimonies = require("../controllers/TestimonyController.js"); // Import the Blog controller
const { returnValidation } = require("../middleware/validations");
const isAdmin = require("../middleware/auth/isAdmin");
const testimonyValidationRules = require("../middleware/validations/testimony.js");
const upload = require("../config/multerConfig.js");
// CREATE - Add a new blog
router.post(
  "/",
  upload,
  testimonyValidationRules,
  returnValidation,
  Testimonies.create
);

// READ - Get all blogs
router.get("/", Testimonies.getAll);

// READ - Get a single blog by ID
router.get("/:id", Testimonies.getById);

// UPDATE (PUT) - Update an entire blog by ID
router.put(
  "/:id",
  upload,
  testimonyValidationRules,
  returnValidation,
  Testimonies.update
);

// PARTIAL UPDATE (PATCH) - Partially update a blog by ID
router.patch(
  "/:id",
  isAdmin,
  upload,
  testimonyValidationRules,
  returnValidation,
  Testimonies.partialUpdate
);

// DELETE - Remove a blog by ID
router.delete("/:id", Testimonies.delete);

module.exports = router;
