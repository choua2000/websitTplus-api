
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class NextQuestion extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
     this.belongsTo(models.ChatQuestion,{
        foreignKey:'questionId',
        targetKey:"id",
        as:"thebelongQuestion"
      });
      this.belongsTo(models.ChatQuestion,{
       foreignKey:'nextQuestion',
       targetKey:"id",
     as:"theNextQuestion"
     });
    }
  };
  NextQuestion.init({
    questionId: {
      type:DataTypes.INTEGER,
      allowNull:false
    },
    nextQuestion: {
      type:DataTypes.INTEGER,
      allowNull:false
    }
    
  }, {
    sequelize,
    tableName: 'nextQuestions',
    modelName: 'NextQuestion',
  });
  return NextQuestion;
};