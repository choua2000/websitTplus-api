'use strict';
import {
  Model
} from 'sequelize'
module.exports = (sequelize, DataTypes) => {
  class UserRoles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  UserRoles.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'userroles',
    modelName: 'UserRoles',
  });
  return UserRoles;
};