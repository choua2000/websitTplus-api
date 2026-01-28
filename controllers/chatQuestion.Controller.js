import { Op } from "sequelize";
import {
  ChatQuestion,
  NextQuestion,
  ChatQuestionTrans,
  sequelize,
  Languages,
} from "../models";
import createError from "http-errors";
import _languages from "../constants/language";
import {
  addExistingQuestionToSubQuestionSchema,
  chatQuestionArraySchema,
} from "../validators/chatQuestion.Validator";

const fs = require("fs");
const path = require("path");
const uuidv4 = require("uuid");
const { promisify } = require("util");
const writeFileAsync = promisify(fs.writeFileSync);

/**
 *
 * @param {question,answer} req
 * @param {question_data} res
 * @param {*} next
 * @returns
 */
export const storeQuestion = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const resultValidation = await chatQuestionArraySchema.validateAsync(
      req.body
    );
    let allLanguage = [];

    for (let languageObject of resultValidation) {
      allLanguage.push(languageObject.languageId);
    }

    const lang = await Languages.findAll({
      where: {
        id: {
          [Op.in]: allLanguage,
        },
      },
    });
    if (!lang) {
      throw createError.NotFound(
        "Languages not found just the moment. Please choose language supported now."
      );
    }
    if (lang.length != allLanguage.length) {
      throw createError.NotFound(
        "Some Languages in your records are not found"
      );
    }

    const data = await ChatQuestion.create({}, { transaction: t });

    for (let questionObject of resultValidation) {
      let answer =
        questionObject.answer == undefined ? null : questionObject.answer;
      let image_option = false;
      if (questionObject.hasOwnProperty("image")) {

        let fileName = await saveImageToDisk(questionObject.image);
        if(fileName==null)
        { 
          throw createError.BadRequest("Invalid Image");
        }
        answer = `${fileName}`;
        image_option = true;
      }
      await ChatQuestionTrans.create(
        {
          answer: answer,
          question: questionObject.question,
          languageId: questionObject.languageId,
          chatQuestionId: data.id,
          image_option: image_option,
          bot:true
        },
        {
          transaction: t,
        }
      );
    }

    await t.commit();
    return res.status(201).json({
      success: true,
      message: "Data has been saved succesfully",
    });
  } catch (err) {
    await t.rollback();
    if (err.isJoi === true) {
      err.status = 422;
    }
    next(err);
  }
};

/**
 * @method PUT
 * @param {question,answer} req
 * @param {message} res
 * @param {*} next
 * @returns
 */
