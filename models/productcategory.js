'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ProductCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Product, { foreignKey: 'productId', as: 'productCategorie' });
      // this.belongsTo(models.CateProducts, { foreignKey: 'cateProductId', as: 'ProductCategory' });
    }
  };
  ProductCategory.init({
    productId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    cateProductId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'productCategories',
    modelName: 'ProductCategory',
  });
  return ProductCategory;
};