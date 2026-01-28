'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypePackage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.TypePackagTran, { foreignKey: 'typePackage_Id' });
      this.hasMany(models.NewPackage, { foreignKey: 'typePackage_Id' })
    }
  };
  TypePackage.init({
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
    tableName: 'typePackages',
    modelName: 'TypePackage',
  });
  return TypePackage;
};