'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('messages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      message: {
        type: Sequelize.STRING,
        allowNull:false
      },
      send_by: {
        type: Sequelize.INTEGER,
        allowNull:true,
        references:{
          model:"users",
          key:"id",
          onDelete:"CASCADE",
          onUpdate:"CASCADE"
        }
      },
      chat_room_id: {
        type: Sequelize.INTEGER.UNSIGNED,
        references:{
          model:"chat_rooms",
          key:"id",
          onUpdate:"CASCADE",
          onDelete:"CASCADE"
        }
      },
      send_time: {
        type: Sequelize.DATE
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
    return queryInterface.dropTable('messages');
  }
};