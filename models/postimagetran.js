'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostImageTran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Post, { foreignKey: 'postId', as: 'PostImageTran' });
      this.belongsTo(models.Languages, { foreignKey: 'languageId', as: 'PostImageTranLang' });
    }
  };
  PostImageTran.init({
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    languageId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'postImageTrans',
    modelName: 'PostImageTran',
  });
  return PostImageTran;
};