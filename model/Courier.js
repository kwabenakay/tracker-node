const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../db/database");
const User = require("./User");

class Courier extends Model {}

Courier.init(
  {
    sender: {
      type: DataTypes.STRING,
    },
    subject: {
      type: DataTypes.NUMBER,
    },
    receiverId: {
      type: DataTypes.NUMBER,
    },
    dateOnLetter: {
        type: DataTypes.NUMBER,
      },
    remarks: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "courier",
  }
);

module.exports = Courier;
