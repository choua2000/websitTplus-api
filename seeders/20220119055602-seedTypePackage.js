'use strict';

// import { seedDataTypePackage, seedDataTypePackage_EN } from '../libs/utils/seedData';
// import { TypePackage, TypePackagTran } from '../models';

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

    //  await Promise.all(seedDataTypePackage.map(async (item) => {
    //   await TypePackage.create(item);
    // }));

    // await Promise.all(seedDataTypePackage_EN.map(async (item) => {
    //   await TypePackagTran.create(item);
    // }));

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
