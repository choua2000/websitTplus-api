'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
     await queryInterface.bulkInsert('languages', [
      {
        name: 'ລາວ',
        short: 'LA',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'English',
        short: 'EN',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ], {});


  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
     await queryInterface.bulkDelete('languages', null, {});
  }
};
