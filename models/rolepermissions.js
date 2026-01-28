'use strict';
import {
  Model
} from 'sequelize'
module.exports = (sequelize, DataTypes) => {
  class RolePermissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Roles.belongsToMany(models.Permissions, { foreignKey: 'roleId', through: 'rolePermissions', as: 'permissions', onDelete: 'cascade' });
      models.Permissions.belongsToMany(models.Roles, { foreignKey: 'permId', through: 'rolePermissions', as: 'roles', onDelete: 'cascade' });
    }
  };
  RolePermissions.init({
    roleId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    permId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'rolePermissions',
    modelName: 'RolePermissions',
  });
  return RolePermissions;
};