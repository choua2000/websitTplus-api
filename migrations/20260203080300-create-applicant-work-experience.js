'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('applicant_work_experiences', {
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
            from_to: {
                type: Sequelize.STRING,
                allowNull: false
            },
            salary: {
                type: Sequelize.STRING,
                allowNull: false
            },
            position: {
                type: Sequelize.STRING,
                allowNull: false
            },
            employer_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            employer_address: {
                type: Sequelize.STRING,
                allowNull: false
            },
            duties_description: {
                type: Sequelize.TEXT,
                allowNull: false
            },
            reason_for_leaving: {
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
        await queryInterface.dropTable('applicant_work_experiences');
    }
};
