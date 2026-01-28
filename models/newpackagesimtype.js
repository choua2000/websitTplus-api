'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewPackageSimType extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  NewPackageSimType.init({
    newpackageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    simtypeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'newPackageSimTypes',
    modelName: 'NewPackageSimType',
  });
  return NewPackageSimType;
};