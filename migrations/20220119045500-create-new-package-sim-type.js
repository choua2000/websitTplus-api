'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('newPackageSimTypes', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      newpackageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'newPackages', key: 'id' },
      },
      simtypeId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'simTypes', key: 'id' },
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
    await queryInterface.dropTable('newPackageSimTypes');
  }
};