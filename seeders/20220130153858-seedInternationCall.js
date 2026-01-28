'use strict';

import { seedDataIDD } from '../libs/seed/seedDataInternationCall';
import { InternationalCall } from '../models';

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

     // seeder international call
     await Promise.all(seedDataIDD.map(async (item) => {
      await InternationalCall.create(item);
    }));

  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  }
};
