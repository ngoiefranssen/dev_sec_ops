const { DataTypes } = require("sequelize");
const sequelize = require("../index").sequelize;

const countrieModel = sequelize.define(
  "countries",
  {
    id_countrie: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },

    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    code_iso: {
      type: DataTypes.STRING(3),
      allowNull: false,
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },

  {
    freezeTableName: true,
    tableName: "countries",
    timestamps: false,
  }
);

module.exports = countrieModel;
