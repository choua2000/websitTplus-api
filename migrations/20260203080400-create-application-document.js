'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('application_documents', {
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
            file_name: {
                type: Sequelize.STRING,
                allowNull: false
            },
            file_path: {
                type: Sequelize.STRING,
                allowNull: false
            },
            file_type: {
                type: Sequelize.STRING,
                allowNull: false
            },
            file_size: {
                type: Sequelize.INTEGER,
                allowNull: true
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
        await queryInterface.dropTable('application_documents');
    }
};
