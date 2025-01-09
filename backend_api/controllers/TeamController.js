const fs = require("fs");
const path = require("path");
const Teams = require("../database/models/Team");
const Url = require("../database/models/Url");

// CREATE - Add a new Teams (with image upload)
const create = async (req, res) => {
  const transaction = await Teams.sequelize.transaction(); // Start transaction
  try {
    // Check if file was uploaded
    if (!req.files || !req.files["files"] || req.files["files"].length === 0) {
      return res.status(400).json({ msg: "No media files uploaded." });
    }

    // Remove 'public/' from the file path and store the correct path
    let imagePath = req.files["files"][0].path.replace(/^public[\\/]/, "");

    // Prepare team data
    const teamData = {
      ...req.body,
      image: imagePath, // Store image path in the database
    };

    // Create team entry
    const team = await Teams.create(teamData, { transaction });

    // Handle URLs
    if (req.body.urls) {
      let urlArray = Array.isArray(req.body.urls)
        ? req.body.urls
        : [req.body.urls]; // Normalize URLs to an array if a single URL is provided

      const selectedUrls = await Url.findAll({
        where: {
          id: urlArray,
        },
        transaction,
      });

      // Associate URLs with the team
      await team.addUrls(selectedUrls, { transaction });
    }

    // Commit transaction if all operations succeed
    await transaction.commit();

    // Respond with success
    res
      .status(201)
      .json({ ...team.dataValues, msg: `${team.name} created successfully` });
  } catch (error) {
    await transaction.rollback(); // Rollback transaction on error
    res.status(400).json({ error: error.message });
  }
};

// READ - Get all Testimonys
const getAll = async (req, res) => {
  try {
    const teams = await Teams.findAll({
      include: [{ model: Url, through: { attributes: [] } }],
    });
    res.status(200).json(teams);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Get a single Teams by ID
const getById = async (req, res) => {
  try {
    const team = await Teams.findByPk(req.params.id);
    if (!team) {
      return res.status(404).json({ message: "Teams not found" });
    }
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const update = async (req, res) => {
  const transaction = await Teams.sequelize.transaction(); // Start transaction
  try {
    const team = await Teams.findByPk(req.params.id);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    let imagePath = team.image; // Keep the current image by default

    if (req.files["files"] && req.files["files"].length > 0) {
      // Get the new image path
      const newImagePath = req.files["files"][0].path.replace(
        /^public[\\/]/,
        ""
      );

      // If the team already has an image, delete the old one
      const OldPath = path.join(__dirname, "..", "public", team.image); // Get absolute path

      if (fs.existsSync(OldPath)) {
        fs.unlinkSync(OldPath); // Delete the old image
      }

      imagePath = newImagePath; // Set new image path
    }

    const updatedTeamData = {
      ...req.body,
      image: imagePath, // Update image if a new one was uploaded
    };

    // Update the team with the new data
    await team.update(updatedTeamData, { transaction });

    // Handle URLs
    if (req.body.urls) {
      let urlArray = Array.isArray(req.body.urls)
        ? req.body.urls
        : [req.body.urls]; // Normalize URLs to an array if a single URL is provided

      // Update the URLs
      if (urlArray && urlArray.length > 0) {
        const parsedUrls = urlArray.map((url) => JSON.parse(url));
        const urlIds = parsedUrls.map((url) => url.id);

        // Find the URLs that are associated with the team
        const urls = await Url.findAll({
          where: {
            id: urlIds,
          },
          transaction,
        });
        // Update the relationship (remove old URLs and add new ones)
        await team.setUrls(urls, { transaction }); // Replaces old associations with new ones
      }
    }

    await transaction.commit(); // Commit the transaction

    res.status(200).json({
      ...updatedTeamData,
      id: team.id,
      msg: `${team.name} was updated successfully`,
    });
  } catch (error) {
    await transaction.rollback(); // Rollback the transaction in case of error
    res.status(400).json({ error: error.message });
  }
};

// PARTIAL UPDATE (PATCH) - Partially update a Teams by ID
const partialUpdate = async (req, res) => {
  try {
    const Teams = await Teams.findByPk(req.params.id);
    if (!Teams) {
      return res.status(404).json({ message: "Teams not found" });
    }
    await Teams.update(req.body);
    res.status(200).json(Teams);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE - Remove a Teams by ID and delete the image from filesystem
const deleteTeam = async (req, res) => {
  try {
    const teams = await Teams.findByPk(req.params.id);
    if (!teams) {
      return res.status(404).json({ message: "Teams not found" });
    }

    // If the Teams has an image, delete it from the filesystem
    if (teams.image) {
      // If the Teams already has an image, delete the old one
      const OldPath = path.join(__dirname, "..", "public", teams.image); // Get absolute path

      if (fs.existsSync(OldPath)) {
        fs.unlinkSync(OldPath); // Delete the old image
      }
    }
    const deletedTeam = teams;

    // Delete the Teams record from the database
    await teams.destroy();
    res
      .status(204)
      .json({ msg: `${deletedTeam.name} was deleted successfully ` });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  partialUpdate,
  delete: deleteTeam,
};
