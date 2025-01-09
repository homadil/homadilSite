const express = require("express");
const router = express.Router();
const Project = require("../controllers/ProjectController"); // Import the Blog controller
const { projectValidationRules } = require("../middleware/validations/project");
const { returnValidation } = require("../middleware/validations");
const isAdmin = require("../middleware/auth/isAdmin");
const upload = require("../config/multerConfig");
const validateComment = require("../middleware/validations/validateComment");

// CREATE - Add a new blog
router.post(
  "/",
  upload,
  projectValidationRules,
  returnValidation,
  Project.create
);

// READ - Get all blogs
router.get("/", Project.getAll);

// READ - Get a single blog by ID
router.get("/:id", Project.getById);

// UPDATE (PUT) - Update an entire blog by ID
router.put(
  "/:id",
  upload,
  projectValidationRules,
  returnValidation,
  Project.update
);

// PARTIAL UPDATE (PATCH) - Partially update a blog by ID
router.patch("/:id", Project.partialUpdate);

// DELETE - Remove a blog by ID
router.delete("/:id", Project.delete);

router.post(
  "/:id/comments",
  validateComment,
  returnValidation,
  Project.saveCommentForProject
);
module.exports = router;
