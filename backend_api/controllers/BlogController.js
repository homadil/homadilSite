const Blog = require("../database/models/Blog");
const Category = require("../database/models/Category");
const Tag = require("../database/models/Tag");
const Media = require("../database/models/Media");
const Url = require("../database/models/Url");
const User = require("../database/models/User");
const Comment = require("../database/models/Comment");

// CREATE - Add a new blog
exports.create = async (req, res) => {
  // Check if the user is logged in
  const user = req?.user?.user;
  if (!user || !user.id) {
    return res.status(401).json({ error: "User not logged in." });
  }

  const transaction = await Blog.sequelize.transaction(); // Start a transaction

  try {
    const data = req.body; // Retrieve data from the request body

    // Step 2: Create the blog
    const blog = await Blog.create(
      {
        title: data.title,
        description: data.description,
        content: data.content,
        quote: data.quote,
        user_id: user.id, // Associate the blog with the logged-in user
        show: req.files["show"]
          ? req.files["show"][0].path.replace(/^public[\\/]/, "")
          : null, // 'show' is a file
      },
      { transaction }
    );

    // Step 3: Associate media files
    if (req.files["files"] && req.files["files"].length > 0) {
      const mediaPromises = req.files["files"].map((file) => {
        return Media.create(
          {
            type: "blog", // Update type to "blog"
            path: file.path.replace(/^public[\\/]/, ""),
            exe: file.mimetype.startsWith("video") ? "video" : "image", // File type check
            parent_id: blog.id,
          },
          { transaction }
        );
      });
      const mediaFiles = await Promise.all(mediaPromises);
      await blog.addMedia(mediaFiles, { transaction });
    }

    // Step 4: Associate categories
    if (data.categories && data.categories.length > 0) {
      if (!Array.isArray(data.categories)) {
        data.categories = [data.categories];
      }

      const parsedCategories = data.categories.map((category) =>
        parseInt(category)
      );

      const categories = await Category.findAll({
        where: {
          id: parsedCategories,
        },
        transaction,
      });
      await blog.addCategories(categories, { transaction });
    }

    // Step 5: Associate tags
    if (data.tags && data.tags.length > 0) {
      if (!Array.isArray(data.tags)) {
        data.tags = [data.tags];
      }
      const parsedTags = data.tags.map((tag) => parseInt(tag));

      const tags = await Tag.findAll({
        where: {
          id: parsedTags,
        },
        transaction,
      });

      await blog.addTags(tags, { transaction });
    }

    // Step 6: Associate URLs
    if (data.urls && data.urls.length > 0) {
      if (!Array.isArray(data.urls)) {
        data.urls = [data.urls];
      }
      const parsedUrls = data.urls.map((url) => parseInt(url));

      const urls = await Url.findAll({
        where: {
          id: parsedUrls,
        },
        transaction,
      });

      await blog.addUrls(urls, { transaction });
    }

    // Commit transaction
    await transaction.commit();

    return res.json({ msg: "Blog was created successfully", blog });
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    console.error("Error creating blog:", error);
    return res.status(500).json({ error: "Blog creation failed" });
  }
};

// READ - Get all blogs with relationships
exports.getAll = async (req, res) => {
  try {
    const blogs = await Blog.findAll({
      include: [
        { model: Category, through: { attributes: [] } },
        { model: Tag, through: { attributes: [] } },
        { model: Url, through: { attributes: [] } },
        { model: Comment, through: { attributes: [] } },
        { model: Media },
        {
          model: User,
          as: "user", // Ensure the alias matches what is defined in your association
        },
      ],
    });
    return res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return res.status(500).json({ message: "Error fetching blogs.", error });
  }
};

// READ - Get a single blog by ID with relationships
exports.getById = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findOne({
      where: { id },
      include: [
        { model: Category, through: { attributes: [] } },
        { model: Tag, through: { attributes: [] } },
        { model: Media },
      ],
    });

    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    return res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching blog:", error);
    return res.status(500).json({ message: "Error fetching blog.", error });
  }
};

