import { SimType, NewPackageSimType, NewPackage } from '../models';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // package simtype --> T-Plus Postpaid Data
    const packageA = await NewPackage.findAll({ where: { code: [301, 302, 303, 304, 305, 350] } })
    const simTypeA = await SimType.findOne({ where: { mainProduct: 1643918648 } })
    await simTypeA.addNewPackage(packageA)

    // package simtype --> T-Plus HOME
    const packageB = await NewPackage.findAll({ where: { code: [301, 302, 303, 304, 305, 350] } })
    const simTypeB = await SimType.findOne({ where: { mainProduct: 1838386062 } })
    await simTypeB.addNewPackage(packageB)

    // package simtype --> tplustwoplay
    const packageC = await NewPackage.findAll({ where: { code: [25, 101, 102, 103, 104, 105, 106, 107, 108, 109, 150] } })
    const simTypeC = await SimType.findOne({ where: { mainProduct: 1938385600 } })
    await simTypeC.addNewPackage(packageC)

    // package simtype --> tplus postpaid for Test
    // const packageCC = await NewPackage.findAll({ where: { code: [25, 101, 102, 103, 104, 105, 106, 107, 108, 109, 150] } })
    // const simTypeCC = await SimType.findOne({ where: { mainProduct: 743051279 } })
    // await simTypeCC.addNewPackage(packageCC)

    // package simtype --> DortMUND
    const packageD = await NewPackage.findAll({ where: { code: [116, 117] } })
    const simTypeD = await SimType.findOne({ where: { mainProduct: 1172688790 } })
    await simTypeD.addNewPackage(packageD)

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
