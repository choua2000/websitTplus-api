'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class History extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // this.belongsTo(models.Users, { foreignKey: 'userId', as: 'History'});
      this.belongsTo(models.Users, { foreignKey: 'userId', as: 'User'});
    }
  };
  History.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type:DataTypes.ENUM('refillCard', 'registerPackage','transfer'),
      defaultValue: 'refillCard',
      allowNull: true,
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    phoneDestination: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    value: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'histories',
    modelName: 'History',
  });
  return History;
};