const Estate = require("../database/models/Estate");
const Media = require("../database/models/Media");
const Location = require("../database/models/Location");
const path = require("path");
const Tag = require("../database/models/Tag");
const Category = require("../database/models/Category");
const Url = require("../database/models/Url");
const Comment = require("../database/models/Comment");
const EstateMedia = require("../database/models/EstateMedia");
const Project = require("../database/models/Project");

exports.create = async (req, res) => {
  const transaction = await Estate.sequelize.transaction(); // Start a transaction
  try {
    const data = req.body; // Retrieve data from the request body

    // Step 1: Create or use existing location
    let location;
    if (!Number.isInteger(data.location_id)) {
      location = await Location.create(
        {
          country: data?.country,
          state: data?.state,
          city: data?.city,
          address: data?.address,
        },
        { transaction }
      );
    } else {
      location = await Location.findByPk(data.location_id);
      if (!location) {
        throw new Error("Invalid location_id");
      }
    }

    // Step 2: Create the Estate
    const estate = await Estate.create(
      {
        name: data?.name,
        description: data?.description,
        content: data?.content,
        estimate: data?.estimate,
        area: data?.area,
        price_range: data?.price_range,
        number_of_units: data?.number_of_units,
        location_id: location.id,
        director: data.director,
        code: data.code,
        amenities: data.amenities,
        nearbyLocations: data.nearbyLocations,
        content: data.content,
        status: data.status,
        show: req.files["show"]
          ? req.files["show"][0].path.replace(/^public[\\/]/, "")
          : null, // Assuming 'show' is a file
      },
      { transaction }
    );

    // Step 3: Create media files and associate with Estate
    if (req.files["files"] && req.files["files"].length > 0) {
      const mediaFiles = await Promise.all(
        req.files["files"].map((file) => {
          return Media.create(
            {
              parent_id: estate.id,
              type: "estate",
              path: file.path.replace(/^public[\\/]/, ""),
              exe: file.mimetype.startsWith("video") ? "video" : "image", // File type check
            },
            { transaction }
          );
        })
      );

      // Create EstateMedia records
      await EstateMedia.bulkCreate(
        mediaFiles.map((media) => ({
          estate_id: estate.id,
          media_id: media.id,
        })),
        { transaction }
      );
    }

    // Step 4: Associate categories (EstateCategories)
    if (data.categories) {
      const categories = Array.isArray(data.categories)
        ? data.categories
        : [data.categories];

      const selectedCategories = await Category.findAll({
        where: { id: categories },
        transaction,
      });

      await estate.addCategories(selectedCategories, { transaction });
    }

    // Commit transaction
    await transaction.commit();

    return res.json({ msg: "Estate was created successfully" });
  } catch (error) {
    console.log(error);
    // Rollback transaction on error
    await transaction.rollback();

    return res.status(500).json({ error: "Estate creation failed" });
  }
};

exports.getAll = async (req, res) => {
  try {
    const estate = await Estate.findAll({
      include: [
        {
          model: Location,
          as: "location", // Ensure the alias matches what is defined in your association
        },
        {
          model: Category,
          through: { attributes: [] }, // Include categories via the EstateCategories association
        },
        {
          model: Comment,
          through: { attributes: [] }, // Include URLs via the EstateUrl association
        },
        {
          model: Media,
          through: { attributes: [] }, // Include URLs via the EstateUrl association
        },
      ],
    });
    return res.status(200).json(estate);
  } catch (error) {
    console.error("Error fetching Estates:", error);
    return res.status(500).json({ message: "Error fetching Estates.", error });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the Estate by ID
    const estate = await Estate.findByPk(id);

    if (!estate) {
      return res.status(404).json({ message: "Estate not found." });
    }

    // Fetch all Projects associated with the Estate
    const projects = await Project.findAll({
      where: { estateId: estate.id },
    });

    // Add the projects to the estate object
    const result = {
      ...estate.toJSON(), // Convert the Estate instance to a plain object
      projects, // Attach the fetched projects
    };

    return res.status(200).json(result);
  } catch (error) {
    console.error("Error fetching Estate:", error);
    return res.status(500).json({ message: "Error fetching Estate.", error });
  }
};

