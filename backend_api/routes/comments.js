const express = require("express");
const router = express.Router();
const Comment = require("../controllers/CommentController"); // Import the Blog controller

// CREATE - Add a new comment
router.post("/", Comment.create);

// READ - Get all comments
router.get("/", Comment.getAll);

// READ - Get a single comment by ID
router.get("/:id", Comment.getById);

// UPDATE (PUT) - Update an entire comment by ID
router.put("/:id", Comment.update);

// PARTIAL UPDATE (PATCH) - Partially update a comment by ID
router.patch("/:id", Comment.partialUpdate);

// DELETE - Remove a comment by ID
router.delete("/:id", Comment.delete);

module.exports = router;
