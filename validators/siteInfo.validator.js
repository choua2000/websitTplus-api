import Joi from 'joi';

const siteInfoSchemaA = Joi.object({
    siteName: Joi.string().required(),
    address: Joi.string().allow(null, ''),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'la', 'org'] } }),
    phone: Joi.string().allow(null, ''),
    facebook: Joi.string().allow(null, ''),
    description: Joi.string().allow(null, ''),
    other_lang: Joi.array().items({
        siteName: Joi.string().required(),
        address: Joi.string().allow(null, ''),
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

export const updateSiteInfoSchema = siteInfoSchemaA.fork(['avatar', 'avatar_EN'], (schema) => schema.optional())