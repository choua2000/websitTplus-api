import Joi from 'joi';

export const addPostTypeSchema = Joi.object({
    name: Joi.string().required(),
    other_lang: Joi.array().items({
        name: Joi.string().required(),
        language_id: Joi.number().required(),
    }),
});

export const updatePrioritySchema = Joi.array().items({
    priority: Joi.string().required(),
});

export const updatePostTyepSchema = Joi.object({
    name: Joi.string().required(),
    is_active: Joi.boolean().required(),
    other_lang: Joi.array().items({
        name: Joi.string().required(),
        language_id: Joi.number().required(),
    }),
});