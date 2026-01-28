'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductTran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Product, {foreignKey:'productId', as: 'ProductTran'});
      this.belongsTo(models.Languages, { foreignKey: 'languageId', as: 'ProductTranLang'});
    }
  };
  ProductTran.init({
    productId: {
      type:DataTypes.INTEGER,
      allowNull: true,
    },
    languageId: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    productName: {
      type:DataTypes.STRING,
      allowNull: true
    },
    description: {
      type:DataTypes.TEXT,
      allowNull: true
    },
    slug: {
      type:DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'productTrans',
    modelName: 'ProductTran',
  });
  return ProductTran;
};