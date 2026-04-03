'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        // Step 1: Update existing values to match new ENUM
        await queryInterface.sequelize.query(
            `UPDATE job_applications SET status = 'pending' WHERE status NOT IN ('pending', 'approved', 'rejected')`
        );

        // Step 2: Change ENUM values
        await queryInterface.changeColumn('job_applications', 'status', {
            type: Sequelize.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending',
        });
    },

    down: async (queryInterface, Sequelize) => {
        // Revert to old ENUM values
        await queryInterface.changeColumn('job_applications', 'status', {
            type: Sequelize.ENUM('pending', 'reviewed', 'shortlisted', 'rejected', 'hired'),
            defaultValue: 'pending',
        });
    }
};
