const fs = require("fs");
const path = require("path");
const Partners = require("../database/models/Partner");

// CREATE - Add a new Partners (with image upload)
const create = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.files["files"] || req.files["files"].length === 0) {
      return res.status(400).json({ msg: "No media files uploaded." });
    }

    // let imagePath = req.files ? `images/${req.files.filename}` : null;

    let imagePath = req.files["files"][0].path.replace(/^public[\\/]/, ""); // Remove 'public/' from the file path

    const partnerData = {
      ...req.body,
      image: imagePath, // Store image path in the database
    };

    const partner = await Partners.create(partnerData);
    res.status(201).json({
      ...partner.dataValues,
      msg: `${partner.name} created successfully`,
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// READ - Get all Testimonys
const getAll = async (req, res) => {
  try {
    const partners = await Partners.findAll();
    res.status(200).json(partners);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// READ - Get a single Partners by ID
const getById = async (req, res) => {
  try {
    const partner = await Partners.findByPk(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: "Partners not found" });
    }
    res.status(200).json(partner);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// UPDATE (PUT) - Update an entire Partners by ID with image upload
const update = async (req, res) => {
  try {
    const partner = await Partners.findByPk(req.params.id);

    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    let imagePath = partner.image; // Keep the current image by default

    if (req.files["files"] && req.files["files"].length > 0) {
      // Get the new image path
      const newImagePath = req.files["files"][0].path.replace(
        /^public[\\/]/,
        ""
      );

      // If the Partners already has an image, delete the old one
      const OldPath = path.join(__dirname, "..", "public", partner.image); // Get absolute path

      if (fs.existsSync(OldPath)) {
        fs.unlinkSync(OldPath); // Delete the old image
      }

      imagePath = newImagePath; // Set new image path
    }

    const updatedPartnerData = {
      ...req.body,
      image: imagePath, // Update image if a new one was uploaded
      msg: `${partner.name} was updated successfully `,
    };

    // Update the partner with the new data, and specify the `where` condition
    await Partners.update(updatedPartnerData, {
      where: { id: parseInt(req.params.id) }, // Specify which partner to update
    });

    res.status(200).json({ ...updatedPartnerData, id: partner.id });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PARTIAL UPDATE (PATCH) - Partially update a Partners by ID
const partialUpdate = async (req, res) => {
  try {
    const Partners = await Partners.findByPk(req.params.id);
    if (!Partners) {
      return res.status(404).json({ message: "Partners not found" });
    }
    await Partners.update(req.body);
    res.status(200).json(Partners);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE - Remove a Partners by ID and delete the image from filesystem
const deletePartner = async (req, res) => {
  try {
    const partner = await Partners.findByPk(req.params.id);
    if (!partner) {
      return res.status(404).json({ message: "Partner not found" });
    }

    // If the Partners has an image, delete it from the filesystem
    if (partner.image) {
      // If the Partners already has an image, delete the old one
      const OldPath = path.join(__dirname, "..", "public", partner.image); // Get absolute path

      if (fs.existsSync(OldPath)) {
        fs.unlinkSync(OldPath); // Delete the old image
      }
    }
    const deletedPartners = partner;

    // Delete the Partners record from the database
    await partner.destroy();
    res
      .status(204)
      .json({ msg: `${deletedPartners.name} was deleted successfully ` });
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
  delete: deletePartner,
};
