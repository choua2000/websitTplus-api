import Joi from 'joi';

export const addCatePackageSchema = Joi.object({
    name: Joi.string().min(3).required(),
    mainProduct: Joi.number().required(),
    description: Joi.string().allow(null, ''),
    other_lang: Joi.array().items({
        name: Joi.string().allow(null, ''),
        description: Joi.string().allow(null, ''),
        language_id: Joi.number().required(),
    }).required()
});

export const updateCatePackageSchema = Joi.object({
    name: Joi.string().min(3).required(),
    description: Joi.string().allow(null, ''),
    other_lang: Joi.array().items({
        name: Joi.string().allow(null, ''),
        description: Joi.string().allow(null, ''),
        language_id: Joi.number().required(),
    }).required()
});