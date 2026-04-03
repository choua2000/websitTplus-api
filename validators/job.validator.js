import Joi from "joi";

export const createJobSchema = Joi.object({
    type_job_id: Joi.number().integer().allow(null),

    title: Joi.string().min(3).required(),

    company: Joi.string().min(2).required(),

    logo_url: Joi.string().allow(null, ""),

    image_details: Joi.string().allow(null, ""),

    location: Joi.string().required(),


    description: Joi.string().min(10).required(),

    type: Joi.string()
        .valid("Full-time", "Part-time", "Contract")
        .required(),

    salary: Joi.string().allow(null, ""),

    start_date: Joi.date().allow(null),

    end_date: Joi.date().allow(null),

    is_active: Joi.boolean().default(true),
});

export const updateJobSchema = Joi.object({
    type_job_id: Joi.number().integer().allow(null),

    title: Joi.string().min(3),

    company: Joi.string().min(2),

    logo_url: Joi.string().allow(null, ""),

    image_details: Joi.string().allow(null, ""),

    location: Joi.string(),

    duration: Joi.string().allow(null, ""),

    description: Joi.string().min(10),

    type: Joi.string()
        .valid("Full-time", "Part-time", "Contract"),

    salary: Joi.string().allow(null, ""),


    start_date: Joi.date().allow(null),

    end_date: Joi.date().allow(null),

    is_active: Joi.boolean(),
});
