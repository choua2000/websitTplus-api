import {
  Message,
  Chat_room,
  ChatQuestion,
  NextQuestion,
  ChatQuestionTrans,
  sequelize,
  Languages,
} from "../models";
import nextquestion from "../models/nextquestion";
import { sendMessageSchema } from "../validators/sendMessage.Validator";
import createError from "http-errors";
import { Op } from "sequelize";
import { paginate } from "../libs/utils/pagination";
import { response } from "express";


/**
 *
 * @param {Integer} userID
 * @returns {object} Room
 */
async function checkActiveRoom(userID) {
  const chat_room = await Chat_room.findOne({
    where: {
      created_by: userID,
    },
  });

  if (!chat_room) {
    var crypto = require("crypto");
    var channel =
      "channel_" + crypto.randomBytes(5).toString("hex") + "_4" + userID;
    const room = await Chat_room.create({
      channel: channel,
      lasted_message: "",
      receive_time: new Date(),
      admin_read: true,
      created_by: userID,
    });
    return room;
  }
  return chat_room;
}

/**
 * Required AUTH
 * @param {String} message
 * @param {Integer} question_id optional
 * @method POST
 * @return Message
 */
export const sendMessage = async (req, res, next) => {

  const transaction = await sequelize.transaction();
  try {
    const lang = req.query.lang || req.headers.content_language;
    const language = await Languages.findOne({ where: { short: lang } });

    if (!language) {
      throw createError.NotFound(
        "Languages not found just the moment. Please choose language supported now."
      );
    }

    const validateResult = await sendMessageSchema.validateAsync(req.body);

    var io = req.app.get("socketio");


    const room = await checkActiveRoom(req.user.id);

    if (room == null) {
      return res.status(404).json({ message: "No Room found" })
    }


    let lasted_message = "";
    let admin_read = true;
    let message;
    let question;
    let answer;
    let image_option = false;
    let socketanswer;

    if (validateResult.question_id) {
      const questionData = await NextQuestion.findAll({
        where: {
          questionId: validateResult.question_id,
        },
      });
      const oneWayQuestion = await ChatQuestionTrans.findOne({
        where: {
          chatQuestionId: validateResult.question_id,
          languageId: language.id,
        },
      });

      if (Array.isArray(questionData) && questionData.length == 0) {
        if (!oneWayQuestion) {
          throw createError.NotFound("Question Not found");
        }

        question = oneWayQuestion.question;
        answer = oneWayQuestion.answer;

        if (oneWayQuestion.image_option == true) {
          image_option = oneWayQuestion.image_option;
        }

      } else {

        let nextQuestionId = [];
        for (let question of questionData) {
          nextQuestionId.push(question.nextQuestion);
        }
        let findAllnextQuestion = await ChatQuestionTrans.findAll({
          attributes: ["chatQuestionId", "question"],
          where: {
            chatQuestionId: {
              [Op.in]: nextQuestionId,
            },
            languageId: language.id,
          },
        });
        //    let nextQuestion =[];
        findAllnextQuestion.push({ multiOption: "true" });
        /*  for(let temp of findAllnextQuestion)
                {
                    nextQuestion.push(temp);
                }*/
        question = oneWayQuestion.question;
        socketanswer = JSON.stringify(findAllnextQuestion);
        answer = null;
      }

      message = await Message.create(
        {
          message: question,
          send_by: req.user.id,
          send_time: new Date(),
          chat_room_id: room.id,
          bot: true,
          image_option: false
        },
        {
          transaction: transaction,
        }
      );
      if (answer != null) {
        await Message.create(
          {
            message: answer,
            send_by: null, // "admin system"
            send_time: new Date(),
            chat_room_id: room.id,
            bot: true,
            image_option: image_option
          },
          {
            transaction: transaction,
          }
        );
      }

      io.to(room.channel).emit("receive_message", {
        question: question,
        bot: "true",
        send_by: req.user.id,

      });

      if (answer != null) {
        io.to(room.channel).emit("receive_message", {
          answer: answer,
          bot: "true",
          send_by: 0,
          image_option: image_option
        });
      }
      else {
        io.to(room.channel).emit("receive_message", {
          answer: socketanswer,
          bot: "true",
          image_option: image_option
          //   send_by:0
        });

      }

      lasted_message = null;

      await Chat_room.update(
        {
          admin_read: admin_read,
          // lasted_message:lasted_message,
          receive_time: new Date(),
          admin_read: admin_read,
        },
        {
          where: {
            created_by: req.user.id,
          },
          transaction: transaction,
        }
      );
    } else if (validateResult.message) {
      if (validateResult.message.trim() == "") {
        throw createError.BadRequest("Message is required");
      }

      message = await Message.create(
        {
          message: validateResult.message,
          send_by: req.user.id,
          send_time: new Date(),
          chat_room_id: room.id,
          bot: false,
          image_option: false
        },
        {
          transaction: transaction,
        }
      );

      io.to(room.channel).emit("receive_message", {
        message: validateResult.message,
        bot: false,
        send_by: req.user.id
      });
      lasted_message = validateResult.message;
      admin_read = false;
      await Chat_room.update(
        {
          admin_read: admin_read,
          lasted_message: lasted_message,
          receive_time: new Date(),
          admin_read: admin_read,
        },
        {
          where: {
            created_by: req.user.id,
          },
          transaction: transaction,
        }
      );

      io.to("new_message_room_by_snipermonkey_2077").emit("new_message_by_snipermonkey_2077", {
        id: room.id,
        admin_read: false,
        channel: room.channel,
        created_by: room.created_by,
        lasted_message: lasted_message,
        receive_time: new Date(),
        updatedAt: new Date(),
        User:req.user
      });

    } else if (!validateResult.question_id && !validateResult.message) {
      throw createError.BadRequest("No message or question id provided");
    }

    await transaction.commit();
    return res.status(201).json({
      success: true,
      message,
      "channel": room.channel
    });
  } catch (err) {
    await transaction.rollback();
    if (err.isJoi === true) {
      err.status = 422;
    }
    next(err);
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @paylord {}
 * @method GET
 * @returns
 */
// export const loadChatRoom = async (req, res, next) => {


//   try {
//     const chat_room = await Chat_room.findOne({
//       where: {
//         created_by: req.user.id,
//       },
//     });
//     if (!chat_room) {
//       var crypto = require("crypto");
//       var channel =
//         "channel_" + crypto.randomBytes(5).toString("hex") + "_4" + req.user.id;
//       const room = await Chat_room.create({
//         channel: channel,
//         lasted_message: "",
//         receive_time: new Date(),
//         admin_read: true,
//         created_by: req.user.id,
//       });
//       return res.status(200).json({
//         success: true,
//         message: "No Message",
//         channel: channel
//       });
//     }




//     // var io = req.app.get("socketio");
//     /* var socket = await req.app.get("socket");
//      if (socket == null) {
//        return res.status(404).json({
//          message: "please connect to socket",
//          success: false,
//        });
//      }*/
//     /* await socket.join(chat_room.channel);
//      console.log(`\n '\u001b['${socket.id} is connect to ${chat_room.channel}'\u001b[0m' \n`);*/
//     const allMessage = await Message.findAll({
//       where: {
//         chat_room_id: chat_room.id,
//       },
//     });
//     return res.status(200).json({
//       success: true,
//       allMessage,
//       channel: chat_room.channel
//     });
//   } catch (err) {
//     next(err);
//   }
// };

export const loadChatRoom = async (req, res, next) => {
  try {
    const chat_room = await Chat_room.findOne({
      where: {
        created_by: req.user.id,
      },
    });

    if (!chat_room) {
      var crypto = require("crypto");
      var channel =
        "channel_" + crypto.randomBytes(5).toString("hex") + "_4" + req.user.id;
      const room = await Chat_room.create({
        channel: channel,
        lasted_message: "",
        receive_time: new Date(),
        admin_read: true,
        created_by: req.user.id,
      });
      return res.status(200).json({
        success: true,
        message: "No Message",
        channel: channel,
      });
    }

    // var io = req.app.get("socketio");
    /* var socket = await req.app.get("socket");
    if (socket == null) {
      return res.status(404).json({
        message: "please connect to socket",
        success: false,
      });
    }*/
    /* await socket.join(chat_room.channel);
    console.log(`\n '\u001b['${socket.id} is connect to ${chat_room.channel}'\u001b[0m' \n`);*/
    let { page, limit } = req.query;
    //model, pageSize, pageLimit, search = {}, order = [], transform
    const allMessage = await paginate(
      Message,
      page,
      limit,
      { where: { chat_room_id: chat_room.id } },
      [["createdAt", "DESC"]],
      null
    );
   /* const allMessage = await Message.findAll({
      where: {
        chat_room_id: chat_room.id,
      },
    });*/
    return res.status(200).json({
      success: true,
      allMessage,
      channel: chat_room.channel,
    });
  } catch (err) {
    next(err);
  }
};