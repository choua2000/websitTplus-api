'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NewPackageTran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.NewPackage, { foreignKey: 'package_Id', as: 'NewPackageTrans' });
      this.belongsTo(models.Languages, { foreignKey: 'languageId', });
    }
  };
  NewPackageTran.init({
    package_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    languageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    detail: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    slug: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'newPackageTrans',
    modelName: 'NewPackageTran',
  });
  return NewPackageTran;
};