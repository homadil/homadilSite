const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Sequelize instance

// Define the Tag model
const Tag = sequelize.define(
  "Tag",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Tag;
