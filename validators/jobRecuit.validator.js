import Joi from 'joi';

const JobRecuitSchema = Joi.object({
    postId: Joi.number().required(),
    positionId: Joi.number().required(),
    name: Joi.string().required(),
    surName: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().min(6).length(10).pattern(/^[0-9]+$/).required(),
    avatar: Joi.array().items(
        Joi.string().allow(null, ''),
    )
});

export const addJobRecuitSchema = JobRecuitSchema.fork(['avatar',], (schema) => schema.optional())