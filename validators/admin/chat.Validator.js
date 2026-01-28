const Joi = require('joi');
const sendMessageSchema = Joi.object({
    message:Joi.string().max(255).required(),
    
});

const adminMessageSchema = Joi.object({
    room_id:Joi.number().integer().required(),
    message:Joi.string().max(255).required(),
});

const leaveRoomSchema = Joi.object({
    roomChannel:Joi.string().required()
})

module.exports = {
    sendMessageSchema,
    leaveRoomSchema,
    adminMessageSchema
}
