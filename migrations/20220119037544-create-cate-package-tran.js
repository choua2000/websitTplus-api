'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('catePackageTrans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      catePackage_Id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'catePackages', key: 'id' },
      },
      languageId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'languages', key: 'id' },
      },
      cateName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('catePackageTrans');
  }
};