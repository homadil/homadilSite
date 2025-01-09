const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Import your Sequelize instance

// Define the Appointment model
const Appointment = sequelize.define(
  "Appointment",
  {
    type: {
      type: DataTypes.JSON, // Allows storing arrays or objects
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isEmail: true, // Validates that the value is in email format
      },
    },
    date: {
      type: DataTypes.DATEONLY, // Stores only the date part (YYYY-MM-DD)
      allowNull: false,
    },
    timepicker: {
      type: DataTypes.STRING, // Time input in string format (e.g., "10:30 AM")
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: true, // Company is optional
    },
    jobsite_address: {
      type: DataTypes.STRING,
      allowNull: true, // Jobsite address is optional
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING, // Dropdown selection value
      allowNull: false,
    },
    zipcode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false, // User phone number is required
    },
    service_type: {
      type: DataTypes.JSON, // Allows storing arrays
      allowNull: false,
    },
    brief_description: {
      type: DataTypes.TEXT, // For detailed descriptions
      allowNull: true, // Optional, as it may not be provided
    },
    newsletter: {
      type: DataTypes.BOOLEAN, // Stores true/false
      allowNull: false,
      defaultValue: false, // Default value if not provided
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields
  }
);

module.exports = Appointment;
