'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('rolePermissions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      roleId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'roles', key: 'id'}
      },
      permId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'permissions', key: 'id'}
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('rolePermissions');
  }
};