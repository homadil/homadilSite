const Project = require("../database/models/Project");
const Media = require("../database/models/Media");
const Location = require("../database/models/Location");
const path = require("path");
const Tag = require("../database/models/Tag");
const Category = require("../database/models/Category");
const Url = require("../database/models/Url");
const Comment = require("../database/models/Comment");
const Estate = require("../database/models/Estate");

exports.create = async (req, res) => {
  const transaction = await Project.sequelize.transaction(); // Start a transaction
  try {
    const data = req.body; // Retrieve data from the request body

    // Step 0: Validate or fetch Estate
    let estate;

    console.log(data.estate);
    if (data.estate) {
      estate = await Estate.findByPk(data.estate); // Validate estate exists
      if (!estate) {
        throw new Error("Invalid estate ID");
      }
    } else {
      throw new Error("Estate ID is required");
    }

    // Step 1: Create or use existing location
    let location;
    if (data.location_id !== null) {
      location = await Location.create(
        {
          country: data.country,
          state: data.state,
          city: data.city,
          address: data.address,
        },
        { transaction }
      );
    } else {
      location = await Location.findByPk(data.location_id);
      if (!location) {
        throw new Error("Invalid location_id");
      }
    }

    // Step 2: Create the project
    const project = await Project.create(
      {
        plot: data.plot,
        description: data.description,
        content: data.content,
        start_date: data.start_date,
        end_date: data.end_date,
        client: data.client,
        director: data.director,
        location_id: location.id,
        budget: data.budget,
        room_count: data.room_count,
        status: data.status,
        estateId: estate.id,
        show: req.files["show"]
          ? req.files["show"][0].path.replace(/^public[\\/]/, "")
          : null, // Assuming 'show' is a file
      },
      { transaction }
    );

    // Step 3: Associate media files (ProjectMedia)
    if (req.files["files"] && req.files["files"].length > 0) {
      const mediaPromises = req.files["files"].map((file) => {
        return Media.create(
          {
            parent_id: project.id,
            type: "project",
            path: file.path.replace(/^public[\\/]/, ""),
            exe: file.mimetype.startsWith("video") ? "video" : "image", // File type check
          },
          { transaction }
        );
      });
      const mediaFiles = await Promise.all(mediaPromises);
      await project.addMedia(mediaFiles, { transaction });
    }

    // Step 4: Associate categories (ProjectCategories)
    if (data.categories) {
      const categories = Array.isArray(data.categories)
        ? data.categories
        : [data.categories];

      const selectedCategories = await Category.findAll({
        where: { id: categories },
        transaction,
      });

      await project.addCategories(selectedCategories, { transaction });
    }

    // Step 5: Associate tags (ProjectTags)
    if (data.tags) {
      const tags = Array.isArray(data.tags) ? data.tags : [data.tags];

      const selectedTags = await Tag.findAll({
        where: { id: tags },
        transaction,
      });

      await project.addTags(selectedTags, { transaction });
    }

    // Step 6: Associate URLs (ProjectUrl)
    if (data.urls) {
      const urls = Array.isArray(data.urls) ? data.urls : [data.urls];

      const selectedUrls = await Url.findAll({
        where: {
          id: urls,
        },
        transaction,
      });

      await project.addUrls(selectedUrls, { transaction });
    }

    // Commit transaction
    await transaction.commit();

    return res.json({ msg: "Project was created successfully" });
  } catch (error) {
    console.log(error);
    // Rollback transaction on error
    await transaction.rollback();
    return res.status(500).json({ error: "Project creation failed" });
  }
};

exports.getAll = async (req, res) => {
  try {
    // Fetch all projects
    const projects = await Project.findAll({
      include: [
        {
          model: Location,
          as: "location", // Ensure the alias matches what is defined in your association
        },
        {
          model: Category,
          through: { attributes: [] }, // Include categories via the ProjectCategories association
        },
        {
          model: Tag,
          through: { attributes: [] }, // Include tags via the ProjectTag association
        },
        {
          model: Url,
          through: { attributes: [] }, // Include URLs via the ProjectUrl association
        },
        {
          model: Comment,
          through: { attributes: [] }, // Include comments via the ProjectComment association
        },
        {
          model: Media,
        },
      ],
    });

    // Fetch Estate details for each project
    const projectsWithEstate = await Promise.all(
      projects.map(async (project) => {
        if (project.estateId) {
          const estate = await Estate.findOne({
            where: { id: project.estateId },
          });
          return { ...project.toJSON(), estate };
        }
        return project.toJSON(); // If no estateId, just return the project data
      })
    );

    return res.status(200).json(projectsWithEstate);
  } catch (error) {
    console.error("Error fetching projects:", error);
    return res.status(500).json({ message: "Error fetching projects.", error });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    return res.status(200).json(project);
  } catch (error) {
    console.error("Error fetching project:", error);
    return res.status(500).json({ message: "Error fetching project.", error });
  }
};

