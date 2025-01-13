const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Sequelize instance

// Define the FAQ model
const OfferLetter = sequelize.define(
  "OfferLetter",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true, // Validates that the value is in email format
      },
    },
    number: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    show: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = OfferLetter;
