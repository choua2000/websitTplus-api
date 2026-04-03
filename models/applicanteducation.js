'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ApplicantEducation extends Model {
        static associate(models) {
            this.belongsTo(models.JobApplication, { foreignKey: 'application_id', as: 'application' });
        }
    };
    ApplicantEducation.init({
        application_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        university_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        qualification: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        major: {
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
        tableName: 'applicant_educations',
        modelName: 'ApplicantEducation',
    });
    return ApplicantEducation;
};
