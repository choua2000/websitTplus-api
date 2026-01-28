import Joi from 'joi';

export const roleSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow(null, ''),
});

export const rolePermissSchema = Joi.array().items({
    permId: Joi.number().required(),
});