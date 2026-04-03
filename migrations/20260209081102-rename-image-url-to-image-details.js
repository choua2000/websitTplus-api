'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('jobs', 'image_url', 'image_details');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('jobs', 'image_details', 'image_url');
  }
};
