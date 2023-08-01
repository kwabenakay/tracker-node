const { Model, DataTypes } = require("sequelize");
const sequelize = require("./../db/database");
const Process =  require('./Process')


class Job extends Model {}

Job.init(
  {
    jobName: {
      type: DataTypes.STRING,
    },
    creator: {
      type: DataTypes.NUMBER,
    },
    receiver: {
        type: DataTypes.NUMBER,
      },
    remarks: {
      type: DataTypes.STRING,
    },
  },
  {
    sequelize,
    modelName: "job",
  }
);

Job.hasMany(Process,{foreignKey:"jobId"})
Process.belongsTo(Job)

module.exports = Job;
