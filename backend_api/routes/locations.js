const express = require("express");
const router = express.Router();
const Location = require("../controllers/LocationController"); // Import the Blog controller

// CREATE - Add a new blog
router.post("/", Location.createBlog);

// READ - Get all blogs
router.get("/", Location.getAllLocation);

// READ - Get a single blog by ID
router.get("/:id", Location.getBlogById);

// UPDATE (PUT) - Update an entire blog by ID
router.put("/:id", Location.updateBlog);

// PARTIAL UPDATE (PATCH) - Partially update a blog by ID
router.patch("/:id", Location.partialUpdateBlog);

// DELETE - Remove a blog by ID
router.delete("/:id", Location.deleteBlog);

module.exports = router;
