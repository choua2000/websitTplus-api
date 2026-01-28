import Joi from 'joi';

const PostSchemaA = Joi.object({
    postTypeId: Joi.number().required(),
    title: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    status: Joi.string().allow(null, ''),
    startDate: Joi.string().allow(null, ''),
    endDate: Joi.string().allow(null, ''),
    other_lang: Joi.array().items({
        title: Joi.string().allow(null, ''),
        description: Joi.string().allow(null, ''),
        language_id: Joi.number().required(),
    }),
    avatar: Joi.array().items(
        Joi.string().allow(null, ''),
    ),
    avatar_EN: Joi.array().items(
        Joi.string().allow(null, ''),
    ),
    newsCategoryId: Joi.array().items(
        Joi.number().allow(null, ''),
    ),

});

export const addPostSchema = PostSchemaA.fork(['avatar', 'avatar_EN'], (schema) => schema.optional())

const PostSchemaB = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().allow(null, ''),
    status: Joi.string().allow(null, ''),
    startDate: Joi.string().allow(null, ''),
    endDate: Joi.string().allow(null, ''),
    other_lang: Joi.array().items({
        title: Joi.string().allow(null, ''),
        description: Joi.string().allow(null, ''),
        language_id: Joi.number().required(),
    }),
    avatar: Joi.array().items(
        Joi.string().allow(null, ''),
    ),
    avatar_EN: Joi.array().items(
        Joi.string().allow(null, ''),
    ),
    newsCategoryId: Joi.array().items(
        Joi.number().allow(null, ''),
    ),
});

export const updatePostSchema = PostSchemaB.fork(['avatar', 'avatar_EN'], (schema) => schema.optional())