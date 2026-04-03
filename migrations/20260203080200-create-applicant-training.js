'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('applicant_trainings', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            application_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'job_applications',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE'
            },
            company_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            department: {
                type: Sequelize.STRING,
                allowNull: false
            },
            main_duty: {
                type: Sequelize.STRING,
                allowNull: false
            },
            duration: {
                type: Sequelize.STRING,
                allowNull: false
            },
            sort_order: {
                type: Sequelize.INTEGER,
                allowNull: true,
                defaultValue: 0
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE
            }
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable('applicant_trainings');
    }
};
