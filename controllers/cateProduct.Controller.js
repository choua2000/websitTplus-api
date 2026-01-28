import {
    CateProducts,
    CateProductTran,
    ProductCategory,
    Languages,
    sequelize
} from '../models';
import { Op } from 'sequelize';
import createError from 'http-errors';
import _languages from '../constants/language';
import { makeSlugify } from '../libs/utils/regex';
import { addCateProduct, updateCateProductSchema } from '../validators/cateProduct.validator';

/**
 * To created new category product
 * @param {*require data from body request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const createCateProduct = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const body = await addCateProduct.validateAsync(req.body);
        const slug = makeSlugify(body.cateName);
        const slugTran = makeSlugify(body.other_lang[0].cateName);

        // Check duplicate category product
        const cateProduct = await CateProducts.findOne({
            where:
                { cateName: body.cateName }
        }, { transaction: transaction });
        if (cateProduct) {
            await transaction.rollback();
            return res.status(200).json({ success: false, message: `This category production:${body.cateName} is already exists` });
        }

        // Check duplicate category product tran
        const cateProductTran = await CateProductTran.findOne({
            where:
                { cateName: body.other_lang[0].cateName }
        }, { transaction: transaction });
        if (cateProductTran) throw createError.BadRequest(`This category production: ${body.other_lang[0].cateName } is already taken`)

        // Check lang
        const lang = await Languages.findByPk(body.other_lang[0].language_id, { transaction: transaction });
        if (!lang) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }

        // create category product
        const newCateProduct = await CateProducts.create({
            cateName: body.cateName,
            description: body.description,
            slug: slug,
        }, { transaction: transaction });
        // create tran
        await CateProductTran.create({
            cateProductId: newCateProduct.id,
            languageId: body.other_lang[0].language_id,
            cateName: body.other_lang[0].cateName,
            description: body.other_lang[0].description,
            slug: slugTran,
        }, { transaction: transaction });

        // response
        const responseData = await CateProducts.findByPk(newCateProduct.id, {
            include:
                [{ model: CateProductTran, as: 'CateProductTrans' }], transaction: transaction
        });

        await transaction.commit();
        return res.json({
            success: true,
            message: `Created Category Production:${body.cateName} successfully`,
            NewCateProduct: responseData
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * To get all categories production
 * @param {*required status language from headers request} req 
 * @param {* send data success response} res 
 * @param {*if error is true} next 
 * @type method GET
 * @access public
 * @returns 
 */
export const findCateProduct = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            // eng
            const cateProduct = await CateProducts.findAll({
                include:
                    [{ model: CateProductTran, as: 'CateProductTrans' }], order: [['id', 'DESC']]
            });

            return res.json({
                success: true,
                message: `Get all category products successfully`,
                data: cateProduct
            });
        }
        // la
        const cateProduct = await CateProducts.findAll({ order: [['id', 'DESC']] });

        return res.json({
            success: true,
            message: `Get all category products successfully`,
            data: cateProduct
        });
    } catch (error) {
        next(error);
    }
}

/**
 * To get One categories production
 * @param {*required  id and status language from headers request} req 
 * @param {* response data} res 
 * @param {*if error is true} next 
 * @type method GET
 * @access public
 * @returns 
 */
export const findOneCateProduct = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        // Check lang
        if (language.short === _languages.ENGLISH) {
            // eng
            const cateProduct = await CateProducts.findByPk(id, {
                include:
                    [{ model: CateProductTran, as: 'CateProductTrans' }]
            });
            if (!cateProduct) {
                throw createError.NotFound(`Category product not found. with ID:${id}`);
            }
            return res.json({
                success: true,
                message: `Get a category products ID:${id} successfully`,
                data: cateProduct
            });
        }
        // la
        const cateProduct = await CateProducts.findByPk(id);
        if (!cateProduct) {
            throw createError.NotFound(`Category product not found. with ID:${id}`);
        }
        return res.json({
            success: true,
            message: `Get a category products ID:${id} successfully`,
            data: cateProduct
        });
    } catch (error) {
        next(error);
    }
}

