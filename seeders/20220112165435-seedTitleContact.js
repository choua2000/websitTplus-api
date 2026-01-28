'use strict';

import { seedData_TitleContact, seedData_TitleContact_EN } from '../libs/seed/seedData';
import { TitleContact, TitleContactTran } from '../models';

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

     await Promise.all(seedData_TitleContact.map(async (item) => {
      await TitleContact.create(item);
    }));

    await Promise.all(seedData_TitleContact_EN.map(async (item) => {
      await TitleContactTran.create(item);
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
