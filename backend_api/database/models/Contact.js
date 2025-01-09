const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Sequelize instance

// Define the FAQ model
const Contact = sequelize.define(
  "Contact",
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
    question: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = Contact;
