const Joi = require('joi');
const sendMessageSchema = Joi.object({
    question_id:Joi.number().integer(),
    message:Joi.string()

})

module.exports = {
    sendMessageSchema
}