'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('banner_findjob_trans', 'banName', 'name');
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.renameColumn('banner_findjob_trans', 'name', 'banName');
    }
};
