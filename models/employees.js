'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employees extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, { foreignKey: 'userId', as: 'Employee' });
    }
  };
  Employees.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    firtName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    surName: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'employees',
    modelName: 'Employees',
  });
  return Employees;
};