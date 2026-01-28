import Joi from 'joi';

const BannerSchema = Joi.object({
    banName: Joi.string().allow(null, ''),
    link: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    other_lang: Joi.array().items({
        banName: Joi.string().allow(null, ''),
        link: Joi.string().allow(null, ''),
        description: Joi.string().allow(null, ''),
        language_id: Joi.number().required(),
    }),
    avatar: Joi.array().items(
        Joi.string().allow(null, ''),
    ),
    avatar_EN: Joi.array().items(
        Joi.string().allow(null, ''),
    )
});
export const addBannerSchema = BannerSchema.fork(['avatar','avatar_EN'], (schema) => schema.optional());

export const updateOrderBannerSchema = Joi.array().items({
    id: Joi.number().required(),
});