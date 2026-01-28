import { TitleContact, TitleContactTran, Languages, sequelize } from '../models';
import { Op } from 'sequelize';
import createError from 'http-errors';
import { TitleContactSchemata } from '../validators/titleContact.validator';
import _languages from '../constants/language';

/**
 * admin --> To create a new
 * @param {* require data from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const create = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const body = await TitleContactSchemata.validateAsync(req.body);
        // check duplicate title contact
        const titleContact = await TitleContact.findOne({ where: { title: body.title } }, { transaction: transaction });
        if (titleContact) throw createError.BadRequest(`This title ${body.title} already exists`);

        // check duplicate title contact tran
        const titleContactTran = await TitleContactTran.findOne({ where: { title: body.other_lang[0].title } }, { transaction: transaction });
        if (titleContactTran) throw createError.BadRequest(`This title tran ${body.other_lang[0].title} already exists`);

        // check lang
        const lang = await Languages.findByPk(body.other_lang[0].language_id, { transaction: transaction });
        if (!lang) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");

        const newTitleContact = await TitleContact.create({
            title: body.title,
            description: body.description ? body.description : null,
        }, { transaction: transaction });

        await TitleContactTran.create({
            titleContact_Id: newTitleContact.id,
            languageId: lang.id,
            title: body.other_lang[0].title,
            description: body.other_lang[0].description ? body.other_lang[0].description : null,
        }, { transaction: transaction });
        await transaction.commit();

        const responseData = await TitleContact.findByPk(newTitleContact.id, { include: [{ model: TitleContactTran }] });

        return res.json({
            success: true,
            message: `Create new titleContact ${body.title} successfully`,
            data: responseData,
        });


    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * admin --> To update
 * @param {* require id and data from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod PUT
 * @access private
 * @returns 
 */
export const update = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const body = await TitleContactSchemata.validateAsync(req.body);
        // check duplicate title contact
        const uniqueTitleContact = await TitleContact.findAll({ where: { title: body.title, id: { [Op.ne]: id } } });
        if (uniqueTitleContact[0]) throw createError.BadRequest(`This title contact ${body.title} is already taken`);

        // check duplicate title contact
        const uniqueTitleContactTran = await TitleContactTran.findAll({
            where: { title: body.other_lang[0].title, titleContact_Id: { [Op.ne]: id } }
        });
        if (uniqueTitleContactTran[0]) throw createError.BadRequest(`This title contact tran ${body.other_lang[0].title} is already taken`);

        // check lang
        const language = await Languages.findByPk(body.other_lang[0].language_id);
        if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");

        // update 
        const titleContact = await TitleContact.findByPk(id, { transaction: transaction });
        if (!titleContact) throw createError.NotFound(`Title not found. with ID:${id}`);

        titleContact.title = body.title;
        titleContact.description = body.description ? body.description : titleContact.description;
        await titleContact.save();

        await TitleContactTran.update({
            title: body.other_lang[0].title,
            description: body.other_lang[0].description ? body.other_lang[0].description : null,
        }, { where: { titleContact_Id: id, languageId: language.id } }, { transaction: transaction });
        await transaction.commit();

        const responseData = await TitleContact.findByPk(id, { include: [{ model: TitleContactTran }] });

        return res.json({
            success: true,
            message: `Updated titleContact ID: ${id} successfully`,
            data: responseData,
        });

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

export const find = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    const filter = req.query.filter;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");

        if (filter === undefined || !filter.length > 0) { // null

            if (language.short === _languages.ENGLISH) {
                // eng
                const titleContacts = await TitleContact.findAll({ include: [{ model: TitleContactTran }], order: [['id', 'DESC']] });
                return res.json({
                    success: true,
                    message: `Get all titleContact success`,
                    data: titleContacts
                });
            }
            // la
            const titleContacts = await TitleContact.findAll({ order: [['id', 'DESC']] });
            return res.json({
                success: true,
                message: `ດຶງຂໍ້ມູນຫົວຂໍ້ຕິດຕໍ່ສຳເລັດ`,
                data: titleContacts
            });

        } else {
            // todo: search
            return res.json({
                message: `have data`
            });
        }


    } catch (error) {
        next(error);
    }
}

export const findOne = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");

        if (language.short === _languages.ENGLISH) {
            // eng
            const titleContact = await TitleContact.findByPk(id, { include: [{ model: TitleContactTran }] });
            if (!titleContact) throw createError.NotFound(`Title not found. with ID:${id}`);
            return res.json({
                success: true,
                message: `Get a titleContact success`,
                data: titleContact
            });
        }
        // la
        const titleContact = await TitleContact.findByPk(id);
        if (!titleContact) throw createError.NotFound(`Title not found. with ID:${id}`);
        return res.json({
            success: true,
            message: `Get a titleContact success`,
            data: titleContact
        });

    } catch (error) {
        next(error);
    }
}

export const deleteTitle = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const titleContact = await TitleContact.findByPk(id, { transaction: transaction });
        if (!titleContact) throw createError.NotFound(`Title not found. with ID:${id}`);
        await TitleContactTran.destroy({ where: { titleContact_Id: id } }, { transaction: transaction });
        await titleContact.destroy();
        await transaction.commit();
        return res.json({
            success: true,
            message: `Delete title contact ID:${id} successfully`
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}