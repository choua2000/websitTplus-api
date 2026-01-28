'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserPermissions extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.Permissions.belongsToMany(models.Users, {foreignKey: 'permId', through: 'userPermissions', as: 'users', onDelete: 'cascade'});
      models.Users.belongsToMany(models.Permissions, {foreignKey: 'userId', through: 'userPermissions', as: 'permissions', onDelete: 'cascade'});
    }
  };
  UserPermissions.init({
    userId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    permId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    }
  }, {
    sequelize,
    tableName: 'userPermissions',
    modelName: 'UserPermissions',
  });
  return UserPermissions;
};