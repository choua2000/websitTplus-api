'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.PostTypes, { foreignKey: 'postTypeId', as: 'Post' });
      this.hasMany(models.PostTran, { foreignKey: 'postId' });
      this.hasMany(models.PostImage, { foreignKey: 'postId' });
      this.hasMany(models.PostImageTran, { foreignKey: 'postId' });
      this.hasMany(models.JobRecuit, { foreignKey: 'postId' });
      this.belongsToMany(models.NewsCategory, { foreignKey: 'postId', through: 'newsCategoryPosts', as: 'newsCategories', onDelete: 'cascade' });
    }
  };
  Post.init({
    postTypeId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('open', 'close'),
      defaultValue: 'close',
    },
    startDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'posts',
    modelName: 'Post',
  });
  return Post;
};