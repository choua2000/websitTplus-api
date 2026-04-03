'use strict';

module.exports = {
    async up(queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.addConstraint('job_applications', {
                fields: ['contact_number'],
                type: 'unique',
                name: 'unique_contact_number_constraint'
            }),
            queryInterface.addConstraint('job_applications', {
                fields: ['email'],
                type: 'unique',
                name: 'unique_email_constraint'
            })
        ]);
    },

    async down(queryInterface, Sequelize) {
        await Promise.all([
            queryInterface.removeConstraint('job_applications', 'unique_contact_number_constraint'),
            queryInterface.removeConstraint('job_applications', 'unique_email_constraint')
        ]);
    }
};