export const updateQuestion = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    
    const resultValidation = await chatQuestionArraySchema.validateAsync(
      req.body
    );
    const checkBaseQuestion = await ChatQuestion.findByPk(req.params.id);
    if (!checkBaseQuestion) {
      throw createError.NotFound("Question not found");
    }
    let allLanguage = [];
    for (let languageObject of resultValidation) {
      allLanguage.push(languageObject.languageId);
    }
    const lang = await Languages.findAll({
      where: {
        id: {
          [Op.in]: allLanguage,
        },
      },
    });
    if (!lang) {
      throw createError.NotFound(
        "Languages not found just the moment. Please choose language supported now."
      );
    }
    if (lang.length != allLanguage.length) {
      throw createError.NotFound(
        "Some Languages in your records are not found"
      );
    }

    for (let objectData of resultValidation) {
      //   let updateData = {
      //     question: objectData.question,
      //     answer: objectData.answer == undefined ? "" : objectData.answer,
      //   };
      let oldData = await ChatQuestionTrans.findOne({
        where: {
          chatQuestionId: req.params.id,
          languageId: objectData.languageId,
         // image_option: true,
        },
      });
      if(!oldData) {
        throw createError.NotFound("Data not found");
      }
      if (objectData.hasOwnProperty("image")) {
        let fileName = await saveImageToDisk(objectData.image);
        if(fileName==null) {
          throw createError.BadRequest("Image is invalid");
        }
       
       
        /*  updateData = {
          question: objectData.question,
          answer: answer,
          image_option: image_option,
        };*/
        
       

        await ChatQuestionTrans.update(
          {
            question: objectData.question,
            answer: fileName,
            image_option: true,
          },
          {
            where: {
              chatQuestionId: req.params.id,
              languageId: objectData.languageId,
            },
          },
          {
            transaction: transaction,
          }
        );
      } else {
        await ChatQuestionTrans.update(
          {
            question: objectData.question,
            answer: objectData.answer == undefined ? "" : objectData.answer,
            image_option:false
          },
          {
            where: {
              chatQuestionId: req.params.id,
              languageId: objectData.languageId,
            },
          },
          {
            transaction: transaction,
          }
        );
      }
      if (oldData.image_option==true) {
        //found original path
        const projectPath = path.resolve("./");

        //folder for upload

        const uploadPath = `${projectPath}/public/images/chat-questions/`;
        try {
          fs.unlinkSync(`${uploadPath}/${oldData.answer}`);
        } catch (err) {}
      }

      //   await ChatQuestionTrans.update(
      //     updateData,
      //     {
      //       where: {
      //         chatQuestionId: req.params.id,
      //         languageId: objectData.languageId,
      //       },
      //     },
      //     {
      //       transaction: transaction,
      //     }
      //   );
    }

    await transaction.commit();
    return res.status(200).json({
      success: true,
      message: "Data updated succesfully",
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
 * @method get
 * @param {*} req
 * @param {QuestionData} res
 * @param {*} next
 * @returns
 */
export const getQuestion = async (req, res, next) => {
  try {
    //  const lang = req.headers.content_language;
    //  const language = await Languages.findOne({ where: { short: lang } });
    //const transaction = await sequelize.transaction();
    //  if (!language) {
    //      throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
    //  }
    /*  const foreignChatQuestion = await ChatQuestionTrans.findAll({
            where:{
                languageId:language.id,
                chatQuestionId:req.params.id,
            }
        },{
            transaction:transaction
        })*/
    /*  if(Array.isArray(foreignChatQuestion) && foreignChatQuestion.length==0)
        {*/
    //default language lao
    const chatQuestion = await ChatQuestionTrans.findAll({
      where: {
        chatQuestionId: req.params.id,
      },
    });
    return res.status(200).json({
      success: true,
      data: chatQuestion,
    });
    //}
  } catch (err) {
    next(err);
  }
};

/**
 * @method GET
 * @param {*} req
 * @param {questionData} res
 * @param {*} next
 * @returns
 */
export const getAllQuestion = async (req, res, next) => {
  try {
    //  const lang = req.headers.content_language;
    // let language;
    //  if(lang)
    //  {
    //       language = await Languages.findOne({ where: { short: lang } });
    //   }

    /* if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }*/

    const data = await ChatQuestion.findAll({
      include: ChatQuestionTrans,
    });
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @method Delete
 * @param {quetion_id} req
 * @param {message} res
 * @param {*} next
 * @returns
 */
export const destroyQuestion = async (req, res, next) => {
  const transaction = await sequelize.transaction();
  try {
    const { id } = req.params;
    await NextQuestion.destroy(
      {
        where: {
          [Op.or]: [{ questionId: id }, { nextQuestion: id }],
        },
      },
      {
        transaction: transaction,
      }
    );
    let oldData = await ChatQuestionTrans.findAll({
        where:{
            chatQuestionId:id
        }
    });
    await ChatQuestionTrans.destroy(
      {
        where: {
          chatQuestionId: id,
        },
      },
      {
        transaction: transaction,
      }
    );
    await ChatQuestion.destroy(
      {
        where: {
          id: id,
        },
      },
      {
        transaction: transaction,
      }
    );

    if (oldData) {
      //found original path
      const projectPath = path.resolve("./");
      //folder for upload
      for(let data of oldData)
      {
        if(data.image_option==true)
        {
          const uploadPath = `${projectPath}/public/images/chat-questions/`;
          try {
            fs.unlinkSync(`${uploadPath}/${data.answer}`);
          } catch (err) {}
        }
      
      }
  
    }

    await transaction.commit();
    return res.status(200).json({
      success: true,
      message: `Question has been deleted successfully`,
    });
  } catch (err) {
    await transaction.rollback();
    next(err);
  }
};

/**
 * Save question
 * @method POST
 * @param {question,answer} req
 * @param {*} res
 * @param {*} next
 */
 export const createAndAddSubQuestion = async (req, res, next) => {
  const t1 = await sequelize.transaction();
  try {
    const validationResult = await chatQuestionArraySchema.validateAsync(
      req.body
    );
    const previousData = await ChatQuestion.findByPk(req.params.id, {
      include: ChatQuestionTrans,
    });

    if (!previousData) {
      throw createError.NotFound("This questions doesn't exist");
    }
    let allLanguage = [];
    for (let languageObject of validationResult) {
      allLanguage.push(languageObject.languageId);
    }

    const lang = await Languages.findAll({
      where: {
        id: {
          [Op.in]: allLanguage,
        },
      },
    });
    if (!lang) {
      throw createError.NotFound(
        "Languages not found just the moment. Please choose language supported now."
      );
    }
    if (lang.length != allLanguage.length) {
      throw createError.NotFound(
        "Some Languages in your records are not found"
      );
    }

    const nextQuestion = await ChatQuestion.create({}, { transaction: t1 });

   /* for (let questionObject of validationResult) {
      await ChatQuestionTrans.create(
        {
          answer:
            questionObject.answer == undefined ? null : questionObject.answer,
          question: questionObject.question,
          languageId: questionObject.languageId,
          chatQuestionId: nextQuestion.id,
        },
        {
          transaction: t1,
        }
      );
    }*/

    ///////
    for (let questionObject of validationResult) {
      let answer =
        questionObject.answer == undefined ? null : questionObject.answer;
      let image_option = false;
      if (questionObject.hasOwnProperty("image")) {

        let fileName = await saveImageToDisk(questionObject.image);
        if(fileName==null)
        { 
          throw createError.BadRequest("Invalid Image");
        }
        answer = `${fileName}`;
        image_option = true;
      }
      await ChatQuestionTrans.create(
        {
          answer: answer,
          question: questionObject.question,
          languageId: questionObject.languageId,
          chatQuestionId: nextQuestion.id,
          image_option: image_option,
          bot:true
        },
        {
          transaction: t1,
        }
      );
    }

    ///////////



    await NextQuestion.create(
      {
        questionId: req.params.id,
        nextQuestion: nextQuestion.id,
      },
      {
        transaction: t1,
      }
    );
    await t1.commit();
    return res.status(201).json({
      success: true,
      message: "question has been create and save successfully",
    });
  } catch (err) {
    await t1.rollback();
    if (err.isJoi === true) {
      err.status = 422;
    }
    next(err);
  }
};

/**
 * @method POST
 * @param {question_id,next_quetion} req
 * @param {} res
 * @param {*} next
 */

export const addExistingQuestionToSubQuestion = async (req, res, next) => {
  try {
    // const {body} = req;
    const validationResult =
      await addExistingQuestionToSubQuestionSchema.validateAsync(req.body);
    const checkIfDataExist = await NextQuestion.findOne({
      where: {
        [Op.and]: [
          { questionId: req.params.id },
          { nextQuestion: validationResult.nextQuestion_id },
        ],
      },
    });

    if (checkIfDataExist) {
      throw createError.Conflict("This questions sequence already exist");
    }

    await NextQuestion.create({
      questionId: req.params.id,
      nextQuestion: validationResult.nextQuestion_id,
    });
    return res.status(201).json({
      success: true,
      message: "Data has been save successfully",
    });
  } catch (err) {
    if (err.isJoi === true) {
      err.status = 422;
    }
    next(err);
  }
};

/**
 * @method GET
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
export const loadBaseQuestion = async (req, res, next) => {
  try {
    const lang = req.query.lang || req.headers.content_language;
    const language = await Languages.findOne({ where: { short: lang } });
    if (!language) {
      throw createError.NotFound(
        "Languages not found just the moment. Please choose language supported now."
      );
    }

    const uniqueSubQuestionID = await NextQuestion.aggregate(
      "nextQuestion",
      "DISTINCT",
      { plain: false }
    );
    let uniqueIdArray = [];
    for (let eachId of uniqueSubQuestionID) {
      uniqueIdArray.push(eachId.DISTINCT);
    }

    /*    const baseQuestionData = await ChatQuestion.findAll({
           where:{
               id:{[Op.notIn]:uniqueIdArray},
              
           },
           include:ChatQuestionTrans
          
       });*/

    const baseQuestionData = await ChatQuestionTrans.findAll({
      where: {
        [Op.and]: [
          { chatQuestionId: { [Op.notIn]: uniqueIdArray } },
          { languageId: language.id },
        ],
      },
    });

    return res.status(200).json({
      success: true,
      baseQuestionData,
    });
  } catch (err) {
    next(err);
  }
};

export const viewSubQuestion = async (req, res, next) => {
  try {
    const baseQuestionId = req.params.id;
    const subQuestion = await NextQuestion.findAll({
      where: {
        questionId: baseQuestionId,
      },
      include: "theNextQuestion",
    });
    if (Array.isArray(subQuestion) && subQuestion.length == 0) {
      const oneChatQuestion = await ChatQuestion.findOne({
        where: {
          id: baseQuestionId,
        },
        include: ChatQuestionTrans,
      });
      if (!oneChatQuestion) {
        throw createError.NotFound("This questions doesn't exist");
      }
      return res.status(200).json({
        nextQuestion: false,
        success: true,
        data: oneChatQuestion["ChatQuestionTrans"],
      });
    }

    let data = [];
    for (let oneQuestion of subQuestion) {
      data.push(oneQuestion.theNextQuestion.id);
    }
    const subQuestionData = await ChatQuestion.findAll({
      where: {
        id: {
          [Op.in]: data,
        },
      },
      include: ChatQuestionTrans,
    });
    return res.status(200).json({
      nextQuestion: true,
      success: true,
      subQuestionData,
    });
  } catch (err) {
    next(err);
  }
};


function decodeBase64Image(base64Str) {
  var matches = base64Str.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
  var image = {};
  if (!matches || matches.length !== 3) {
    throw createError.BadRequest("Invalid base64 string");
  }
  image.type = matches[1];
  image.data = matches[2];
  return image;
}

async function saveImageToDisk(baseImage) {
  //found original path
  const projectPath = path.resolve("./");

  //folder for upload
  const uploadPath = `${projectPath}/public/images/chat-questions/`;


  //find extension
  /*const ext = baseImage.subString(
      baseImage.indexOf("/") + 1,
      baseImage.indexOf(";base64")
    );*/
 
  try{
    var ext = baseImage.split(";")[0].split("/");
  }catch{
    return null;
  }
    

  // generate new file image with extension

  let fileName = "";
  if (ext[1] == "jpeg" || ext[1] == "png" || ext[1] == "jpg") {
    fileName = `${uuidv4.v4()}.${ext[1]}`;
  } else {
    return null;
  }

  //Extract base64 data

  let image = decodeBase64Image(baseImage);

  writeFileAsync(uploadPath + fileName, image.data, "base64");

  return fileName;
}