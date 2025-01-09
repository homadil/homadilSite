const express = require("express");
const router = express.Router();
const Blogs = require("../controllers/BlogController"); // Import the Blog controller
const { returnValidation } = require("../middleware/validations");
const isAuth = require("../middleware/auth/isAuth");
const isAdmin = require("../middleware/auth/isAdmin");
const { blogValidationRules } = require("../middleware/validations/blog");
const upload = require("../config/multerConfig");
const validateComment = require("../middleware/validations/validateComment");

// CREATE - Add a new blog
router.post(
  "/",
  isAuth,
  upload,
  blogValidationRules,
  returnValidation,
  Blogs.create
);

// READ - Get all blogs
router.get("/", Blogs.getAll);

// READ - Get a single blog by ID
router.get("/:id", Blogs.getById);

// UPDATE (PUT) - Update an entire blog by ID
router.put(
  "/:id",
  isAuth,
  upload,
  blogValidationRules,
  returnValidation,
  Blogs.update
);

// PARTIAL UPDATE (PATCH) - Partially update a blog by ID
router.patch(
  "/:id",
  isAdmin,
  blogValidationRules,
  returnValidation,
  Blogs.partialUpdate
);

// DELETE - Remove a blog by ID
router.delete("/:id", Blogs.delete);

router.post(
  "/:id/comments",
  validateComment,
  returnValidation,
  Blogs.saveCommentForBlog
);

module.exports = router;
