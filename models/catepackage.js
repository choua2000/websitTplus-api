'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CatePackage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.CatePackageTran, { foreignKey: 'catePackage_Id' });
      this.hasMany(models.NewPackage, { foreignKey: 'catePackage_Id'});
    }
  };
  CatePackage.init({
    cateName: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'catePackages',
    modelName: 'CatePackage',
  });
  return CatePackage;
};