'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('cateProductTrans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      cateProductId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'cateProducts', key: 'id' }
      },
      languageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'languages', key: 'id' }
      },
      cateName: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: true,
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
    await queryInterface.dropTable('cateProductTrans');
  }
};