'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewsCategoryTran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.NewsCategory, { foreignKey: 'newsCategoryId', as: 'NewsCategoryTrans' });
      this.belongsTo(models.Languages, { foreignKey: 'languageId', });
    }
  };
  NewsCategoryTran.init({
    newsCategoryId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    languageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'newsCategoryTrans',
    modelName: 'NewsCategoryTran',
  });
  return NewsCategoryTran;
};