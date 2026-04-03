import Joi from "joi";

const educationSchema = Joi.object({
    university_name: Joi.string().required(),
    qualification: Joi.string().required(),
    major: Joi.string().required(),
    sort_order: Joi.number().integer().optional()
});

const trainingSchema = Joi.object({
    company_name: Joi.string().allow(null, '').optional(),
    department: Joi.string().allow(null, '').optional(),
    main_duty: Joi.string().allow(null, '').optional(),
    duration: Joi.string().allow(null, '').optional(),
    sort_order: Joi.number().integer().allow(null).optional()
});

const workExperienceSchema = Joi.object({
    from_to: Joi.string().allow(null, '').optional(),
    salary: Joi.string().allow(null, '').optional(),
    position: Joi.string().allow(null, '').optional(),
    employer_name: Joi.string().allow(null, '').optional(),
    employer_address: Joi.string().allow(null, '').optional(),
    duties_description: Joi.string().allow(null, '').optional(),
    reason_for_leaving: Joi.string().allow(null, '').optional(),
    sort_order: Joi.number().integer().allow(null).optional()
});

const documentSchema = Joi.object({
    file_name: Joi.string().allow(null, '').optional(),
    file_path: Joi.string().allow(null, '').optional(),
    file_type: Joi.string().allow(null, '').optional(),
    file_size: Joi.number().integer().allow(null).optional()
});


const referenceSchema = Joi.object({
    ref_name: Joi.string().allow(null, '').optional(),
    ref_occupation: Joi.string().allow(null, '').optional(),
    ref_company: Joi.string().allow(null, '').optional(),
    ref_address_tel: Joi.string().allow(null, '').optional(),
});


const imageSchema = Joi.object({
    image: Joi.string().required()
});

export const createJobApplicationSchema = Joi.object({
    job_id: Joi.number().integer().required(),
    photo_url: Joi.string().allow('', null).optional(), // 3x4 photo upload
    name_and_surname: Joi.string().required(), // first_name + last_name
    date_of_birth: Joi.date().iso().required(),
    place_of_birth: Joi.string().required(),
    current_address: Joi.string().required(),
    village: Joi.string().required(),
    district: Joi.string().required(),
    province: Joi.string().required(),
    contact_number: Joi.string()
        .pattern(/^[0-9]{8,15}$/) // only digits, 8–15 numbers
        .required()
        .messages({
            "string.pattern.base": "Phone number must contain only digits (8–15 numbers)"
        }), // phone
    email: Joi.string()
        .email({ tlds: { allow: false } }) // allow gmail, yahoo, etc.
        .required()
        .messages({
            "string.email": "Invalid email format"
        }),
    nationality: Joi.string().required(),
    marital_status: Joi.string().valid('Single', 'Married', 'Divorced', 'Widowed').required(),
    sex: Joi.string().valid('Male', 'Female', 'Other').required(),
    how_know_job: Joi.string().optional(),
    salary_expecting: Joi.string().required(),
    signature: Joi.string().required(),
    signature_date: Joi.date().iso().required(),
    document: Joi.string().required(),
    status: Joi.string().valid('pending', 'reviewed', 'shortlisted', 'rejected', 'hired').default("pending"),

    // Nested Arrays/Objects
    educations: Joi.array().items(educationSchema).min(1).required(),
    trainings: Joi.array().items(trainingSchema).allow(null, '').optional(),
    workExperiences: Joi.array().items(workExperienceSchema).allow(null, '').optional(),
    reference: referenceSchema.allow(null, '').optional(),
});

