'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ApplicantWorkExperience extends Model {
        static associate(models) {
            this.belongsTo(models.JobApplication, { foreignKey: 'application_id', as: 'application' });
        }
    };
    ApplicantWorkExperience.init({
        application_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        from_to: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        salary: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        position: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        employer_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        employer_address: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        duties_description: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        reason_for_leaving: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        sort_order: {
            type: DataTypes.INTEGER,
            allowNull: true,
            defaultValue: 0
        }
    }, {
        sequelize,
        tableName: 'applicant_work_experiences',
        modelName: 'ApplicantWorkExperience',
    });
    return ApplicantWorkExperience;
};
