'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('jobs', 'posted_date', {
      type: Sequelize.DATEONLY,
      allowNull: true,   // ✅ อนุญาตให้เป็น NULL
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('jobs', 'posted_date', {
      type: Sequelize.DATEONLY,
      allowNull: false,  // rollback กลับ
    });
  }
};
