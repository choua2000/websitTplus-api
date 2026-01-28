'use strict';
module.exports = (sequelize, DataTypes) => {
  const ChatQuestionTrans = sequelize.define('ChatQuestionTrans', {
    question: DataTypes.STRING,
    answer: DataTypes.STRING,
    languageId: DataTypes.INTEGER,
    chatQuestionId:DataTypes.INTEGER,
    bot:DataTypes.BOOLEAN,
    image_option:DataTypes.BOOLEAN
  }, {
    sequelize,
    tableName:"chatQuestionTrans",
    modelName:"ChatQuestionTrans"
  });
  ChatQuestionTrans.associate = function(models) {
    // associations can be defined here
    this.belongsTo(models.ChatQuestion,{
      foreignKey:"chatQuestionId",
    })
    this.belongsTo(models.Languages,{
      foreignKey:"languageId"
    })

   
  };
  return ChatQuestionTrans;
};