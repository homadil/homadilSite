const express = require("express");
const router = express.Router();
const Notification = require("../controllers/NotificationController"); // Import the Blog controller
const isAuth = require("../middleware/auth/isAuth");
// CREATE - Add a new blog
router.post("/", isAuth, Notification.create);

// READ - Get all blogs
router.get("/", Notification.getAll);

// READ - Get a single blog by ID
router.get("/:id", Notification.getById);

// UPDATE (PUT) - Update an entire blog by ID
router.put("/:id", Notification.update);

// PARTIAL UPDATE (PATCH) - Partially update a blog by ID
router.patch("/:id", Notification.partialUpdate);

// DELETE - Remove a blog by ID
router.delete("/:id", Notification.delete);

router.post("/send", Notification.send);

router.post("/contact_us", Notification.contact_us);

module.exports = router;
