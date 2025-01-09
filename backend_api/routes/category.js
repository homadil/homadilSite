const express = require("express");
const router = express.Router();
const Categories = require("../controllers/CategoryController"); // Import the Blog controller
const { returnValidation } = require("../middleware/validations");
const isAdmin = require("../middleware/auth/isAdmin");
const {
  CategoryValidationRules,
} = require("../middleware/validations/category");
// CREATE - Add a new blog
router.post("/", CategoryValidationRules, returnValidation, Categories.create);

// READ - Get all blogs
router.get("/", Categories.getAll);

// READ - Get a single blog by ID
router.get("/:id", Categories.getById);

// UPDATE (PUT) - Update an entire blog by ID
router.put(
  "/:id",
  CategoryValidationRules,
  returnValidation,
  Categories.update
);

// PARTIAL UPDATE (PATCH) - Partially update a blog by ID
router.patch(
  "/:id",
  isAdmin,
  CategoryValidationRules,
  returnValidation,
  Categories.partialUpdate
);

// DELETE - Remove a blog by ID
router.delete("/:id", Categories.delete);

module.exports = router;
