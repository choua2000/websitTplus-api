'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.addColumn(
        'users', // table name
        'type_user', // new field name
        {
          type: Sequelize.ENUM('real_user', 'fake_user'),
          defaultValue: 'real_user',
          allowNull: true,
        },
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await Promise.all([
      queryInterface.removeColumn('users', 'type_user')]);
  }
};
