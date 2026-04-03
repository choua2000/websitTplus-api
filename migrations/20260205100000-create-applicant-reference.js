'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable('applicant_references', {
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
            ref_name: {
                type: Sequelize.STRING,
                allowNull: true
            },
            ref_occupation: {
                type: Sequelize.STRING,
                allowNull: true
            },
            ref_company: {
                type: Sequelize.STRING,
                allowNull: true
            },
            ref_address_tel: {
                type: Sequelize.STRING,
                allowNull: true
            },
            signature: {
                type: Sequelize.STRING,
                allowNull: false
            },
            signature_date: {
                type: Sequelize.DATEONLY,
                allowNull: false
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
        await queryInterface.dropTable('applicant_references');
    }
};
