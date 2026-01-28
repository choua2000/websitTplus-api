'use strict';

// import seedPostTypes from '../libs/seedData/seedPostTypes';
// import seedPostTypes_EN from '../libs/seedData/seedPosTypes_en';
import { seedPostTypes, seedPostTypes_EN } from '../libs/seed/seedData';
import { PostTypes, PostTypesTran } from '../models';

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

    await Promise.all(seedPostTypes.map(async (item) => {
      await PostTypes.create(item);
    }));


    await Promise.all(seedPostTypes_EN.map(async (item) => {
      await PostTypesTran.create(item);
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
