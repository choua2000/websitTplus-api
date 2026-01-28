'use strict';

import { NewsCategory, NewsCategoryTran } from '../models';
import { seedNewCategory, seedNewCategory_EN } from '../libs/seed/seedData';

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
    // seedNewCategory.forEach(async (item) => {
    //   await NewsCategory.create(item);
    // });

    await Promise.all(seedNewCategory.map(async (item) => {
      await NewsCategory.create(item);
    }));

    await Promise.all(seedNewCategory_EN.map(async (item) => {
      await NewsCategoryTran.create(item);
    }));

    // seedNewCategory_EN.forEach(async (item) => {
    //   await NewsCategoryTran.create(item);
    // });

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
