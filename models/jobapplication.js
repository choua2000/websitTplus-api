'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class JobApplication extends Model {
        static associate(models) {
            this.belongsTo(models.Job, { foreignKey: 'job_id', as: 'job' });
            this.hasMany(models.ApplicantEducation, { foreignKey: 'application_id', as: 'educations', onDelete: 'CASCADE' });
            this.hasMany(models.ApplicantTraining, { foreignKey: 'application_id', as: 'trainings', onDelete: 'CASCADE' });
            this.hasMany(models.ApplicantWorkExperience, { foreignKey: 'application_id', as: 'workExperiences', onDelete: 'CASCADE' });
            this.hasMany(models.ApplicationDocument, { foreignKey: 'application_id', as: 'documents', onDelete: 'CASCADE' });
            this.hasOne(models.ApplicantReference, { foreignKey: 'application_id', as: 'reference', onDelete: 'CASCADE' });
            this.hasMany(models.ApplicationImage, { foreignKey: 'application_id', as: 'images', onDelete: 'CASCADE' });
        }
    };
    JobApplication.init({
        job_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        photo_url: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        name_and_surname: { // replaces first_name, last_name
            type: DataTypes.STRING,
            allowNull: false,
        },
        date_of_birth: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        place_of_birth: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        current_address: { // replaces address
            type: DataTypes.TEXT,
            allowNull: false,
        },
        village: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        district: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        province: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        contact_number: { // replaces phone
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        nationality: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        marital_status: {
            type: DataTypes.ENUM('Single', 'Married', 'Divorced', 'Widowed'),
            allowNull: false,
        },
        sex: {
            type: DataTypes.ENUM('Male', 'Female', 'Other'),
            allowNull: false,
        },
        how_know_job: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        salary_expecting: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        signature_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        signature: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        signature_date: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        document: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM('pending', 'approved', 'rejected'),
            defaultValue: 'pending',
        }
    }, {
        sequelize,
        tableName: 'job_applications',
        modelName: 'JobApplication',
    });
    return JobApplication;
};
