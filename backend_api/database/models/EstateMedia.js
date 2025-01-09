const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Adjust path as needed

const EstateMedia = sequelize.define(
  "EstateMedia",
  {
    estate_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Estates", // Table name for the Estate model
        key: "id",
      },
    },
    media_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Media", // Table name for the Media model
        key: "id",
      },
    },
  },
  {
    tableName: "EstateMedia", // Explicitly define the table name
    timestamps: false, // Disable createdAt and updatedAt
  }
);

module.exports = EstateMedia;
