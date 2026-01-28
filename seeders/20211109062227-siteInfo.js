'use strict';

import { SiteInfo, SiteInfoTran } from '../models';
import { DOMAIN } from '../constants/index';

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
    let imgUrl = `${DOMAIN}/images/logo.jpeg`
    const siteInfo = await SiteInfo.create({
      websiteLogo: imgUrl,
      siteName: 'ທີພລັດ',
      address: 'ສະຖານທີ່ຕັ້ງຢູ່ ບ້ານ ສາຍລົມ, ເມືອງ ຈັນທະບູລີ, ນະຄອນຫຼວງວຽງຈັນ',
      email: 'Customer.care@tplus.la',
      phone: '123',
      facebook: 'facebookTplusLao.com',
      description: 'ລາຍລະອຽດຂໍ້ມູນຕິດຕໍ່',
    });
    await SiteInfoTran.create({
      siteInfoId: siteInfo.id,
      languageId: '2',
      websiteLogo: imgUrl,
      siteName: 'TPLUS',
      address: 'Location: Sailom Village, Chanthabouly District, Vientiane Capital',
      description: '',
    });
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
