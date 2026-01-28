'use strict';
module.exports = {
  up: async (queryInterface, DataTypes) => {
    await queryInterface.createTable('titleContactTrans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      titleContact_Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'titleContacts', key: 'id' }
      },
      languageId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: { model: 'languages', key: 'id' }
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
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
    await queryInterface.dropTable('titleContactTrans');
  }
};