'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CatePackageTran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.CatePackage, {foreignKey: 'catePackage_Id', as: 'CatePackageTrans' });
      this.belongsTo(models.Languages, {foreignKey: 'languageId',});
    }
  };
  CatePackageTran.init({
    catePackage_Id: {
      type:DataTypes.INTEGER,
      allowNull: true,
    },
    languageId: {
      type:DataTypes.INTEGER,
      allowNull: true,
    },
    cateName: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'catePackageTrans',
    modelName: 'CatePackageTran',
  });
  return CatePackageTran;
};