'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ApplicationDocument extends Model {
        static associate(models) {
            this.belongsTo(models.JobApplication, { foreignKey: 'application_id', as: 'application' });
        }
    };
    ApplicationDocument.init({
        application_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        file_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        file_path: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        file_type: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        file_size: {
            type: DataTypes.INTEGER,
            allowNull: true,
        }
    }, {
        sequelize,
        tableName: 'application_documents',
        modelName: 'ApplicationDocument',
    });
    return ApplicationDocument;
};
