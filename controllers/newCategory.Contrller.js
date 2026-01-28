import {
    NewsCategory,
    NewsCategoryTran,
    Languages,
    sequelize
} from '../models';
import { Op } from 'sequelize';
import createError from 'http-errors';
import { addNewCateSchema } from '../validators/newCategory.validator';
import _languages from '../constants/language';

/**
 * admin --> To create new category
 * @param {* require data from request body} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const createNewsCategory = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const body = await addNewCateSchema.validateAsync(req.body);

        const newCate = await NewsCategory.findOne({ where: { name: body.name } }, { transaction: transaction });
        if (newCate) throw createError.BadRequest(`This news category name: ${body.name} is already exists`);

        const newCateTran = await NewsCategoryTran.findOne({ where: { name: body.other_lang[0].name } }, { transaction: transaction });
        if (newCateTran) throw createError.BadRequest(`This news category tran name: ${body.other_lang[0].name} already exists`);

        // check if language
        const lang = await Languages.findByPk(body.other_lang[0].language_id, { transaction: transaction });
        if (!lang) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");

        const newCategorie = await NewsCategory.create({
            name: body.name,
        }, { transaction: transaction });

        await NewsCategoryTran.create({
            newsCategoryId: newCategorie.id,
            languageId: body.other_lang[0].language_id,
            name: body.other_lang[0].name,
        }, { transaction: transaction });
        await transaction.commit();

        let responseData = await NewsCategory.findByPk(newCategorie.id, { include: [{ model: NewsCategoryTran, as: 'NewsCategoryTrans' }] });

        return res.json({
            success: true,
            message: `Created news category: ${body.name} successfully`,
            data: responseData,
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * admin --> To updated new category
 * @param {* require id and data from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod PUT
 * @access private
 * @returns 
 */
export const updateNewsCategory = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const body = await addNewCateSchema.validateAsync(req.body);

        // check uniqueNewCategory
        const uniqueNewCategory = await NewsCategory.findAll({
            where:
                { name: body.name, id: { [Op.ne]: id } }
        }, { transaction: transaction });
        if (uniqueNewCategory[0]) throw createError.BadRequest(`This new category name ${body.name} is already taken`);

        // check uniqueNewCategory tran
        const uniqueNewCategoryTran = await NewsCategoryTran.findAll({
            where:
                { name: body.other_lang[0].name, newsCategoryId: { [Op.ne]: id } }
        }, { transaction: transaction });
        if (uniqueNewCategoryTran[0]) throw createError.BadRequest(`This new categoryTran name ${body.other_lang[0].name} is already taken`);

        // check if language
        const lang = await Languages.findByPk(body.other_lang[0].language_id, { transaction: transaction });
        if (!lang) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");

        const newCate = await NewsCategory.findByPk(id, { transaction: transaction })
        if (!newCate) throw createError.NotFound(`This new category does not exist. with ID:${id}`);
        newCate.name = body.name;
        await newCate.save();

        await NewsCategoryTran.update({
            name: body.other_lang[0].name,
        }, { where: { newsCategoryId: id, languageId: body.other_lang[0].language_id } }, { transaction: transaction });
        await transaction.commit();

        let responseData = await NewsCategory.findByPk(id, { include: [{ model: NewsCategoryTran, as: 'NewsCategoryTrans' }] });

        return res.json({
            success: true,
            message: `Updated news category ID ${id} successfully`,
            data: responseData,
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * admin & client --> To get all new category
 * @param {* require language from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findNewsCategory = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });

        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }

        if (language.short === _languages.ENGLISH) {
            // eng
            const newCate = await NewsCategory.findAll({ include: [{ model: NewsCategoryTran }], order: [['id', 'DESC']] });

            return res.json({
                success: true,
                message: `Get all new categories english successfully`,
                data: newCate
            });
        }
        // la
        const newCate = await NewsCategory.findAll({ order: [['id', 'DESC']] });

        return res.json({
            success: true,
            message: `Get all new categories lao successfully`,
            data: newCate
        });

    } catch (error) {
        next(error);
    }
}

/**
 * admin --> To get a new category
 * @param {* require id and language from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findOneNewsCategory = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }

        if (language.short === _languages.ENGLISH) {
            // eng
            const newCategory = await NewsCategory.findByPk(id, { include: [{ model: NewsCategoryTran }] })
            if (!newCategory) throw createError.NotFound(`This new category does not exist. with ID:${id}`);

            return res.json({
                success: true,
                message: `Get one news category english language successfully`,
                data: newCategory
            });
        }
        // la

        const newCategory = await NewsCategory.findByPk(id)
        if (!newCategory) throw createError.NotFound(`This new category does not exist. with ID:${id}`);

        return res.json({
            success: true,
            message: `Get one news category lao language successfully`,
            data: newCategory
        });

    } catch (error) {
        next(error);
    }
}

export const deleteNewsCategory = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const newCate_instance = await NewsCategory.findByPk(id, { transaction: transaction });
        if (!newCate_instance) throw createError.NotFound(`This new category does not exist. with ID:${id}`);

        await NewsCategoryTran.destroy({ where: { newsCategoryId: id } }, { transaction: transaction });
        await newCate_instance.destroy();
        await transaction.commit();

        return res.json({
            success: true,
            message: `News Category ID: ${id} deleted successfully`,
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}
