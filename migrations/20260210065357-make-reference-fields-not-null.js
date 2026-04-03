'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn('applicant_references', 'ref_name', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('applicant_references', 'ref_occupation', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('applicant_references', 'ref_company', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
      queryInterface.changeColumn('applicant_references', 'ref_address_tel', {
        type: Sequelize.STRING,
        allowNull: false,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.changeColumn('applicant_references', 'ref_name', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('applicant_references', 'ref_occupation', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('applicant_references', 'ref_company', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
      queryInterface.changeColumn('applicant_references', 'ref_address_tel', {
        type: Sequelize.STRING,
        allowNull: true,
      }),
    ]);
  },
};
