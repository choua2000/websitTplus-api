'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CateProductTran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.CateProducts, { foreignKey: 'cateProductId', as: 'CateProductTran' });
      this.belongsTo(models.Languages, { foreignKey: 'languageId', as: 'cateProductTrans' });
    }
  };
  CateProductTran.init({
    cateProductId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    languageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cateName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'cateProductTrans',
    modelName: 'CateProductTran',
  });
  return CateProductTran;
};