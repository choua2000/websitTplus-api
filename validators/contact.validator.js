import Joi from 'joi';

export const contactSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    title: Joi.string().required(),
    description: Joi.string().required(),
});