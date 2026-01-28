import Joi from 'joi';

const ProductSchema = Joi.object({
    cateProductId: Joi.array().items(
        Joi.number().required(),
    ).required(),
    productName: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    other_lang: Joi.array().items({
        productName: Joi.string().min(3).required(),
        description: Joi.string().allow(null, ''),
        language_id: Joi.number().required(),
    }).required(),
    avatar: Joi.array().items(
        Joi.string().allow(null, ''),
    )
});
export const addProductSchema = ProductSchema.fork(['avatar'], (schema) => schema.optional())

export const updateProductSchema = ProductSchema.fork(['avatar'], (schema) => schema.optional())

