const { DataTypes } = require("sequelize");
const sequelize = require("../index"); // Sequelize instance

const Testimony = sequelize.define(
  "Testimony",
  {
    comment: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    position: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Testimony;
