const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../db/database");
class Process extends Model {}

Process.init(
  {
    processName: {
      type: DataTypes.STRING,
    },
    jobId: {
        type: DataTypes.NUMBER,
      },
    creator: {
      type: DataTypes.NUMBER,
    },
    receiver: {
        type: DataTypes.NUMBER,
      },
    completedAt: {
      type: DataTypes.STRING,
    },
    remarks: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "process",
  }
);

module.exports = Process;
