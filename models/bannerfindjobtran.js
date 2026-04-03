'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class BannerFindjobTran extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            this.belongsTo(models.BannerFindjob, { foreignKey: 'bannerFindjobId', as: 'BannerFindjobTran' });
            this.belongsTo(models.Languages, { foreignKey: 'languageId', });
        }
    };
    BannerFindjobTran.init({
        bannerFindjobId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        languageId: {
            type: DataTypes.INTEGER,
            allowNull: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        link: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        image: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
    }, {
        sequelize,
        tableName: 'banner_findjob_trans',
        modelName: 'BannerFindjobTran',
    });
    return BannerFindjobTran;
};