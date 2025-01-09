const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Sequelize instance

// Define the Partner model
const Partner = sequelize.define(
  "Partner",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false, // Path to the partner's image
    },
    slogan: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Partner;
