'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobSeekerFile extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.JobSeeker, { foreignKey: 'jobSeekerId', as: 'JobSeekerFile' });
    }
  };
  JobSeekerFile.init({
    jobSeekerId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    file: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'JobSeekerFiles',
    modelName: 'JobSeekerFile',
  });
  return JobSeekerFile;
};