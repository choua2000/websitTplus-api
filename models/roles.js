'use strict';
import {
  Model
} from 'sequelize'
module.exports = (sequelize, DataTypes) => {
  class Roles extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Users, { foreignKey: 'roleId', through: 'userroles', as: 'users' });
      // this.belongsToMany(models.Permissions, { foreignKey: 'roleId', through: 'rolePermissions', as: 'permissions' });
    }
  };
  Roles.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'roles',
    modelName: 'Roles',
  });
  return Roles;
};