exports.update = async (req, res) => {
  const transaction = await Project.sequelize.transaction(); // Start a transaction

  try {
    const { id } = req.params;
    const data = req.body; // Retrieve data from the request body

    // Find the project by ID
    const project = await Project.findByPk(id);
    if (!project) {
      throw new Error("Project not found");
    }

    // Step 1: Validate or fetch Estate
    let estate;
    if (data.estate) {
      estate = await Estate.findByPk(data.estate); // Validate estate exists
      if (!estate) {
        throw new Error("Invalid estate ID");
      }
    } else {
      throw new Error("Estate ID is required");
    }

    // Step 1: Update or use existing location
    let location;
    if (data.location_id) {
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

    // If req.deletePrevMedia is true, delete all previous media associated with the project
    if (req.body.deletePrevMedia) {
      await Media.destroy({
        where: { parent_id: project.id, type: "project" },
        transaction,
      });
    }

    //delete blog.show if it exists
    if (req.files["show"]) {
      const filePath = path.join(__dirname, "public/images", blog.show);

      // Check if the file exists before attempting to delete it
      fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
          // File exists, delete it
          fs.unlink(filePath, (deleteErr) => {
            if (deleteErr) {
              console.error(`Error deleting file: ${filePath}`, deleteErr);
            } else {
              console.log(`Deleted file: ${filePath}`);
            }
          });
        } else {
          console.error(`File not found: ${filePath}`);
        }
      });
    }

    // Step 2: Update project details
    await project.update(
      {
        plot: data.plot || project.plot,
        description: data.description || project.description,
        content: data.content || project.content,
        start_date: data.start_date || project.start_date,
        end_date: data.end_date || project.end_date,
        client: data.client || project.client,
        director: data.director || project.director,
        location_id: location.id || project.location_id,
        budget: data.budget || project.budget,
        room_count: data.room_count || project.room_count,
        status: data.status || project.status,
        estateId: estate.id,
        show: req.files["show"]
          ? req.files["show"][0].path.replace(/^public[\\/]/, "")
          : project.show, // If a new show file is provided, replace it
      },
      { transaction }
    );

    // Step 3: Handle media deletion based on conditions

    // Step 4: Upload new media files if provided
    if (req.files["files"] && req.files["files"].length > 0) {
      const mediaPromises = req.files["files"].map((file) => {
        return Media.create(
          {
            parent_id: project.id,
            type: "project",
            path: file.path.replace(/^public[\\/]/, ""),
            exe: file.mimetype.startsWith("video") ? "video" : "image", // File type check
          },
          { transaction }
        );
      });
      await Promise.all(mediaPromises);
    }

    // Step 5: Update categories (ProjectCategories)
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

      await project.setCategories(categories, { transaction }); // Update categories
    }

    // Step 6: Update tags (ProjectTags)
    if (data.tags && data.tags.length > 0) {
      if (!Array.isArray(data.tags)) {
        data.tags = [data.tags];
      }

      const parsedTags = data.tags.map((tag) => parseInt(tag));

      const tags = await Tag.findAll({
        where: { id: parsedTags },
        transaction,
      });

      await project.setTags(tags, { transaction }); // Update tags
    }

    // Step 7: Update URLs (ProjectUrl)
    if (data.urls && data.urls.length > 0) {
      if (!Array.isArray(data.urls)) {
        data.urls = [data.urls];
      }

      const parsedUrls = data.urls.map((url) => parseInt(url));

      const urls = await Url.findAll({
        where: { id: parsedUrls },
        transaction,
      });

      await project.setUrls(urls, { transaction }); // Update URLs
    }

    // Commit transaction after all updates
    await transaction.commit();

    return res.json({ msg: "Project updated successfully" });
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    console.error("Error updating project:", error);
    return res
      .status(500)
      .json({ error: "Project update failed", details: error.message });
  }
};

exports.partialUpdate = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }
    await project.update(req.body);
    return res.status(200).json(project);
  } catch (error) {
    console.error("Error partially updating project:", error);
    return res
      .status(500)
      .json({ message: "Error partially updating project.", error });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findByPk(id);
    if (!project) {
      return res.status(404).json({ message: "Project not found." });
    }

    // Delete associated media
    await Media.destroy({
      where: {
        parent_id: id,
        type: "project", // Assuming ProjectId is the foreign key in the Media table
      },
    });

    await project.destroy();
    return res
      .status(200)
      .json({ msg: "Project and associated media deleted successfully." });
  } catch (error) {
    console.error("Error deleting project:", error);
    return res.status(500).json({ msg: "Error deleting project.", error });
  }
};

exports.saveCommentForProject = async (req, res) => {
  const { id } = req.params; // Extract project ID from request parameters
  const { content, author } = req.body; // Extract comment data from request body

  try {
    // Find the project by ID
    const project = await Project.findByPk(id);

    if (!project) {
      return res.status(404).json({ message: "project not found" });
    }

    // Create a new comment
    const newComment = await Comment.create({
      content,
      author,
      user_id: req.user ? req.user.id : null, // Save user ID if logged in, otherwise null
    });

    // Associate the comment with the project
    await project.addComment(newComment); // This automatically handles the projectComment table

    return res.status(201).json({
      msg: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ msg: "Failed to add comment", error });
  }
};
