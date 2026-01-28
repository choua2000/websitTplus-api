import { Chat_room, Message, Users, sequelize } from "../../models";
import createError from "http-errors"
import {
    sendMessageSchema,
    leaveRoomSchema,
    adminMessageSchema
} from "../../validators/admin/chat.Validator"
import { Op } from "sequelize";
import { param } from "express-validator";
import { paginate } from "../../libs/utils/pagination";


// export const allChatRooms = async (req, res, next) => {
//     try {
//         let whereQuery = {}
//         if (req.query.filter == "unread") {
//             whereQuery = {
//                 admin_read: false
//             }
//         }
//         else if (req.query.filter == "read") {
//             whereQuery = {
//                 admin_read: true
//             }
//         }




//         const allChatRoom = await Chat_room.findAll(
//             {
//                 where: whereQuery,
//                 order: [
//                     ["admin_read", "DESC"],
//                     ["updatedAt", req.param.orderBy == "ASC" ? req.param.orderBy : "DESC"],
//                 ],
//                 include: Users
//             },

//         );
//         return res.status(200).json({
//             success: true,
//             allChatRoom
//         });
//     } catch (err) {
//         next(err);
//     }
// }

// new
export const allChatRooms = async (req, res, next) => {
    try {
      let whereQuery = {};
      if (req.query.filter == "unread") {
        whereQuery = {
          admin_read: false,
        };
      } else if (req.query.filter == "read") {
        whereQuery = {
          admin_read: true,
        };
      }
  
      let { q, page, limit, orderBy } = req.query;
  
       /*const {count,rows} = await Chat_room.findAndCountAll({
        where:whereQuery,
        order: [
          ["admin_read", "DESC"],
          ["updatedAt", orderBy == "ASC" ? orderBy : "DESC"],
        ],
        include: {model:Users,where:{
            'phone':{[Op.like]:`%${q}%`}
        }},
      });*/
      
     
      let search = {};
      let order = [
        ["admin_read", "DESC"],
        ["updatedAt", orderBy == "ASC" ? "ASC" : "DESC"],
      ];
      
      if (q) {
        search = {
          where: {
            ...whereQuery,
          },
          include: { model: Users, where: { phone: { [Op.like]: `%${q}%` } } },
        };
      } else {
        search = {
          where: { 
            ...whereQuery,
            
          },
          include:Users 
        };
      }
     
  
      const allChatRoom = await paginate(
        Chat_room,
        page,
        limit,
        search,
        order,
        null,
        Users
      );
      return res.status(200).json({
        success: true,
        //  allChatRoom
        allChatRoom,
      });
    } catch (err) {
      next(err);
    }
  };

// export const getChatRoom = async (req, res, next) => {
//     try {
//         const roomId = req.params.id
//         let chat_room_data = await Chat_room.findOne({
//             where: {
//                 id: roomId
//             }, include: Users
//         });

//         if (!chat_room_data) {
//             throw createError.NotFound("no room found");
//         }
//         const messages = await Message.findAll({
//             where: {
//                 chat_room_id: roomId,
//                 bot: false
//             },
//         })
//         chat_room_data.admin_read = true;
//         // var socket = await req.app.get("socket");
//         // if (socket === undefined) {
//         //     return res.status(400).json({
//         //         success: false,
//         //         message: "Please connect to socketIO",

//         //     })
//         // }

//         /*await socket.join(chat_room_data.channel);
//         console.log(`\n '\u001b['${socket.id} is connect to ${chat_room_data.channel}'\u001b[0m' \n`);*/

//         await chat_room_data.save();
//         return res.status(200).json({
//             success: true,
//             messages,
//             chat_room_data,
//             channel: chat_room_data.channel
//         });


//     } catch (err) {
//         next(err);
//     }
// }

// new
export const getChatRoom = async (req, res, next) => {
    try {
      const roomId = req.params.id;
      let { page, limit } = req.query;
  
  
      
      let chat_room_data = await Chat_room.findOne({
        where: {
          id: roomId,
        },
        include: Users,
      });
  
      if (!chat_room_data) {
        throw createError.NotFound("no room found");
      }
      /*const messages = await Message.findAll({
        where: {
          chat_room_id: roomId,
          bot: false,
        },
      });*/
      let search = {
        where:{
          chat_room_id:roomId,
          bot:false
        }
      }
      let order=[
        ["createdAt","DESC"]
      ]
      const messages = await paginate(
        Message,
        page,
        limit,
        search,
        order,
        null,
      );
  
  
  
  
  
  
      chat_room_data.admin_read = true;
  
      //  var socket = await req.app.get("socket");
  
      /* if(socket===undefined)
          {
              return res.status(400).json({
                  success:false,
                  message:"Please connect to socketIO",
                
              })
          }*/
      /*await socket.join(chat_room_data.channel);
         console.log(`\n '\u001b['${socket.id} is connect to ${chat_room_data.channel}'\u001b[0m' \n`);*/
  
      await chat_room_data.save();
      return res.status(200).json({
        success: true,
        messages,
        chat_room_data,
        channel: chat_room_data.channel,
      });
    } catch (err) {
      next(err);
    }
  };

export const leaveRoom = async (req, res, next) => {
    try {
        const validationResult = await leaveRoomSchema.validateAsync(req.body);
        const socket = req.app.get("socket");
        if (socket === undefined) {
            throw createError.NotFound("Socket not found please connect to SocketIo");
        }
        socket.leaveRoom(validationResult.roomChannel);
        return res.status(200).json({
            success: true,
            message: "Leave room successfully"
        })
    } catch (err) {
        if (err.isJoi === true) {
            err.status = 422;
        }
        next(err);
    }
}


export const sendMessage = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {

        const resultValidation = await adminMessageSchema.validateAsync(req.body);

        const chatRoom = await Chat_room.findOne({
            where: {
                id: resultValidation.room_id
            }
        })
        if (!chatRoom) {
            throw createError.NotFound("No chatroom found");
        }
        // const socket = req.app.get("socket");
        var io = req.app.get("socketio");


        const message = await Message.create({
            message: resultValidation.message,
            send_by: req.user.id,
            send_time: new Date(),
            chat_room_id: chatRoom.id,
            bot: false,
            image_option: false,
        }, {
            transaction: transaction
        });

        // socket.to(room_id).emit("receive_message",body.message);
        io.to(chatRoom.channel).emit("receive_message", { message: resultValidation.message, send_by: req.user.id });


        await Chat_room.update({
            admin_read: true,
            lasted_message: resultValidation.message,
            receive_time: new Date(),
            admin_read: true
        }, {
            where: {
                id: resultValidation.room_id,
            },
            transaction: transaction
        });
        await transaction.commit();
        return res.status(200).json({
            success: true,
            message
        })
    } catch (err) {
        await transaction.rollback();
        if (err.isJoi === true) {
            err.status = 422;
        }
        next(err);
    }
}





