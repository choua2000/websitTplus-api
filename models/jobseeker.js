'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobSeeker extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.JobRecuit, { foreignKey: 'jobRecuitId', as: 'JobSeeker'});
      this.hasMany(models.JobSeekerFile, { foreignKey: 'jobSeekerId'});
    }
  };
  JobSeeker.init({
    jobRecuitId: {
      type:DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    surName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true
    },
    phone: {
      type:DataTypes.INTEGER,
      allowNull: false
    },
  }, {
    sequelize,
    tableName: 'jobSeekers',
    modelName: 'JobSeeker',
  });
  return JobSeeker;
};