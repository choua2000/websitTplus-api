'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */ await Promise.all([
      queryInterface.addColumn(
        "messages",
        "image_option",
        {
         type:Sequelize.BOOLEAN,
          allowNull:false,
          default:false,
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
      await Promise.all([
        queryInterface.removeColumn('messages', 'image_option'),
      ]);
  }
};