// UPDATE (PUT) - Update an entire blog by ID
exports.update = async (req, res) => {
  const transaction = await Blog.sequelize.transaction(); // Start a transaction

  try {
    const { id } = req.params;
    const data = req.body; // Retrieve data from the request body

    // Find the blog by ID
    const blog = await Blog.findByPk(id);
    if (!blog) {
      throw new Error("Project not found");
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

    // If req.deletePrevMedia is true, delete all previous media associated with the blog
    if (req.body.deletePrevMedia) {
      await Media.destroy({
        where: { parent_id: blog.id, type: "blog" },
        transaction,
      });
    }

    // Step 2: Update blog details
    await blog.update(
      {
        title: data.title,
        description: data.description,
        content: data.content,
        quote: data.quote,
        show: req.files["show"]
          ? req.files["show"][0].path.replace(/^public[\\/]/, "")
          : blog.show, // If a new show file is provided, replace it
      },
      { transaction }
    );

    // Step 4: Upload new media files if provided
    if (req.files["files"] && req.files["files"].length > 0) {
      const mediaPromises = req.files["files"].map((file) => {
        return Media.create(
          {
            type: "blog",
            path: file.path.replace(/^public[\\/]/, ""),
            exe: file.mimetype.startsWith("video") ? "video" : "image", // File type check
            parent_id: blog.id,
          },
          { transaction }
        );
      });
      const mediaFiles = await Promise.all(mediaPromises);
      await blog.addMedia(mediaFiles, { transaction });
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

      await blog.setCategories(categories, { transaction }); // Update categories
    }

    // Step 6: Update tags (BlogTags)
    if (data.tags && data.tags.length > 0) {
      if (!Array.isArray(data.tags)) {
        data.tags = [data.tags];
      }

      const parsedTags = data.tags.map((tag) => parseInt(tag));

      const tags = await Tag.findAll({
        where: { id: parsedTags },
        transaction,
      });

      await blog.setTags(tags, { transaction }); // Update tags
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

      await blog.setUrls(urls, { transaction }); // Update URLs
    }

    // Commit transaction after all updates
    await transaction.commit();

    return res.json({ msg: "Blog updated successfully" });
  } catch (error) {
    // Rollback transaction on error
    await transaction.rollback();
    console.error("Error updating blog:", error);
    return res
      .status(500)
      .json({ error: "Blog update failed", details: error.message });
  }
};

// PARTIAL UPDATE (PATCH) - Partially update a blog by ID
exports.partialUpdate = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    await blog.update(req.body);

    return res
      .status(200)
      .json({ message: "Blog partially updated successfully.", blog });
  } catch (error) {
    console.error("Error partially updating blog:", error);
    return res
      .status(500)
      .json({ message: "Error partially updating blog.", error });
  }
};

// DELETE - Remove a blog by ID
exports.delete = async (req, res) => {
  const { id } = req.params;
  try {
    const blog = await Blog.findByPk(id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found." });
    }

    // Delete associated media
    await Media.destroy({
      where: {
        parent_id: blog.id,
        type: "blog", // Assuming ProjectId is the foreign key in the Media table
      },
    });

    await blog.destroy();
    return res
      .status(200)
      .json({ msg: "Blog and associated media deleted successfully." });
  } catch (error) {
    return res.status(500).json({ msg: "Error deleting blog.", error });
  }
};

exports.saveCommentForBlog = async (req, res) => {
  const { id } = req.params; // Extract blog ID from request parameters
  const { content, author } = req.body; // Extract comment data from request body

  try {
    // Find the blog by ID
    const blog = await Blog.findByPk(id);

    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    // Create a new comment
    const newComment = await Comment.create({
      content,
      author,
      user_id: req.user ? req.user.id : null, // Save user ID if logged in, otherwise null
    });

    // Associate the comment with the blog
    await blog.addComment(newComment); // This automatically handles the BlogComment table

    return res.status(201).json({
      msg: "Comment added successfully",
      comment: newComment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    return res.status(500).json({ msg: "Failed to add comment", error });
  }
};
