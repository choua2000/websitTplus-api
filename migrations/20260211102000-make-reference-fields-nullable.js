'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
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

    async down(queryInterface, Sequelize) {
        await Promise.all([
            // Note: This down migration assumes there are no null values. 
            // If there are, this will fail. That is expected behavior for reverting to NOT NULL.
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
    }
};
