'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class JobRecuit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Post, { foreignKey: 'postId', as: 'JobRecuit' });
      this.belongsTo(models.Position, { foreignKey: 'positionId', as: 'jobRecuits' });
      this.hasMany(models.JobSeeker, {foreignKey: 'jobRecuitId'});
    }
  };
  JobRecuit.init({
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    positionId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'jobRecuits',
    modelName: 'JobRecuit',
  });
  return JobRecuit;
};