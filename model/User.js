const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../db/database");
const Job = require("./Job");
const Process = require("./Process");
const Courier = require("./Courier");
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
Process.belongsTo(User, { foreignKey: "creator" });

User.hasMany(Process, { foreignKey: "receiver" });
Process.belongsTo(User, { foreignKey: "receiver" });

User.hasMany(Job, { foreignKey: "creator" });
Job.belongsTo(User, { foreignKey: "creator" });

User.hasMany(Job, { foreignKey: "receiver" });
Job.belongsTo(User, { foreignKey: "receiver" });

User.hasMany(Courier, { foreignKey: "receiverId" });
Courier.belongsTo(User, { foreignKey: "receiverId" });

module.exports = User;
