'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class ApplicationImage extends Model {
        static associate(models) {
            this.belongsTo(models.JobApplication, { foreignKey: 'application_id', as: 'application' });
        }
    };
    ApplicationImage.init({
        application_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        image: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    }, {
        sequelize,
        tableName: 'application_images',
        modelName: 'ApplicationImage',
    });
    return ApplicationImage;
};
