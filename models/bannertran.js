'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class BannerTran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Banner, { foreignKey: 'bannerId', as: 'BannerTran' });
      this.belongsTo(models.Languages, { foreignKey: 'languageId', });
    }
  };
  BannerTran.init({
    bannerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    languageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    banName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    link: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  }, {
    sequelize,
    tableName: 'bannerTrans',
    modelName: 'BannerTran',
  });
  return BannerTran;
};