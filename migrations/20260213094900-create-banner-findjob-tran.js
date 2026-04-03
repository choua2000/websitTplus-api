'use strict';
module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('banner_findjob_trans', {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            bannerFindjobId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'banner_findjobs',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            languageId: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'languages',
                    key: 'id'
                },
                onUpdate: 'CASCADE',
                onDelete: 'SET NULL'
            },
            banName: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            link: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            image: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            description: {
                type: Sequelize.TEXT,
                allowNull: true,
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
    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('banner_findjob_trans');
    }
};
