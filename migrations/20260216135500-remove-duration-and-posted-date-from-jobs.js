'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.removeColumn('jobs', 'duration');
        await queryInterface.removeColumn('jobs', 'posted_date');
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.addColumn('jobs', 'duration', {
            type: Sequelize.STRING,
            allowNull: true,
        });
        await queryInterface.addColumn('jobs', 'posted_date', {
            type: Sequelize.DATEONLY,
            allowNull: true,
        });
    }
};
