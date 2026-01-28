'use strict';
import {
  Model
} from 'sequelize'
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsToMany(models.Roles, { foreignKey: 'userId', through: 'userroles', as: 'roles' });
      this.hasOne(models.Employees, { foreignKey: 'userId' });
      this.hasOne(models.Customer, { foreignKey: 'userId' });
      this.hasOne(models.OTPs, { foreignKey: 'userId' });
      this.hasMany(models.History, { foreignKey: 'userId' });
      this.hasMany(models.Chat_room,{foreignKey:"created_by"})
    }

    toJSON() {
      return { ...this.get(), password: undefined }
    }

  };
  Users.init({
    username: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    phone: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'suspended'),
      defaultValue: 'inactive',
    },
    type_user: {
      type: DataTypes.ENUM('real_user','fake_user'),
      defaultValue: 'real_user',
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'users',
    modelName: 'Users',
  });

  Users.prototype.hasRoles = async function hasRoles(role) {
    // console.log(1);
    if (!role || role === 'undefined') {
      return false;
    }
    const roles = await this.getRoles();
    return !!roles.map(({ name }) => name)
      .includes(role);
  };

  Users.prototype.hasPermissions = async function hasPermissions(permission) {
    // console.log(2);
    console.log(permission);
    if (!permission || permission === 'undefined') {
      return false;
    }
    const permissions = await this.getPermissions();
    return !!permissions.map(({ name }) => name)
      .includes(permission.name);
  };

  Users.prototype.hasPermissionsThroughRoles = async function hasPermissionsThroughRoles(permission) {
    // console.log(3);
    if (!permission || permission === 'undefined') {
      return false;
    }
    const roles = await this.getRoles();
    // eslint-disable-next-line no-restricted-syntax
    for await (const item of permission.roles) {
      if (roles.filter(role => role.name === item.name).length > 0) {
        return true;
      }
    }
    return false;
  };

  Users.prototype.hasPermissionsTo = async function hasPermissionsTo(permission) {
    // console.log(4);
    if (!permission || permission === 'undefined') {
      return false;
    }
    return await this.hasPermissionsThroughRoles(permission) || this.hasPermissions(permission);
  };

  /**
   * Create a new personal access token for the user.
   *
   * @return Object
   * @param device_name
   */
  // Users.prototype.newToken = async function newToken(device_name = '')

  return Users;
};