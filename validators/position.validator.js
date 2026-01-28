import Joi from 'joi';

export const PositionSchema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().allow(null, ''),
});
