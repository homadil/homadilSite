const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Sequelize instance

// Define the Notification model
const Notification = sequelize.define(
  "Notification",
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
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

module.exports = Notification;
