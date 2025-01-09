const Url = require("../database/models/Url"); // Adjust the path based on your directory structure
const fs = require("fs");
const path = require("path");

// CREATE - Add a new URL
exports.create = async (req, res) => {
  try {
    let imagePath = null;

    let checker = req.files["files"] || req.body.icon;

    if (!checker) {
      return res.status(400).json({ msg: "must include either icon or image" });
    }
    // Check if file was uploaded
    if (req.files["files"] && req.files["files"]?.length > 0) {
      imagePath = req.files["files"][0].path.replace(/^public[\\/]/, "");
    }

    // let imagePath = req.files ? `images/${req.files.filename}` : null;

    const urlData = {
      ...req.body,
      image: imagePath, // Store image path in the database
    };

    const url = await Url.create(urlData);
    res
      .status(201)
      .json({ ...url.dataValues, msg: `${url.name} created successfully` });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ - Get all URLs
exports.getAll = async (req, res) => {
  try {
    const urls = await Url.findAll();
    return res.status(200).json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    return res.status(500).json({ error: "Failed to fetch URLs" });
  }
};

// READ - Get a single URL by ID
exports.getById = async (req, res) => {
  try {
    const url = await Url.findByPk(req.params.id);
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    return res.status(200).json(url);
  } catch (error) {
    console.error("Error fetching URL:", error);
    return res.status(500).json({ error: "Failed to fetch URL" });
  }
};

// UPDATE (PUT) - Update an entire URL by ID
exports.update = async (req, res) => {
  try {
    const url = await Url.findByPk(req.params.id);

    if (!url) {
      return res.status(404).json({ message: "url not found" });
    }

    let imagePath = url.image; // Keep the current image by default

    if (req.files["files"] && req.files["files"].length > 0) {
      // Get the new image path
      const newImagePath = req.files["files"][0].path.replace(
        /^public[\\/]/,
        ""
      );

      // If the Url already has an image, delete the old one
      const OldPath = path.join(__dirname, "..", "public", url.image); // Get absolute path

      if (fs.existsSync(OldPath)) {
        fs.unlinkSync(OldPath); // Delete the old image
      }

      imagePath = newImagePath; // Set new image path
    }

    const updatedUrlData = {
      ...req.body,
      image: imagePath, // Update image if a new one was uploaded
      msg: `${url.name} was updated successfully `,
    };

    // Update the url with the new data, and specify the `where` condition
    await Url.update(updatedUrlData, {
      where: { id: req.params.id }, // Specify which url to update
    });

    res.status(200).json({ ...updatedUrlData, id: url.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PARTIAL UPDATE (PATCH) - Partially update a URL by ID
exports.partialUpdate = async (req, res) => {
  try {
    const url = await Url.findByPk(req.params.id);
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    await url.update(req.body);
    return res.status(200).json(url);
  } catch (error) {
    console.error("Error partially updating URL:", error);
    return res.status(500).json({ error: "Failed to partially update URL" });
  }
};

// DELETE - Remove a URL by ID
exports.delete = async (req, res) => {
  try {
    const deleted = await Url.destroy({
      where: { id: req.params.id },
    });
    if (deleted) {
      return res
        .status(204)
        .json({ msg: deleted.name + " was deleted successfully" });
    }
    return res.status(404).json({ error: "URL not found" });
  } catch (error) {
    console.error("Error deleting URL:", error);
    return res.status(500).json({ error: "Failed to delete URL" });
  }
};
