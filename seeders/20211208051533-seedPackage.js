'use strict';

import {
  // Cate_Package,
  // Cate_PackageTran,
  TypePackage,
  TypePackagTran,
  CatePackage,
  CatePackageTran,
  NewPackage,
  NewPackageTran
} from '../models';

import {
  // seedDataCategoryPackage,
  // seedDataCategoryPackage_EN,
  seedDataTypePackage,
  seedDataTypePackage_EN,
  // seedDataPackage,
  // seedDataPackage_EN,
} from '../libs/seed/seedData';

import {
  seedDataCatePackage,
  seedDataCatePackage_EN,
  seedDataPackage,
  seedDataPackage_EN
} from '../libs/seed/seedDataCatePackage';


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


    // seed category package
    // await Promise.all(seedDataCategoryPackage.map(async (item) => {
    //   await Cate_Package.create(item);
    // }));

    // await Promise.all(seedDataCategoryPackage_EN.map(async (item) => {
    //   await Cate_PackageTran.create(item);
    // }));

    // seed type package
    await Promise.all(seedDataTypePackage.map(async (item) => {
      await TypePackage.create(item);
    }));

    await Promise.all(seedDataTypePackage_EN.map(async (item) => {
      await TypePackagTran.create(item);
    }));

    // seed cate package
    await Promise.all(seedDataCatePackage.map(async (item) => {
      await CatePackage.create(item);
    }));

    await Promise.all(seedDataCatePackage_EN.map(async (item) => {
      await CatePackageTran.create(item);
    }));

    // seed package
    await Promise.all(seedDataPackage.map(async (item) => {
      await NewPackage.create(item);
    }));

    await Promise.all(seedDataPackage_EN.map(async (item) => {
      await NewPackageTran.create(item);
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
