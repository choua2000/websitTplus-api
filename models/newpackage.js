'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewPackage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.SimType, { foreignKey: 'newpackageId', through: 'newPackageSimTypes', as: 'simTypes' });
      this.hasMany(models.NewPackageTran, { foreignKey: 'package_Id' });
      this.belongsTo(models.CatePackage, { foreignKey: 'catePackage_Id', as: 'categoryPackage' });
      // this.belongsTo(models.CatePackage, { foreignKey: 'catePackage_Id', as: 'NewPackages' });
      // this.belongsTo(models.CatePackage, { foreignKey: 'catePackage_Id', as: 'newPackages' });
      this.belongsTo(models.TypePackage, { foreignKey: 'typePackage_Id', as: 'typePackage' })
    }
  };
  NewPackage.init({
    typePackage_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    catePackage_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    priority: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'newPackages',
    modelName: 'NewPackage',
  });
  return NewPackage;
};