'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostTran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Post, { foreignKey: 'postId', as: 'PostTran' });
      this.belongsTo(models.Languages, { foreignKey: 'languageId', as: 'PostTranLang' });
    }
  };
  PostTran.init({
    postId: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    languageId: {
      type:DataTypes.INTEGER,
      allowNull: true
    },
    title: {
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
    tableName: 'postTrans',
    modelName: 'PostTran',
  });
  return PostTran;
};