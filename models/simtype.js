'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SimType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.NewPackage, { foreignKey: 'simtypeId', through: 'newPackageSimTypes', as: 'newPackages' });
    }
  };
  SimType.init({
    mainProduct: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'simTypes',
    modelName: 'SimType',
  });
  return SimType;
};