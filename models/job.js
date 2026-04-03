'use strict';

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Job extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.TypeJob, { foreignKey: 'type_job_id', as: 'TypeJobs' });
      this.hasMany(models.JobApplication, { foreignKey: 'job_id', as: 'applications', onDelete: 'CASCADE' });
    }

  };
  Job.init({
    type_job_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    logo_url: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    image_details: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: false,
    },


    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING, // Full-time, Part-time, Contract
      allowNull: false,
    },

    salary: {
      type: DataTypes.STRING,
      allowNull: true,
    },


    start_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    end_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },

    is_active: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },

  }, {
    sequelize,
    tableName: 'jobs',
    modelName: 'Job',
  });
  return Job;
}