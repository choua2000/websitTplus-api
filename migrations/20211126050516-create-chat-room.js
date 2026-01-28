'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('chat_rooms', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER.UNSIGNED
      },
      channel:{
        allowNull:false,
        type:Sequelize.STRING
      },
      lasted_message: {
        type: Sequelize.STRING,
        allowNull:false
      },
      receive_time: {
        type: Sequelize.DATE,
        allowNull:false
      },
      admin_read: {
        type: Sequelize.BOOLEAN,
        allowNull:false
      },
      created_by:{
        type:Sequelize.INTEGER,
        references:{
          model:"users",
          key:"id"
        }
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
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('chat_rooms');
  }
};