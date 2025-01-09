const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Sequelize instance
const Blog = require("./Blog");
const Project = require("./Project");

// Define the Media model
const Media = sequelize.define(
  "Media",
  {
    parent_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Can refer to a project, blog, etc.
    },
    type: {
      type: DataTypes.ENUM(
        "project",
        "estate",
        "blog",
        "home_header",
        "home_grid",
        "news_header",
        "project_header",
        "about_us_header",
        "about_us_image",
        "contact_us_header"
      ),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING(255), // Path to the media file
      allowNull: false,
    },
    exe: {
      type: DataTypes.ENUM("video", "image"),
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Media;
