import {
    CatePackage,
    CatePackageTran,
    Languages,
} from '../models';
import createError from 'http-errors';
import _languages from '../constants/language';

/**
 * Admin --> to get all categories packages
 * This function is used to get all category packages
 * @param req - The request object.
 * @param res - the response object
 * @param next - The next middleware function in the chain.
 * @returns The response is an object that contains the data and a success message.
 */
export const findAllCategory = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        if (lang !== undefined) {
            const language = await Languages.findOne({ where: { short: lang } });
            if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
            if (language.short === _languages.ENGLISH) {
                // eng
                const categoryPackage = await CatePackage.findAll({ include: [{ model: CatePackageTran, as: 'CatePackageTrans' }] });
                return res.json({
                    success: true,
                    message: `Get all data category packages successfully.`,
                    data: categoryPackage
                });
            }
            // la
            const categoryPackage = await CatePackage.findAll();
            return res.json({
                success: true,
                message: `Get all data category packages successfully.`,
                data: categoryPackage
            });

        } else {
            // if not defined lang. will set default language
            const categoryPackage = await CatePackage.findAll();
            return res.json({
                success: true,
                message: `Get all data category packages successfully.`,
                data: categoryPackage
            });
        }

    } catch (error) {
        next(error);
    }
}

export const findOneCategory = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        if (lang !== undefined) {
            const language = await Languages.findOne({ where: { short: lang } });
            if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
            if (language.short === _languages.ENGLISH) {
                // eng
                const categoryPackage = await CatePackage.findByPk(id, { include: [{ model: CatePackageTran, as: 'CatePackageTrans' }] });
                if (!categoryPackage) throw createError.NotFound(`Category Package ID: ${id} does not exist`);
                return res.json({
                    success: true,
                    message: `Get a data category packages successfully.`,
                    data: categoryPackage
                });
            }
            // la
            const categoryPackage = await CatePackage.findByPk(id);
            if (!categoryPackage) throw createError.NotFound(`Category Package ID: ${id} does not exist`);
            return res.json({
                success: true,
                message: `Get a data category packages successfully.`,
                data: categoryPackage
            });

        } else {
            // if not defined lang. will set default language
            const categoryPackage = await CatePackage.findByPk(id);
            if (!categoryPackage) throw createError.NotFound(`Category Package ID: ${id} does not exist`);
            return res.json({
                success: true,
                message: `Get a data category packages successfully.`,
                data: categoryPackage
            });
        }
    } catch (error) {
        next(error);
    }
}