export const findCateProductBySlug = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        // Check lang
        if (language.short === _languages.ENGLISH) {
            // eng
            let cateProduct = await CateProducts.findOne({
                where: { slug: id },
                include:
                    [{ model: CateProductTran, as: 'CateProductTrans' }]
            });
            if (!cateProduct) {

                cateProduct = await CateProducts.findOne({
                    include:
                        [{ model: CateProductTran, where: { slug: id }, required: true, as: 'CateProductTrans' }]
                });

                if (!cateProduct) throw createError.NotFound(`Category product not found. with ID:${id}`);
            }
            return res.json({
                success: true,
                message: `Get a category products ID:${id} successfully`,
                data: cateProduct
            });
        }
        // la
        const cateProduct = await CateProducts.findOne({ where: { slug: id } });
        if (!cateProduct) {
            throw createError.NotFound(`Category product not found. with ID:${id}`);
        }
        return res.json({
            success: true,
            message: `Get a category products ID:${id} successfully`,
            data: cateProduct
        });
    } catch (error) {
        next(error);
    }
}


/**
 *  admin --> To update categories product
 * @param {* require id and data from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod PUT
 * @access private
 */
export const updateCateProduct = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const body = await updateCateProductSchema.validateAsync(req.body);
        const slug = makeSlugify(body.cateName);
        const slugTran = makeSlugify(body.other_lang[0].cateName);

        // check unique category product
        const uniqueCateProduct = await CateProducts.findAll({ where: { cateName: body.cateName, id: { [Op.ne]: id } } });
        if (uniqueCateProduct[0]) throw createError.BadRequest(`This category product ${body.cateName} is already taken`);

        // check unique category product trans
        const uniqueCateProductTran = await CateProductTran.findAll({ where: { cateName: body.other_lang[0].cateName, cateProductId: { [Op.ne]: id } } });
        if (uniqueCateProductTran[0]) throw createError.BadRequest(`This category product tran ${body.other_lang[0].cateName} is already taken`);

        // Check category products
        const cateProduct = await CateProducts.findByPk(id, { transaction: transaction });
        if (!cateProduct) {
            throw createError.NotFound(`Category product does not exist. with ID:${id}`);
        }

        // update category Product
        cateProduct.cateName = body.cateName;
        cateProduct.description = body.description;
        cateProduct.slug = slug;
        await cateProduct.save();

        // update tran
        await CateProductTran.update({
            cateName: body.other_lang[0].cateName,
            description: body.other_lang[0].description,
            slug: slugTran,
        }, { where: { cateProductId: id } }, { transaction: transaction });

        // response
        const responseData = await CateProducts.findByPk(id, {
            include:
                [{ model: CateProductTran, as: 'CateProductTrans' }]
        });

        await transaction.commit();
        return res.json({
            success: true,
            message: `Updated category production ID:${id} successfully`,
            data: responseData
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/** 
 * To delete a category production
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const deleteCateProduct = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const productCategories = await ProductCategory.findAll({ where: { cateProductId: id } }, { transaction: transaction });
        if (productCategories.length > 0) {
            throw createError.BadRequest(`Unable to delete ID:${id} at this time. Because the productCategories table is active`);
        }

        const cateProduct = await CateProducts.findByPk(id, { transaction: transaction });
        if (!cateProduct) {
            throw createError.NotFound(`Categorie product does not exist. with ID:${id}`)
        }

        // const cateProductTran = await CateProductTran.findOne({ where: { cateProductId: id } }, { transaction: transaction }););
        // if (!cateProductTran) {
        //     throw createError.NotFound(`Categorie productTran does not exist. with ID:${id}`)
        // }
        await CateProductTran.destroy({ where: { cateProductId: id } }, { transaction: transaction });
        await cateProduct.destroy();
        await transaction.commit();
        return res.json({
            success: true,
            message: `Delete category production ID: ${id} successfully`
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}