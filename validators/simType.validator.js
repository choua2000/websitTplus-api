import Joi from 'joi';

export const addSimTypeSchema = Joi.object({
    mainProduct: Joi.number().required(),
    detail: Joi.string().required(),
});

export const addSimTypePackageSchema = Joi.array().items({
    packageId: Joi.number().required(),
});

// const SimTypeSchema = Joi.object({
//     code: Joi.number().required(),
//     en_name: Joi.string().required(),
//     la_name: Joi.string().required(),
//     avatar: Joi.array().items(
//         Joi.string().allow(null, ''),
//     )
// });

// export const addSimTypeSchema = SimTypeSchema.fork(['avatar'], (schema) => schema.optional());