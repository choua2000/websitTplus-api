import Joi from 'joi';

export const addNewCateSchema = Joi.object({
    name: Joi.string().required(),
    other_lang: Joi.array().items({
        name: Joi.string().required(),
        language_id: Joi.number().required(),
    }),
});