exports.update = async (req, res) => {
  const transaction = await Estate.sequelize.transaction(); // Start a transaction

  try {
    const { id } = req.params;
    const data = req.body; // Retrieve data from the request body
    console.log(data);
    // Find the Estate by ID
    const estate = await Estate.findByPk(id);

    // Step 1: Update or use existing location
    let location;
    if (data?.location_id) {
      // Find the existing location
      location = await Location.findByPk(data.location_id);
      if (!location) {
        throw new Error("Invalid location_id");
      }

      // Update the existing location with new data
      await location.update(
        {
          country: data.country || location.country,
          state: data.state || location.state,
          city: data.city || location.city,
          address: data.address || location.address,
        },
        { transaction }
      );
    } else {
      // Create a new location
      location = await Location.create(
        {
          country: data.country,
          state: data.state,
          city: data.city,
          address: data.address,
        },
        { transaction }
      );
    }

    // If req.deletePrevMedia is true, delete all previous media associated with the Estate
    if (req.body.deletePrevMedia) {
      // First, delete the associations in the EstateMedia table
      await EstateMedia.destroy({
        where: { estate_id: estate.id },
        transaction,
      });

      // Then, delete the media entries
      await Media.destroy({
        where: { parent_id: estate.id, type: "estate" },
        transaction,
      });
    }

    // Delete the previous `show` file if a new one is provided
    if (req.files["show"]) {
      const filePath = path.join(__dirname, "public/images", estate.show);

      // Check if the file exists before attempting to delete it
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
          fs.unlink(filePath, (deleteErr) => {
            if (deleteErr) {
              console.error(`Error deleting file: ${filePath}`, deleteErr);
            } else {
              console.log(`Deleted file: ${filePath}`);
            }
          });
        }
      });
    }

    // Step 2: Update Estate details
    await Estate.update(
      {
        name: data?.name,
        description: data?.description,
        content: data?.content,
        estimate: data?.estimate,
        area: data?.area,
        price_range: data?.price_range,
        number_of_units: data?.number_of_units,
        location_id: location.id,
        code: data.code,
        director: data.director,
        amenities: data.amenities,
        nearbyLocations: data.nearbyLocations,
        status: data.status,
        content: data.content,
        show: req.files["show"]
          ? req.files["show"][0].path.replace(/^public[\\/]/, "")
          : estate.show, // If a new show file is provided, replace it
      },
      { where: { id }, transaction }
    );

    // Step 3: Upload new media files if provided
    if (req.files["files"] && req.files["files"].length > 0) {
      const mediaFiles = await Promise.all(
        req.files["files"].map((file) => {
          return Media.create(
            {
              parent_id: estate.id,
              type: "estate",
              path: file.path.replace(/^public[\\/]/, ""),
              exe: file.mimetype.startsWith("video") ? "video" : "image", // File type check
            },
            { transaction }
          );
        })
      );

      // Create EstateMedia records
      await EstateMedia.bulkCreate(
        mediaFiles.map((media) => ({
          estate_id: estate.id,
          media_id: media.id,
        })),
        { transaction }
      );
    }

    // Step 4: Update categories (EstateCategories)
    if (data.categories && data.categories.length > 0) {
      if (!Array.isArray(data.categories)) {
        data.categories = [data.categories];
      }

      const parsedCategories = data.categories.map((category) =>
        parseInt(category)
      );

      const categories = await Category.findAll({
        where: { id: parsedCategories },
        transaction,
      });

      await Estate.setCategories(categories, { transaction }); // Update categories
    }

    // Commit transaction after all updates
    await transaction.commit();

    return res.json({ msg: "Estate updated successfully" });
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    console.error("Error updating Estate:", error);
    return res
      .status(500)
      .json({ error: "Estate update failed", details: error.message });
  }
};

exports.partialUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const Estate = await Estate.findByPk(id);
    if (!Estate) {
      return res.status(404).json({ message: "Estate not found." });
    }
    await Estate.update(req.body);
    return res.status(200).json(Estate);
  } catch (error) {
    console.error("Error partially updating Estate:", error);
    return res
      .status(500)
      .json({ message: "Error partially updating Estate.", error });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const estate = await Estate.findByPk(id);
    if (!estate) {
      return res.status(404).json({ message: "Estate not found." });
    }

    // Delete associated media
    await Media.destroy({
      where: {
        parent_id: id,
        type: "estate", // Assuming EstateId is the foreign key in the Media table
      },
    });

    await estate.destroy();
    return res
      .status(200)
      .json({ msg: "Estate and associated media deleted successfully." });
  } catch (error) {
    console.error("Error deleting Estate:", error);
    return res.status(500).json({ msg: "Error deleting Estate.", error });
  }
};

exports.saveCommentForEstate = async (req, res) => {
  const { id } = req.params; // Extract Estate ID from request parameters
  const { content, author } = req.body; // Extract comment data from request body

  try {
    // Find the Estate by ID
    const estate = await Estate.findByPk(id);

    if (!estate) {
      return res.status(404).json({ message: "Estate not found" });
    }

    // Create a new comment
    const newComment = await Comment.create({
      content,
      author,
      user_id: req.user ? req.user.id : null, // Save user ID if logged in, otherwise null
    });

    // Associate the comment with the Estate
    await estate.addComment(newComment); // This automatically handles the EstateComment table

    return res.status(201).json({
      msg: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ msg: "Failed to add comment", error });
  }
};
