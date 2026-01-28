'use strict';

import { SimType } from '../models';
import { seedDataSimtypes } from '../libs/seed/seedData';

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

    // seedDataSimtypes.forEach(async (item) => {
    //   await SimType.create(item);
    // });

    await Promise.all(seedDataSimtypes.map(async (item) => {
      await SimType.create(item);
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
