import Joi from 'joi';

export const adminUpdateSchema = Joi.object({
    firstName: Joi.string().required(),
    surName: Joi.string().required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'la'] } }),
    username: Joi.string().min(3).required(),
    password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).allow(null, ''),
    status: Joi.string().allow(null, ''),
});

export const clientUpdateSchema = Joi.object({
    firstName: Joi.string().required(),
    surName: Joi.string().required(),
    // email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    // username: Joi.string().min(3).required(),
    // password: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).allow(null, ''),
    status: Joi.string().allow(null, ''),
});
