import Joi from 'joi';

export const TitleContactSchemata = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    other_lang: Joi.array().items({
        title: Joi.string().required(),
        description: Joi.string().allow(null, ''),
        language_id: Joi.number().required(),
    }),
});