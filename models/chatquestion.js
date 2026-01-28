
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ChatQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
     
    }
  };
  ChatQuestion.init({
  }, {
    sequelize,
    tableName:"chatQuestions",
    modelName: 'ChatQuestion',
  });
  ChatQuestion.associate = function(models) {
    // associations can be defined here

    //models.ChatQuestion.belongsToMany(models.ChatQuestion, { as: 'nextQuestion', through: 'nextQuestions' ,foreignKey: 'questionId', otherKey: 'nextQuestion'});
   this.hasMany(models.NextQuestion,{
     foreignKey:'questionId',
     as:"nextQuestion",
     onDelete:"CASCADE"
   });
   this.hasMany(models.NextQuestion,{
   foreignKey:'nextQuestion',
    as:"belongQuestion",
    onDelete:"CASCADE"
   });
   this.hasMany(models.ChatQuestionTrans,{
     foreignKey:'chatQuestionId',
     onDelete:"CASCADE"
   })
  };
  return ChatQuestion;
};

