'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ApplicantTraining extends Model {
        static associate(models) {
            this.belongsTo(models.JobApplication, { foreignKey: 'application_id', as: 'application' });
        }
    };
    ApplicantTraining.init({
        application_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        company_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        department: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        main_duty: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        duration: {
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
        tableName: 'applicant_trainings',
        modelName: 'ApplicantTraining',
    });
    return ApplicantTraining;
};
