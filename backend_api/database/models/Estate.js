const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Sequelize instance

// Define the Estate model
const Estate = sequelize.define(
  "Estate",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true, // Ensures the name is not empty
      },
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "locations", // Reference to Locations model
        key: "id",
      },
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    director: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    estimate: {
      type: DataTypes.FLOAT, // Use FLOAT for numeric estimates
      allowNull: true,
      validate: {
        isFloat: true, // Ensures the value is a valid float
      },
    },
    area: {
      type: DataTypes.STRING, // Represents the size or region of the estate
      allowNull: true,
    },
    amenities: {
      type: DataTypes.STRING, // Use JSON for storing structured data
      allowNull: true,
    },
    nearbyLocations: {
      type: DataTypes.STRING, // Use JSON for storing structured data
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "completed"),
      allowNull: false,
      defaultValue: "pending", // Default value should match one of the ENUM options
    },
    price_range: {
      type: DataTypes.STRING, // Example: "50M-100M"
      allowNull: true,
    },
    show: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    number_of_units: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

module.exports = Estate;
