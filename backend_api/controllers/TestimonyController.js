const fs = require("fs");
const path = require("path");
const Testimony = require("../database/models/Testimony");

// CREATE - Add a new Testimony (with image upload)
const create = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.files["files"] || req.files["files"].length === 0) {
      return res.status(400).json({ msg: "No media files uploaded." });
    }

    // let imagePath = req.files ? `images/${req.files.filename}` : null;

    let imagePath = req.files["files"][0].path.replace(/^public[\\/]/, ""); // Remove 'public/' from the file path

    const testimonyData = {
      ...req.body,
      image: imagePath, // Store image path in the database
    };

    const testimony = await Testimony.create(testimonyData);
    res.status(201).json({
      ...testimony.dataValues,
      msg: `${testimony.name} created successfully`,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ - Get all Testimonys
const getAll = async (req, res) => {
  try {
    const testimony = await Testimony.findAll();
    res.status(200).json(testimony);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Get a single Testimony by ID
const getById = async (req, res) => {
  try {
    const testimony = await Testimony.findByPk(req.params.id);
    if (!testimony) {
      return res.status(404).json({ message: "Testimony not found" });
    }
    res.status(200).json(testimony);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE (PUT) - Update an entire Testimony by ID with image upload
const update = async (req, res) => {
  try {
    const testimony = await Testimony.findByPk(req.params.id);

    if (!testimony) {
      return res.status(404).json({ message: "Testimony not found" });
    }

    let imagePath = testimony.image; // Keep the current image by default

    if (req.files["files"] && req.files["files"].length > 0) {
      // Get the new image path
      const newImagePath = req.files["files"][0].path.replace(
        /^public[\\/]/,
        ""
      );

      // If the testimony already has an image, delete the old one
      const OldPath = path.join(__dirname, "..", "public", testimony.image); // Get absolute path

      if (fs.existsSync(OldPath)) {
        fs.unlinkSync(OldPath); // Delete the old image
      }

      imagePath = newImagePath; // Set new image path
    }

    const updatedTestimonyData = {
      ...req.body,
      image: imagePath, // Update image if a new one was uploaded
      msg: `${testimony.name} was updated successfully `,
      id: testimony.id,
    };

    await testimony.update(updatedTestimonyData);

    res.status(200).json(updatedTestimonyData);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PARTIAL UPDATE (PATCH) - Partially update a Testimony by ID
const partialUpdate = async (req, res) => {
  try {
    const Testimony = await Testimony.findByPk(req.params.id);
    if (!Testimony) {
      return res.status(404).json({ message: "Testimony not found" });
    }
    await Testimony.update(req.body);
    res.status(200).json(Testimony);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE - Remove a Testimony by ID and delete the image from filesystem
const deleteTestimony = async (req, res) => {
  try {
    const testimony = await Testimony.findByPk(req.params.id);
    if (!testimony) {
      return res.status(404).json({ message: "Testimony not found" });
    }

    // If the testimony has an image, delete it from the filesystem
    if (testimony.image) {
      // If the testimony already has an image, delete the old one
      const OldPath = path.join(__dirname, "..", "public", testimony.image); // Get absolute path

      if (fs.existsSync(OldPath)) {
        fs.unlinkSync(OldPath); // Delete the old image
      }
    }
    const deletedTestimony = testimony;

    // Delete the testimony record from the database
    await testimony.destroy();
    res
      .status(204)
      .json({ msg: `${deletedTestimony.name} was deleted successfully ` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  create,
  getAll,
  getById,
  update,
  partialUpdate,
  delete: deleteTestimony,
};
