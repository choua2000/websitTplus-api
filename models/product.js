'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.ProductTran, { foreignKey: 'productId' });
      // this.hasMany(models.ProductCategory, { foreignKey: 'productId' });
      this.hasMany(models.ProductImage, { foreignKey: 'productId' });
      this.belongsToMany(models.CateProducts, { foreignKey: 'productId', through: 'productCategories', as: 'cateProducts'});
    }
  };
  Product.init({
    productName: {
      type: DataTypes.STRING,
      allowNull: false,
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
    tableName: 'products',
    modelName: 'Product',
  });
  return Product;
};