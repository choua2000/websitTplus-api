import Joi from 'joi';

const BannerFindjobSchema = Joi.object({
    name: Joi.string().allow(null, ''),
    link: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    other_lang: Joi.array().items({
        name: Joi.string().allow(null, ''),
        link: Joi.string().allow(null, ''),
        description: Joi.string().allow(null, ''),
        languageId: Joi.number().required(),
    }),
    avatar: Joi.array().items(
        Joi.any().required(),
    ),
    avatar_EN: Joi.array().items(
        Joi.any().required(),
    )
});

export const addBannerFindjobSchema = BannerFindjobSchema.fork(['avatar', 'avatar_EN'], (schema) => schema.optional());
