

'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class chat_room extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      this.hasMany(models.Message, {
        foreignKey: "chat_room_id"
      });
      this.belongsTo(models.Users,{
        foreignKey:"created_by"
      })
    }
  };
  chat_room.init({
    channel: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lasted_message: {
      type: DataTypes.STRING,
      allowNull: true
    },
    receive_time: {
      type: DataTypes.DATE,
      allowNull: true
    },
    admin_read: {
      type: DataTypes.BOOLEAN,
      allowNull: false
    },
    created_by: {
      allowNull: false,
      type: DataTypes.INTEGER,

    }

  }, {
    sequelize,
    tableName: "chat_rooms",
    modelName: 'Chat_room',
  });
  return chat_room;
};

