'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('job_applications', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },

      job_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'jobs',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },

      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },

      photo_url: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      name_and_surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      date_of_birth: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      place_of_birth: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      current_address: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      village: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      district: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      province: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      contact_number: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      nationality: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      marital_status: {
        type: Sequelize.ENUM('Single', 'Married', 'Divorced', 'Widowed'),
        allowNull: false,
      },

      sex: {
        type: Sequelize.ENUM('Male', 'Female', 'Other'),
        allowNull: false,
      },

      how_know_job: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      salary_expecting: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      signature: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      signature_date: {
        type: Sequelize.DATEONLY,
        allowNull: false,
      },

      document: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      status: {
        type: Sequelize.ENUM(
          'pending',
          'reviewed',
          'shortlisted',
          'rejected',
          'hired'
        ),
        defaultValue: 'pending',
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('job_applications');

    // remove ENUM types (important for PostgreSQL)
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_job_applications_marital_status";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_job_applications_sex";'
    );
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_job_applications_status";'
    );
  },
};
