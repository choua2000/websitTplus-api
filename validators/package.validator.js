import Joi from 'joi';

const PackageSchema = Joi.object({
    typePackage_Id: Joi.number().allow(null, ''),
    catePackage_Id: Joi.number().required(),
    priority: Joi.number().allow(null, ''),
    code: Joi.number().required(),
    name: Joi.string().required(),
    detail: Joi.string().required(),
    other_lang: Joi.array().items({
        name: Joi.string().required(),
        detail: Joi.string().required(),
        language_id: Joi.number().required(),
    }),
    avatar: Joi.string().allow(null, ''),
    avatar_EN: Joi.string().allow(null, ''),
});
export const addPackageSchema = PackageSchema.fork(['avatar', 'avatar_EN'], (schema) => schema.optional());

export const editPackageSchema = PackageSchema.fork(['avatar', 'avatar_EN'], (schema) => schema.optional());

export const addPackageSimTypeSchema = Joi.array().items({
    simTypeId: Joi.number().required(),
});

export const editPriorityPackageSchema = Joi.array().items({
    id: Joi.number().required(),
});

// const CatePackageSchema = Joi.object({
//     catePackageId: Joi.number().required(),
//     name: Joi.string().required(),
//     description: Joi.string().allow(null, ''),
//     other_lang: Joi.array().items({
//         name: Joi.string().min(3).required(),
//         description: Joi.string().allow(null, ''),
//         language_id: Joi.number().required(),
//     }).required(),
//     avatar: Joi.array().items(
//         Joi.string().allow(null, ''),
//     )
// });
// export const addCatePackageSchema = CatePackageSchema.fork(['avatar'], (schema) => schema.optional()) // allow null

// const CatePackageSchemaB = Joi.object({
//     name: Joi.string().required(),
//     description: Joi.string().allow(null, ''),
//     other_lang: Joi.array().items({
//         name: Joi.string().min(3).required(),
//         description: Joi.string().allow(null, ''),
//         language_id: Joi.number().required(),
//     }).required(),
//     avatar: Joi.array().items(
//         Joi.string().allow(null, ''),
//     )
// });
// export const updateCatePackageSchema = CatePackageSchemaB.fork(['avatar'], (schema) => schema.optional()) // allow null

export const topUpSchema = Joi.object({
    telephone: Joi.string().min(6).length(10).pattern(/^[0-9]+$/).required(),
    code: Joi.string().min(6).length(15).pattern(/^[0-9]+$/).required(),
});

export const registerPackgeSchema = Joi.object({
    telephone: Joi.string().min(6).length(10).pattern(/^[0-9]+$/).required(),
    code: Joi.string().min(3).length(3).pattern(/^[0-9]+$/).required(),
    pname: Joi.string().required(),
});

export const transferUpSchema = Joi.object({
    telephone: Joi.string().min(6).length(10).pattern(/^[0-9]+$/).required(),
    code: Joi.number().required(),
});

// validate update typePackage
const editTypePackage = Joi.object({
    avatar: Joi.string().allow(null, ''),
    avatar_EN: Joi.string().allow(null, ''),
    language_id: Joi.number().required(),
});
export const editTypePackageSchema = editTypePackage.fork(['avatar', 'avatar_EN'], (schema) => schema.optional())