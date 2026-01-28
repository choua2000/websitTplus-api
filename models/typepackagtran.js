'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypePackagTran extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.TypePackage, { foreignKey: 'typePackage_Id', as: 'TypePackagTran' });
      this.belongsTo(models.Languages, { foreignKey: 'languageId', });
    }
  };
  TypePackagTran.init({
    typePackage_Id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    languageId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'typePackagTrans',
    modelName: 'TypePackagTran',
  });
  return TypePackagTran;
};