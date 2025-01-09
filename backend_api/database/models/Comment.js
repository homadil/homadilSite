const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Sequelize instance

// Define the Comment model
const Comment = sequelize.define(
  "Comment",
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    author: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    type: {
      type: DataTypes.ENUM("blog", "project"),
      allowNull: false,
      defaultValue: "project",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Comment;
