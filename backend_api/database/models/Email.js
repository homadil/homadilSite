const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Sequelize instance

// Define the User model
const User = sequelize.define(
  "Email",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true, // Ensures it's a valid email
      },
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);
module.exports = User;
