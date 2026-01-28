import {
    TypePackage,
    TypePackagTran,
    Languages,
    sequelize,
} from '../models';
import { DOMAIN } from '../constants/index';
import createError from 'http-errors';
import _languages from '../constants/language';
import { editTypePackageSchema } from '../validators/package.validator';

export const findTypePackages = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        if (lang !== undefined) {
            // check language
            const language = await Languages.findOne({ where: { short: lang } });
            if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");

            if (language.short === _languages.ENGLISH) {
                // eng
                const typePackages = await TypePackage.findAll({ include: [{ model: TypePackagTran }] });
                return res.json({
                    success: true,
                    messaage: `Get all typePackages success`,
                    data: typePackages
                });
            }
            // la
            const typePackages = await TypePackage.findAll();
            return res.json({
                success: true,
                messaage: `Get all typePackages success`,
                data: typePackages
            });
        } else {
            // undefined lang
            const typePackages = await TypePackage.findAll();
            return res.json({
                success: true,
                messaage: `Get all typePackages success`,
                data: typePackages
            });
        }

    } catch (error) {
        next(error);
    }
}

export const findOneTypePackages = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {

        if (lang !== undefined) {
            // check language
            const language = await Languages.findOne({ where: { short: lang } });
            if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
            if (language.short === _languages.ENGLISH) {
                // eng 
                const typePackage = await TypePackage.findByPk(id, { include: [{ model: TypePackagTran }] });
                if (!typePackage) throw createError.NotFound(`Type package not found. with ID:${id}`);
                return res.json({
                    success: true,
                    message: `Get a type package successfully`,
                    data: typePackage
                });
            }
            // la
            const typePackage = await TypePackage.findByPk(id);
            if (!typePackage) throw createError.NotFound(`Type package not found. with ID:${id}`);
            return res.json({
                success: true,
                message: `Get a type package successfully`,
                data: typePackage
            });
        } else {
            // undefined lang
            const typePackage = await TypePackage.findByPk(id);
            if (!typePackage) throw createError.NotFound(`Type package not found. with ID:${id}`);
            return res.json({
                success: true,
                message: `Get a type package successfully`,
                data: typePackage
            });
        }

    } catch (error) {
        next(error);
    }
}

/**
 * admin --> To update image type package
 * @param {* require id and data from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod PUT
 * @access private
 * @returns 
 */
export const updateTypePackage = async (req, res, next) => {
    const { id } = req.params;
    const { files } = req;
    const transaction = await sequelize.transaction();
    try {
        const body = await editTypePackageSchema.validateAsync(req.body);

        // check language
        const lang = await Languages.findByPk(body.language_id, { transaction: transaction });
        if (!lang) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");

        const typePackage = await TypePackage.findByPk(id, { transaction: transaction });
        if (!typePackage) throw createError.NotFound(`Type package not found. with ID:${id}`);

        if (!files[0]) {
            // no files
            typePackage.image = typePackage.image;
            typePackage.save();
            await transaction.commit();

            let responseData = await TypePackage.findByPk(id, { include: [{ model: TypePackagTran }] });

            return res.json({
                success: true,
                message: `Updated type package ID:${id} success`,
                data: responseData
            });

        } else {
            // filter 
            let imageUrl = []
            files.filter(file => file.fieldname == 'avatar')
                .forEach((fn) => {
                    imageUrl.push(`${DOMAIN}/images/typePackage-images/${fn.filename}`);
                });

            let imageUrlTran = []
            files.filter(file => file.fieldname == 'avatar_EN')
                .forEach((fn) => {
                    imageUrlTran.push(`${DOMAIN}/images/typePackage-images/${fn.filename}`);
                });

            typePackage.image = imageUrl[0]
            await typePackage.save();

            await TypePackagTran.update({
                image: imageUrlTran[0]
            }, { where: { typePackage_Id: id, languageId: lang.id } }, { transaction: transaction });
            await transaction.commit();

            let responseData = await TypePackage.findByPk(id, { include: [{ model: TypePackagTran }] });

            return res.json({
                success: true,
                message: `Updated type package ID:${id} success`,
                data: responseData
            });
        }

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}