'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ApplicantReference extends Model {
        static associate(models) {
            this.belongsTo(models.JobApplication, { foreignKey: 'application_id', as: 'application' });
        }
    };
    ApplicantReference.init({
        application_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        ref_name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ref_occupation: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ref_company: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        ref_address_tel: {
            type: DataTypes.STRING,
            allowNull: true,
        },

    }, {
        sequelize,
        tableName: 'applicant_references',
        modelName: 'ApplicantReference',
    });
    return ApplicantReference;
};
