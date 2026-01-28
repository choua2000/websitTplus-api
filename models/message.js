

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.belongsTo(models.Users, {
        foreignKey: "send_by"
      });
      this.belongsTo(models.Chat_room, {
        foreignKey: "chat_room_id"
      })
    }
  };
  Message.init({
    message: {
      type: DataTypes.STRING,
      allowNull: true
    },
    chat_room_id:{type:DataTypes.INTEGER,
    allowNull:false},
    send_time: {type:DataTypes.DATE,
    allowNull:false},
    bot: {type:DataTypes.BOOLEAN,
    allowNull:false},
    image_option: {type:DataTypes.BOOLEAN,
    allowNull:false},
    
  }, {
    sequelize,
    tableName: "messages",
    modelName: 'Message',
  });
  return Message;
};