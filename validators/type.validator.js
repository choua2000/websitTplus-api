import Joi from "joi";

export const createTypeJobSchema = Joi.object({
    name: Joi.string().required(),
});
