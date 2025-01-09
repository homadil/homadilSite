const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Sequelize instance

// Define the URL model
const Url = sequelize.define(
  "Url",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false, // URL link
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true, // Path to the icon (optional)
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true, // Path to the image (optional)
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Url;
