import {
    Banner,
    BannerTran,
    Languages,
    sequelize
} from '../models';
import { Op } from 'sequelize';
import createError from 'http-errors';
import { DOMAIN } from '../constants/index';
import _languages from '../constants/language';
import {
    addBannerSchema,
    updateOrderBannerSchema
} from '../validators/banner.validator';

/**
 * admin --> To create a new banner
 * @param { require data and files from multipart} req 
 * @param { send data success response} res 
 * @param { if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const createBan = async (req, res, next) => {
    const { files } = req;
    const transaction = await sequelize.transaction();
    try {
        // Parse other_lang if it's a string (multipart/form-data quirk)
        if (typeof req.body.other_lang === 'string') {
            req.body.other_lang = JSON.parse(req.body.other_lang);
        }
        const body = await addBannerSchema.validateAsync(req.body);
        // Check banner
        const banner = await Banner.findOne({ where: { banName: body.banName } }, { transaction: transaction });
        if (banner) {
            throw createError.BadRequest(`This banner ${body.banName} is already exists`);
        }
        // Check tran
        const bannerTran = await BannerTran.findOne({ where: { banName: body.other_lang[0].banName } }, { transaction: transaction });
        if (bannerTran) {
            throw createError.BadRequest(`This bannerTran ${body.other_lang[0].banName} is already exists`);
        }
        // Check lang
        const lang = await Languages.findByPk(body.other_lang[0].language_id, { transaction: transaction });
        if (!lang) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }

        // find last order 
        const orderBan = await Banner.findAll({ limit: 1, order: [['order', 'DESC']] });

        // check file upload
        if (!files[0]) {
            // no files upload
            let imageUrl = `${DOMAIN}/images/defaultBannerImage.png`;

            const newBanner = await Banner.create({
                banName: body.banName,
                order: orderBan.length > 0 ? orderBan[0].order ? orderBan[0].order + 1 : 1 : 1,
                link: body.link,
                image: imageUrl,
                description: body.description,
            }, { transaction: transaction });

            await BannerTran.create({
                bannerId: newBanner.id,
                languageId: body.other_lang[0].language_id,
                banName: body.other_lang[0].banName,
                link: body.other_lang[0].link,
                image: imageUrl,
                description: body.other_lang[0].description,
            }, { transaction: transaction });
            await transaction.commit();

            const responseData = await Banner.findByPk(newBanner.id, {
                include: [{ model: BannerTran, as: 'BannerTrans' }]
            });

            return res.json({
                success: true,
                message: "Created banner successfully",
                data: responseData
            });

        } else {
            // have file upload
            let imageUrl = []
            files.filter(file => file.fieldname == 'avatar[]')
                .forEach((fn) => {
                    imageUrl.push(`${DOMAIN}/images/ban-images/${fn.filename}`);
                });

            let imageUrlTran = []
            files.filter(file => file.fieldname == 'avatar_EN[]')
                .forEach((fn) => {
                    imageUrlTran.push(`${DOMAIN}/images/ban-images/${fn.filename}`);
                });

            const newBanner = await Banner.create({
                banName: body.banName,
                order: orderBan.length > 0 ? orderBan[0].order ? orderBan[0].order + 1 : 1 : 1,
                link: body.link,
                image: imageUrl[0],
                description: body.description,
            }, { transaction: transaction });

            await BannerTran.create({
                bannerId: newBanner.id,
                languageId: body.other_lang[0].language_id,
                banName: body.other_lang[0].banName,
                link: body.other_lang[0].link,
                image: imageUrlTran[0],
                description: body.other_lang[0].description,
            }, { transaction: transaction });
            await transaction.commit();

            const responseData = await Banner.findByPk(newBanner.id, {
                include: [{ model: BannerTran, as: 'BannerTrans' }]
            });
            console.log("responseData", responseData);
            return res.json({
                success: true,
                message: "Created banner successfully",
                data: responseData,
            });
        }
    } catch (error) {
        console.log("error==>", error);
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * admin --> To update banner
 * @param { require id, data and files from multipart} req
 * @param { send data success response} res
 * @param { if error is true} next
 * @type mothod POST
 * @access private
 * @returns
 */
