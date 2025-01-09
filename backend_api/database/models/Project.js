const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Sequelize instance

// Define the Project model
const Project = sequelize.define(
  "Project",
  {
    plot: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    start_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    end_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    client: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    director: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    location_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "locations",
        key: "id",
      },
    },
    budget: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true,
    },
    show: {
      type: DataTypes.STRING, // Can store both image or video paths
      allowNull: false,
    },
    estateId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Estates", // References the `Estates` table
        key: "id", // The primary key in the `Estates` table
      },
      onDelete: "CASCADE", // Optional: Adjust behavior on delete
      onUpdate: "CASCADE", // Optional: Adjust behavior on update
    },
    room_count: {
      type: DataTypes.INTEGER,
      allowNull: true, // Optional depending on use case
    },
    status: {
      type: DataTypes.ENUM("Carcass", "DPC", "Non-DPC", "Only-Land"),
      allowNull: false,
      defaultValue: "Only-Land",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Project;
