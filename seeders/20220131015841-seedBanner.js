'use strict';

import {
  seedDataDefaultBanner,
  seedDataDefaultBanner_EN
} from '../libs/seed/seedDataBanner';

import { Banner, BannerTran } from '../models';

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

    // seeder default banner
    await Promise.all(seedDataDefaultBanner.map(async (item) => {
      await Banner.create(item);
    }));

    // seeder default banner tran
    await Promise.all(seedDataDefaultBanner_EN.map(async (item) => {
      await BannerTran.create(item);
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
