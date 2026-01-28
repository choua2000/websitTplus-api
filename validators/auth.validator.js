import Joi from 'joi';

export const customerSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    surName: Joi.string().required(),
    phone: Joi.number().min(10).required(),
    password: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")),
});

export const adminSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    surName: Joi.string().min(3).required(),
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'la'] } }),
    phone: Joi.string().min(6).length(10).pattern(/^[0-9]+$/).required(),
    username: Joi.string().min(3).required(),
    password: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")),
});

export const customSignInSchema = Joi.object({
    phone: Joi.string().min(6).length(10).pattern(/^[0-9]+$/).required(),
    password: Joi.string().required(),
});

export const verificationSchema = Joi.object({
    phone: Joi.string().min(6).length(10).pattern(/^[0-9]+$/).required(),
    otp: Joi.string().min(6).length(6).pattern(/^[0-9]+$/).required(),
});

export const forgetPswSchema = Joi.object({
    phone: Joi.string().min(6).length(10).pattern(/^[0-9]+$/).required(),
})

export const resetPswSchema = Joi.object({
    phone: Joi.string().min(6).length(10).pattern(/^[0-9]+$/).required(),
    otp: Joi.string().min(6).length(6).pattern(/^[0-9]+$/).required(),
    newPassword: Joi.string().min(8).pattern(new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})")),
});
