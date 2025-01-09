const express = require("express");
const router = express.Router();
const Team = require("../controllers/TeamController"); // Import the team controller
const teamValidationRules = require("../middleware/validations/team");
const { returnValidation } = require("../middleware/validations");
const upload = require("../config/multerConfig");
const isAdmin = require("../middleware/auth/isAdmin");

// CREATE - Add a new team
router.post("/", upload, teamValidationRules, returnValidation, Team.create);

// READ - Get all teams
router.get("/", Team.getAll);

// READ - Get a single team by ID
router.get("/:id", Team.getById);

// UPDATE (PUT) - Update an entire team by ID
router.put("/:id", upload, teamValidationRules, returnValidation, Team.update);

// PARTIAL UPDATE (PATCH) - Partially update a team by ID
router.patch(
  "/:id",
  isAdmin,
  upload,
  teamValidationRules,
  returnValidation,
  Team.partialUpdate
);

// DELETE - Remove a team by ID
router.delete("/:id", Team.delete);

module.exports = router;
