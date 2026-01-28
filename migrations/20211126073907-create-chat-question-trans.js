'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('chatQuestionTrans', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      question: {
        type: Sequelize.STRING
      },
      answer: {
        type: Sequelize.TEXT,
      },
      languageId: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: { model: 'languages', key: 'id' },
      },
      chatQuestionId:{
        type:Sequelize.INTEGER,
        allowNull:true,
        references:{
          model:"chatQuestions",
          key:"id"
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('chatQuestionTrans');
  }
};