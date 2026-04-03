const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Languages extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.CateProductTran, { foreignKey: 'languageId' });
      // this.hasMany(models.CatePackageTran, { foreignKey: 'languageId' });
      this.hasMany(models.PostTypesTran, { foreignKey: 'languageId' });
      // this.hasMany(models.PackagesTran, { foreignKey: 'languageId' });
      this.hasMany(models.ProductTran, { foreignKey: 'languageId' });
      this.hasMany(models.PostTran, { foreignKey: 'languageId' });
      this.hasMany(models.PostImageTran, { foreignKey: 'languageId' });
      this.hasMany(models.BannerTran, { foreignKey: 'languageId' });
      this.hasMany(models.BannerFindjobTran, { foreignKey: 'languageId' });
      this.hasMany(models.SiteInfoTran, { foreignKey: 'languageId' });
      // this.hasMany(models.BanImageTran, { foreignKey: 'languageId' });
      this.hasMany(models.ChatQuestionTrans, { foreignKey: 'languageId' });
      this.hasMany(models.NewsCategoryTran, { foreignKey: 'languageId' });
      this.hasMany(models.TitleContactTran, { foreignKey: 'languageId' });
      this.hasMany(models.CatePackageTran, { foreignKey: 'languageId' });
      this.hasMany(models.TypePackagTran, { foreignKey: 'languageId' });
      this.hasMany(models.NewPackageTran, { foreignKey: 'languageId' });
    }
  };
  Languages.init({
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    short: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'languages',
    modelName: 'Languages',
  });
  return Languages;
};