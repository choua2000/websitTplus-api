'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CateProducts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.CateProductTran, { foreignKey: 'cateProductId',});
      // this.hasMany(models.ProductCategory, { foreignKey: 'cateProductId',});
      this.belongsToMany(models.Product, { foreignKey: 'cateProductId', through: 'productCategories', as: 'products'});

    }
  };
  CateProducts.init({
    cateName: {
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
    tableName: 'cateProducts',
    modelName: 'CateProducts',
  });
  return CateProducts;
};