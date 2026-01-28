import { Languages } from '../models';
import createError from 'http-errors';

export const findLanguage = async (req, res, next) => {
    try {
        const lang = await Languages.findAll();
        if (!lang[0]) {
            throw createError.NotFound("Now language is empty");
        }
        return res.json({
            success: true,
            message: "Get all languages successfully",
            data: lang
        });
    } catch (error) {
        next(error);
    }
}

export const findOneLanguage = async (req, res, next) => {
    const { id } = req.params;
    try {
        const lang = await Languages.findByPk(id);
        if (!lang) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.")
        }
        return res.json({
            success: true,
            message: `Get one language successfully`,
            data: lang,
        });
    } catch (error) {
        next(error);
    }
}