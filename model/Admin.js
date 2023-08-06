const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../db/database");

class Admin extends Model {}

Admin.init(
  {
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    }
  },
  {
    sequelize,
    modelName: "admin",
  }
);

module.exports = Admin;
