const Media = require("../database/models/Media"); // Import the Media model
const path = require("path");
const fs = require("fs");
const Project = require("../database/models/Project");
const Blog = require("../database/models/Blog");

exports.create = async (req, res) => {
  try {
    let { parent_id, type } = req.body; // No need to pass `exe`, it's determined from multer logic
    parent_id = parent_id === "null" ? null : parent_id;
    // Check if files are uploaded
    if (!req.files["files"] || req.files["files"].length === 0) {
      return res.status(400).json({ msg: "No media files uploaded." });
    }

    const mediaEntries = [];

    // Process each file in the files array
    for (const file of req.files["files"]) {
      let filePath = file.path.replace(/^public[\\/]/, ""); // Remove 'public/' from the file path

      // Automatically determine `exe` (file type) based on the file extension
      const ext = file.mimetype.startsWith("image") ? "image" : "video";

      // Create media entry in the database for each file
      const media = await Media.create({
        parent_id,
        type,
        path: filePath,
        exe: ext,
      });

      mediaEntries.push(media);
    }

    return res
      .status(201)
      .json({ msg: "Media created successfully.", media: mediaEntries });
  } catch (error) {
    console.error("Error creating media:", error);
    return res.status(500).json({ msg: "Error creating media.", error });
  }
};

// READ - Get all media
exports.getAll = async (req, res) => {
  try {
    const media = await Media.findAll();

    // Fetch additional data based on the type (either project or blog)
    const mediaWithParentData = await Promise.all(
      media.map(async (item) => {
        let parentData = null;

        if (item.type === "project") {
          parentData = await Project.findOne({ where: { id: item.parent_id } });
        } else if (item.type === "blog") {
          parentData = await Blog.findOne({ where: { id: item.parent_id } });
        }

        return {
          ...item.toJSON(),
          parentData, // Append the parent data (project or blog) to each media item
        };
      })
    );

    return res.status(200).json({ media: mediaWithParentData });
  } catch (error) {
    console.error("Error fetching media:", error);
    return res.status(500).json({ message: "Error fetching media.", error });
  }
};

// READ - Get a single media by ID
exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findByPk(id);

    if (!media) {
      return res.status(404).json({ message: "Media not found." });
    }

    return res.status(200).json({ media });
  } catch (error) {
    console.error("Error fetching media:", error);
    return res.status(500).json({ message: "Error fetching media.", error });
  }
};

//UPDATE
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    let { parent_id, type, files } = req.body; // Get new data from the request
    // Convert 'null' string to actual null value
    parent_id = parent_id === "null" ? null : parent_id;

    // Retrieve the existing media entry from the database
    const media = await Media.findByPk(id);
    if (!media) {
      return res.status(404).json({ msg: "Media not found." });
    }
    const OldPath = path.join(__dirname, "..", "public", media.path); // Get absolute path

    // Delete the old file from the filesystem
    if (fs.existsSync(OldPath)) {
      fs.unlinkSync(OldPath); // Delete the old file
    }

    // If new files are provided, process the first new file
    if (req.files["files"] && req.files["files"].length > 0) {
      const newFile = req.files["files"][0]; // Assuming a single file for simplicity
      const newFilePath = newFile.path.replace(/^public[\\/]/, ""); // Remove 'public/' prefix

      // Determine the file type based on the file extension
      const ext = newFile.mimetype.startsWith("image") ? "image" : "video";

      // Update media path and type with the new file details
      media.path = newFilePath;
      media.exe = ext; // Update exe based on the new file type
    }

    // Update other media fields
    await media.update({
      parent_id,
      type,
      path: media.path,
      exe: media.exe,
    });

    return res.status(200).json({ msg: "Media updated successfully.", media });
  } catch (error) {
    console.error("Error updating media:", error);
    return res.status(500).json({ msg: "Error updating media.", error });
  }
};

exports.partialUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const { parent_id, type } = req.body; // Removed exe, will be determined from the file

    const media = await Media.findByPk(id);
    if (!media) {
      return res.status(404).json({ message: "Media not found." });
    }

    // If a new file is uploaded, replace the old file
    if (req.file) {
      // Determine the file type based on the file mimetype
      const ext = req.file.mimetype.startsWith("image") ? "image" : "video";

      // Create new file path without the 'public/' prefix
      const newFilePath = req.file.path.replace(/^public[\\/]/, "");

      // Delete old file if it exists
      if (fs.existsSync(media.path)) {
        fs.unlinkSync(media.path);
      }

      // Update media path and exe based on the new file
      media.path = newFilePath;
      media.exe = ext; // Update exe based on the new file type
    }

    // Update media fields with partial data, keeping existing values if not provided
    await media.update({
      parent_id: parent_id !== undefined ? parent_id : media.parent_id,
      type: type !== undefined ? type : media.type,
      path: media.path,
      exe: media.exe,
    });

    return res
      .status(200)
      .json({ message: "Media partially updated successfully.", media });
  } catch (error) {
    console.error("Error partially updating media:", error);
    return res
      .status(500)
      .json({ message: "Error partially updating media.", error });
  }
};

// DELETE - Remove a media entry by ID
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const media = await Media.findByPk(id);

    if (!media) {
      return res.status(404).json({ message: "Media not found." });
    }

    if (media.path) {
      const OldPath = path.join(__dirname, "..", "public", media.path); // Get absolute path

      // Delete the old file from the filesystem
      if (fs.existsSync(OldPath)) {
        fs.unlinkSync(OldPath); // Delete the old file
      }
    }

    // Delete the media entry from the database
    await media.destroy();

    return res.status(200).json({ msg: "Media deleted successfully." });
  } catch (error) {
    console.error("Error deleting media:", error);
    return res.status(500).json({ msg: "Error deleting media.", error });
  }
};
