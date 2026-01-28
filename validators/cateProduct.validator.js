import Joi from 'joi';

export const addCateProduct = Joi.object({
    cateName: Joi.string().min(3).required(),
    description:  Joi.string().allow(null, ''),
    other_lang: Joi.array().items({
        cateName: Joi.string().min(3).required(),
        description:  Joi.string().allow(null, ''),
        language_id: Joi.number().required(),
    }).required()
});

export const updateCateProductSchema = Joi.object({
    cateName: Joi.string().min(3).required(),
    description:  Joi.string().allow(null, ''),
    other_lang: Joi.array().items({
        cateName: Joi.string().min(3).required(),
        description:  Joi.string().allow(null, ''),
        language_id: Joi.number().required(),
    }).required()
});