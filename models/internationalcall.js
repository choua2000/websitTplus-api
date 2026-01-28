'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InternationalCall extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Zone, { foreignKey: 'zoneId', as: 'Zones' });
    }
  };
  InternationalCall.init({
    countryName_la: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    countryName_en: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    code: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    zoneId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    price_minute: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    }
  }, {
    sequelize,
    tableName: 'internationalCalls',
    modelName: 'InternationalCall',
  });
  return InternationalCall;
};