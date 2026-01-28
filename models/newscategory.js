'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewsCategory extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Post, { foreignKey: 'newsCategoryId', through: 'newsCategoryPosts', as: 'posts', onDelete: 'cascade' });
      this.hasMany(models.NewsCategoryTran, { foreignKey: 'newsCategoryId' });
    }
  };
  NewsCategory.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'newsCategories',
    modelName: 'NewsCategory',
  });
  return NewsCategory;
};