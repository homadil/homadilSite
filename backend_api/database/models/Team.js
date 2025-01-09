const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Sequelize instance

// Define the Team model
const Team = sequelize.define(
  "Team",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING, // Path to the team member's image
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Team;
