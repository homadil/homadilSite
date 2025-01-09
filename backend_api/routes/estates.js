const express = require("express");
const router = express.Router();
const Estate = require("../controllers/EstateController"); // Import the Blog controller
const { EstateValidationRules } = require("../middleware/validations/estate");
const { returnValidation } = require("../middleware/validations");
const isAdmin = require("../middleware/auth/isAdmin");
const upload = require("../config/multerConfig");
const validateComment = require("../middleware/validations/validateComment");

// CREATE - Add a new blog
router.post(
  "/",
  upload,
  EstateValidationRules,
  returnValidation,
  Estate.create
);

// READ - Get all blogs
router.get("/", Estate.getAll);

// READ - Get a single blog by ID
router.get("/:id", Estate.getById);

// UPDATE (PUT) - Update an entire blog by ID
router.put(
  "/:id",
  upload,
  EstateValidationRules,
  returnValidation,
  Estate.update
);

// PARTIAL UPDATE (PATCH) - Partially update a blog by ID
router.patch("/:id", Estate.partialUpdate);

// DELETE - Remove a blog by ID
router.delete("/:id", Estate.delete);

router.post(
  "/:id/comments",
  validateComment,
  returnValidation,
  Estate.saveCommentForEstate
);
module.exports = router;
