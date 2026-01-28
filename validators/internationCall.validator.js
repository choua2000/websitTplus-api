import Joi from 'joi';

export const addInternationSchema = Joi.object({
    countryName_la: Joi.string().required(),
    countryName_en: Joi.string().required(),
    code: Joi.number().required(),
    zoneId: Joi.number().required(),
    price_minute: Joi.number().required(),
});

export const editInternationSchema = Joi.object({
    countryName_la: Joi.string().required(),
    countryName_en: Joi.string().required(),
    code: Joi.number().required(),
    zoneId: Joi.number().required(),
    price_minute: Joi.number().required(),
});


export const addZoneSchema = Joi.object({
    zoneName_la: Joi.string().required(),
    zoneName_en: Joi.string().required(),
    description: Joi.string().allow(null, ''),
});