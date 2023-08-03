const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../db/database");
const Job = require("./Job");
const Process = require("./Process");

class User extends Model {}

User.init(
  {
    username: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
    },
    password: {
      type: DataTypes.STRING,
    },
    userType: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "user",
  }
);

User.hasMany(Process, { foreignKey: "creator" });
User.hasMany(Process, { foreignKey: "receiver" });
User.hasMany(Job, { foreignKey: "creator" });
User.hasMany(Job, { foreignKey: "receiver" });

module.exports = User;