export const updateBan = async (req, res, next) => {
    const { id } = req.params;
    const { body, files } = req;
    const transaction = await sequelize.transaction();
    try {
        // Parse other_lang if it's a string (multipart/form-data quirk)
        if (typeof body.other_lang === 'string') {
            body.other_lang = JSON.parse(body.other_lang);
        }
        // check uniqueBan
        const uniqueBan = await Banner.findAll({ where: { banName: body.banName, id: { [Op.ne]: id } } }, { transaction: transaction });
        if (uniqueBan[0]) throw createError.BadRequest(`This name ban ${body.banName} already taken`);
        // check uniqueBanTran
        const uniqueBanTran = await BannerTran.findAll({ where: { banName: body.other_lang[0].banName, id: { [Op.ne]: id } } }, { transaction: transaction });
        if (uniqueBanTran[0]) throw createError.BadRequest(`This name ban tran ${body.other_lang[0].banName} already taken`);

        // Check banner
        const banner = await Banner.findByPk(id, { transaction: transaction });
        if (!banner) {
            throw createError.NotFound(`Banner does not exist. with ID:${id}`);
        }
        // Check lang
        const lang = await Languages.findByPk(body.other_lang[0].language_id, { transaction: transaction });
        if (!lang) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }

        if (!files[0]) {

            banner.banName = body.banName;
            banner.link = body.link;
            banner.description = body.description;
            await banner.save();
            // update tran
            await BannerTran.update({
                banName: body.other_lang[0].banName,
                link: body.other_lang[0].link,
                description: body.other_lang[0].description,
            }, { where: { bannerId: id } }, { transaction: transaction });
            await transaction.commit();

            const responseData = await Banner.findByPk(id, {
                include: [{ model: BannerTran, as: 'BannerTrans' }]
            });

            return res.json({
                success: true,
                message: `Updated Baner ID:${id} successfully`,
                data: responseData
            });

        } else {

            let imageUrl = []
            files.filter(file => file.fieldname == 'avatar[]')
                .forEach((fn) => {
                    imageUrl.push(`${DOMAIN}/images/ban-images/${fn.filename}`);
                });

            let imageUrlTran = []
            files.filter(file => file.fieldname == 'avatar_EN[]')
                .forEach((fn) => {
                    imageUrlTran.push(`${DOMAIN}/images/ban-images/${fn.filename}`);
                });

            banner.banName = body.banName;
            banner.link = body.link;
            banner.image = imageUrl[0],
                banner.description = body.description;
            await banner.save();
            // update tran
            await BannerTran.update({
                banName: body.other_lang[0].banName,
                link: body.other_lang[0].link,
                image: imageUrlTran[0],
                description: body.other_lang[0].description,
            }, { where: { bannerId: id } }, { transaction: transaction });
            await transaction.commit();

            const responseData = await Banner.findByPk(id, {
                include: [{ model: BannerTran, as: 'BannerTrans' }]
            });

            return res.json({
                success: true,
                message: `Updated Baner ID:${id} successfully`,
                data: responseData
            });
        }

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

/**
 * admin --> To update order banner by id
 * @param {* require id from request body} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod POST
 * @access private
 * @returns
 */
export const updateOrderBan = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const body = await updateOrderBannerSchema.validateAsync(req.body);

        await Promise.all(body.map(async (item, index) => {
            let inDex = index + 1;
            await Banner.update({
                order: inDex,
            }, { where: { id: item.id } }, { transaction: transaction });
        }));
        await transaction.commit();

        const responseData = await Banner.findAll({ order: [['order', 'ASC']] });

        return res.json({
            success: true,
            message: "Updated order banner successfully",
            data: responseData,
        });

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * client --> To get all order banner
 * @param {* require language from request} req
 * @param {* send data success response} res
 * @param {* if error is true} next
 * @type mothod GET
 * @access public
 * @returns
 */
export const findByOrderBan = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            // eng
            const banner = await Banner.findAll({
                include: [{ model: BannerTran, as: 'BannerTrans' }], order: [['order', 'ASC']]
            });

            return res.json({
                success: true,
                message: "Get data order banner successfully",
                data: banner,
            });
        }
        // la
        const banner = await Banner.findAll({ order: [['order', 'ASC']] });

        return res.json({
            success: true,
            message: "Get data all banner successfully",
            data: banner,
        });

    } catch (error) {
        next(error);
    }
}

/**
 * admin --> To get all of banner
 * @param { require language from request} req
 * @param { send data success response} res
 * @param { if error is true} next
 * @type mothod GET
 * @access public
 * @returns
 */
export const findBan = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            // eng
            const banner = await Banner.findAll({
                include: [{ model: BannerTran, as: 'BannerTrans' }], order: [['id', 'DESC']]
            });

            return res.json({
                success: true,
                message: "Get data all banner successfully",
                data: banner,
            });
        }
        // la
        const banner = await Banner.findAll({ order: [['id', 'DESC']] });

        return res.json({
            success: true,
            message: "Get data all banner successfully",
            count: banner.length,
            data: banner,
        });

    } catch (error) {
        next(error);
    }
}

/**
 * To get a banner
 * @param { require id and language from request} req
 * @param { send data success response} res
 * @param { if error is true} next
 * @type mothod GET
 * @access public
 * @returns
 */
export const findOneBan = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            // eng
            const banner = await Banner.findByPk(id, {
                include: [{ model: BannerTran, as: 'BannerTrans' }]
            });
            if (!banner) {
                throw createError.NotFound(`Banner does not exist. with ID:${id}`);
            }
            return res.json({
                success: true,
                message: "Get a banner successfully",
                data: banner,
            });
        }
        // la
        const banner = await Banner.findByPk(id);
        if (!banner) {
            throw createError.NotFound(`Banner does not exist. with ID:${id}`);
        }
        return res.json({
            success: true,
            message: "Get a banner successfully",
            data: banner,
        });

    } catch (error) {
        next(error);
    }
}

/**
 * To delete a banner
 * @param { require id  request} req
 * @param { send data success response} res
 * @param { if error is true} next
 * @type mothod DELETE
 * @access private
 * @returns
 */
export const deleteBan = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const banner = await Banner.findByPk(id, { transaction: transaction });
        if (!banner) {
            throw createError.NotFound(`Banner does not exist. with ID:${id}`);
        }

        await BannerTran.destroy({ where: { bannerId: id } }, { transaction: transaction });
        await banner.destroy();
        await transaction.commit();
        return res.json({
            success: true,
            message: `Delete Banner ID:${id} successfully`
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}


// MEAN : filter where find banner banName

export const findBanName = async (req, res, next) => {
    try {
        const banName = req.query.banName;

        const data = await Banner.findAll({
            where: {
                banName: {
                    [Op.like]: `${banName}%`
                },
            },
            include: [{ model: BannerTran, as: 'BannerTrans' }]
        });

        return res.json({
            success: true,
            message: "Get all banner by name successfully",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};
