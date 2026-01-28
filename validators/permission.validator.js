import Joi from 'joi';

export const permissSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null, ''),
});