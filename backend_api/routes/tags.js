const express = require("express");
const router = express.Router();
const Tags = require("../controllers/TagController"); // Import the Blog controller
const { returnValidation } = require("../middleware/validations");
const isAdmin = require("../middleware/auth/isAdmin");
const { TagValidationRules } = require("../middleware/validations/tag");
// CREATE - Add a new blog
router.post("/", TagValidationRules, returnValidation, Tags.create);

// READ - Get all blogs
router.get("/", Tags.getAll);

// // READ - Get a single blog by ID
router.get("/:id", Tags.getById);

// // UPDATE (PUT) - Update an entire blog by ID
router.put("/:id", TagValidationRules, returnValidation, Tags.update);

// // PARTIAL UPDATE (PATCH) - Partially update a blog by ID
router.patch(
  "/:id",
  isAdmin,
  TagValidationRules,
  returnValidation,
  Tags.partialUpdate
);

// // DELETE - Remove a blog by ID
router.delete("/:id", Tags.delete);

module.exports = router;
