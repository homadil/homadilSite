const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Sequelize instance

// Define the Blog model
const Blog = sequelize.define(
  "Blog",
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    quote: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    show: {
      type: DataTypes.STRING, // Can store both image or video paths
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Blog;
