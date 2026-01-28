import {
    SiteInfo,
    SiteInfoTran,
    Languages,
    sequelize
} from '../models';
import createError from 'http-errors';
import { DOMAIN } from '../constants/index';
import _languages from '../constants/language';
import { updateSiteInfoSchema } from '../validators/siteInfo.validator';

/**
 * To update the site info
 * @param {require id and data from request} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod PUT
 * @access private
 * @returns 
 */
export const updateSiteInfo = async (req, res, next) => {
    const { id } = req.params;
    const { files } = req;
    const transaction = await sequelize.transaction();
    try {
        const body = await updateSiteInfoSchema.validateAsync(req.body);

        const siteInfo = await SiteInfo.findByPk(id, { transaction: transaction });
        if (!siteInfo) {
            throw createError.NotFound(`Site info does not exist. with ID:${id}`);
        }
        if (!files[0]) {

            siteInfo.siteName = body.siteName;
            siteInfo.address = body.address;
            siteInfo.email = body.email;
            siteInfo.phone = body.phone;
            siteInfo.facebook = body.facebook;
            siteInfo.description = body.description;
            await siteInfo.save();

            await SiteInfoTran.update({
                siteName: body.other_lang[0].siteName,
                address: body.other_lang[0].address,
                description: body.other_lang[0].description,
            }, { where: { siteInfoId: id } }, { transaction: transaction });

            const responseData = await SiteInfo.findByPk(id, {
                include: [{ model: SiteInfoTran, as: 'SiteInfoTrans' }]
            });
            await transaction.commit();
            return res.json({
                success: true,
                message: `No file upload`,
                data: responseData
            });
        } else {

            let imageUrl = []
            files.filter(file => file.fieldname == 'avatar')
                .forEach((fn) => {
                    imageUrl.push(`${DOMAIN}/images/siteInfo-images/${fn.filename}`);
                });

            let imageUrlTran = []
            files.filter(file => file.fieldname == 'avatar_EN')
                .forEach((fn) => {
                    imageUrlTran.push(`${DOMAIN}/images/siteInfo-images/${fn.filename}`);
                });

            siteInfo.websiteLogo = imageUrl[0];
            siteInfo.siteName = body.siteName;
            siteInfo.address = body.address;
            siteInfo.email = body.email;
            siteInfo.phone = body.phone;
            siteInfo.facebook = body.facebook;
            siteInfo.description = body.description;
            await siteInfo.save();

            await SiteInfoTran.update({
                websiteLogo: imageUrlTran[0],
                siteName: body.other_lang[0].siteName,
                address: body.other_lang[0].address,
                description: body.other_lang[0].description,
            }, { where: { siteInfoId: id } }, { transaction: transaction });

            const responseData = await SiteInfo.findByPk(id, {
                include: [{ model: SiteInfoTran, as: 'SiteInfoTrans' }]
            });
            await transaction.commit();
            return res.json({
                success: true,
                message: `Have file upload`,
                data: responseData,
            });
        }
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * To get all the site info
 * @param {require language data from request} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findSiteInfo = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            // eng
            const siteInfo = await SiteInfo.findAll({
                include: [{ model: SiteInfoTran, as: 'SiteInfoTrans' }]
            });
            // if (!siteInfo[0]) {
            //     throw createError.NotFound("Now. site info is empty");
            // }
            return res.json({
                success: true,
                message: "Get data all site info english successfully",
                data: siteInfo
            });
        }
        // la
        const siteInfo = await SiteInfo.findAll();
        // if (!siteInfo[0]) {
        //     throw createError.NotFound("Now. site info is empty");
        // }
        return res.json({
            success: true,
            message: "Get data all site info lao successfully",
            data: siteInfo
        });

    } catch (error) {
        next(error);
    }
}

/**
 * To get one the site info
 * @param {require id and language from request} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findOneSiteInfo = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            // eng
            const siteInfo = await SiteInfo.findByPk(id, {
                include: [{ model: SiteInfoTran, as: 'SiteInfoTrans' }]
            });
            if (!siteInfo) {
                throw createError.NotFound(`Site info does not exist. with ID:${id}`);
            }
            return res.json({
                success: true,
                message: "Get data one site info english successfully",
                data: siteInfo
            });
        }
        // la
        const siteInfo = await SiteInfo.findByPk(id);
        if (!siteInfo) {
            throw createError.NotFound(`Site info does not exist. with ID:${id}`);
        }
        return res.json({
            success: true,
            message: "Get data one site info lao successfully",
            data: siteInfo
        });
    } catch (error) {
        next(error);
    }
}