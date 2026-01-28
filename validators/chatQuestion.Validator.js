const Joi = require('joi');
const createChatQuestionSchema = Joi.object({
    question:Joi.string()
    .required(),
    answer:Joi.string().allow(null,'')
    .required(),
    other_lang: Joi.array().items({
        question: Joi.string().max(255).required(),
        answer: Joi.string().allow(null, ''),
        language_id: Joi.number().required(),
    }).required(),
});

const addExistingQuestionToSubQuestionSchema = Joi.object({
    nextQuestion_id:Joi.number().integer().required()
});

const createAndAddSubQuestionSchema= Joi.object({
    question:Joi.string().max(255).required(),
    answer:Joi.string().allow(null,''),
    question_id:Joi.number().integer().required(),
});

const chatQuestion = Joi.object().keys({
    question: Joi.string().required(),
    answer: Joi.string().allow(null, ''),
    languageId: Joi.number().required(),
    bot:Joi.bool(),
    image:Joi.any()
})

const chatQuestionArraySchema =Joi.array().items(chatQuestion);


module.exports = {
    createChatQuestionSchema,
    addExistingQuestionToSubQuestionSchema,
    createAndAddSubQuestionSchema,
    chatQuestionArraySchema
}
