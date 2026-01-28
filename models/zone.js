'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Zone extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.InternationalCall, { foreignKey: 'zoneId', });
    }
  };
  Zone.init({
    zoneName_la: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zoneName_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'zones',
    modelName: 'Zone',
  });
  return Zone;
};