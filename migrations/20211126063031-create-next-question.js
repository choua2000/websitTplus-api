'use strict';
module.exports = {
  up: async(queryInterface, Sequelize) => {
    await queryInterface.createTable('nextQuestions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      questionId: {
        type: Sequelize.INTEGER,
        references:{
          model:"chatQuestions",
          key:'id'
        }
      },
      nextQuestion: {
        type: Sequelize.INTEGER,
        references:{
          model:"chatQuestions",
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
  down:async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('nextQuestions');
  }
};