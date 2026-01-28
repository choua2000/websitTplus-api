'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   await Promise.all([
     queryInterface.addColumn(
       "chatQuestionTrans",
       "bot",{
         type:Sequelize.BOOLEAN,
         allowNull:false,
         default:true,
       }
     )]);
     
     //If image option is true answer field is image NYAN~
    
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    await Promise.all([
        queryInterface.removeColumn('chatQuestionTrans', 'bot'),
       // queryInterface.removeColumn('chatquestiontrans', 'image_option'),
        
      ]);
  }
};
