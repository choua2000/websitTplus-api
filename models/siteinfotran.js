'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SiteInfoTran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.SiteInfo, { foreignKey: 'siteInfoId', as: 'SiteInfoTran' });
      this.belongsTo(models.Languages, { foreignKey: 'languageId', });
    }
  };
  SiteInfoTran.init({
    siteInfoId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    languageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    websiteLogo: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    siteName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    address: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'siteInfoTrans',
    modelName: 'SiteInfoTran',
  });
  return SiteInfoTran;
};