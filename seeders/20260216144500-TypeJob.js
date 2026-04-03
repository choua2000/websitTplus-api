'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.bulkInsert('type_jobs', [
            { name: 'Selling', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Marketing', createdAt: new Date(), updatedAt: new Date() },
            { name: 'Software Engineer', createdAt: new Date(), updatedAt: new Date() },
        ], {});
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.bulkDelete('type_jobs', {
            name: ['Selling', 'Marketing', 'Software Engineer']
        }, {});
    }
};
