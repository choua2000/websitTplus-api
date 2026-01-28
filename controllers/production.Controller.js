import {
    Product,
    ProductTran,
    CateProducts,
    CateProductTran,
    ProductCategory,
    ProductImage,
    Languages,
    sequelize,
} from '../models';
import { Op } from 'sequelize';
import createError from 'http-errors';
import _languages from '../constants/language';
import { makeSlugify } from '../libs/utils/regex';
import { DOMAIN } from '../constants/index';
import { addProductSchema, updateProductSchema } from '../validators/product.validator';

/**
 * To create a new production
 * @param {*require data from request body} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const createProduct = async (req, res, next) => {
    const { files } = req;
    const transaction = await sequelize.transaction();
    try {
        const body = await addProductSchema.validateAsync(req.body);
        const slug = makeSlugify(body.productName);
        const slugTran = makeSlugify(body.other_lang[0].productName);
        const categeryProductId = body.cateProductId
        // Check post
        const product = await Product.findOne({ where: { productName: body.productName } }, { transaction: transaction });
        if (product) {
            await transaction.rollback();
            return res.status(200).json({ success: false, message: `This production:${body.productName} is already exists` });
        }
        // Check product tran exists
        const productTran = await ProductTran.findOne({ where: { productName: body.other_lang[0].productName } }, { transaction: transaction });
        if (productTran) throw createError.BadRequest(`This production tran ${body.other_lang[0].productName} is already exists`);

        // Check language
        const lang = await Languages.findByPk(body.other_lang[0].language_id, { transaction: transaction });
        if (!lang) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (!files[0]) {
            // no files
            let imgUrl = `${DOMAIN}/images/defaultProduction.jpg`;
            // create production
            const newProduction = await Product.create({
                productName: body.productName,
                description: body.description,
                slug: slug
            }, { transaction: transaction });
            // create tran
            await ProductTran.create({
                productId: newProduction.id,
                languageId: body.other_lang[0].language_id,
                productName: body.other_lang[0].productName,
                description: body.other_lang[0].description,
                slug: slugTran
            }, { transaction: transaction });
            // issert image
            await ProductImage.create({
                productId: newProduction.id,
                image: imgUrl
            }, { transaction: transaction });

            // insert multi product category
            await Promise.all(categeryProductId.map(async (item) => {
                await ProductCategory.create({ productId: newProduction.id, cateProductId: item }, { transaction: transaction });
            }));

            const responseData = await Product.findByPk(newProduction.id, {
                include:
                    [
                        { model: ProductTran, as: 'ProductTrans' },
                        { model: ProductImage, as: 'ProductImages' },
                        { model: CateProducts, as: 'cateProducts', include: [{ model: CateProductTran }] }
                    ], transaction: transaction
            });
            await transaction.commit();

            return res.json({
                success: true,
                message: "Created new production successfully",
                data: responseData
            });

        } else {
            // have files
            const imageUrl = files.map((fn) => {
                return `${DOMAIN}/images/production-images/${fn.filename}`;
            });
            // create production
            const newProduction = await Product.create({
                productName: body.productName,
                description: body.description,
                slug: slug
            }, { transaction: transaction });

            // create tran
            await ProductTran.create({
                productId: newProduction.id,
                languageId: body.other_lang[0].language_id,
                productName: body.other_lang[0].productName,
                description: body.other_lang[0].description,
                slug: slugTran
            }, { transaction: transaction });

            // insert multi image
            await Promise.all(imageUrl.map(async (item) => {
                await ProductImage.create({ productId: newProduction.id, image: item }, { transaction: transaction });
            }));

            // insert multi product category
            await Promise.all(categeryProductId.map(async (item) => {
                await ProductCategory.create({ productId: newProduction.id, cateProductId: item }, { transaction: transaction });
            }));


            const responseData = await Product.findByPk(newProduction.id, {
                include:
                    [
                        { model: ProductTran, as: 'ProductTrans' },
                        { model: ProductImage, as: 'ProductImages' },
                        { model: CateProducts, as: 'cateProducts', include: [{ model: CateProductTran }] }
                    ], transaction: transaction
            });
            await transaction.commit();

            return res.json({
                success: true,
                message: "Created new production successfully",
                data: responseData
            });
        }
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

export const updateProduct = async (req, res, next) => {
    const { id } = req.params;
    const { files } = req;
    const transaction = await sequelize.transaction();
    try {
        const body = await updateProductSchema.validateAsync(req.body);
        const slug = makeSlugify(body.productName);
        const slugTran = makeSlugify(body.other_lang[0].productName);
        const categeryProductId = body.cateProductId

        // Check uniqueProduct
        const uniqueProduct = await Product.findAll({ where: { productName: body.productName, id: { [Op.ne]: id } } });
        if (uniqueProduct[0]) throw createError.BadRequest(`This production ${body.productName} is already taken`);
        // Check uniqueProduct tran
        const uniqueProductTran = await ProductTran.findAll({ where: { productName: body.other_lang[0].productName, productId: { [Op.ne]: id } } });
        if (uniqueProductTran[0]) throw createError.BadRequest(`This production tran ${body.other_lang[0].productName} is already taken`);

        // Check product
        const product = await Product.findByPk(id, { include: [{ model: ProductTran, as: 'ProductTrans' }] }, { transaction: transaction });
        if (!product) {
            throw createError.NotFound(`Production does not exist. with ID:${id}`);
        }
        // Check production image
        if (!files[0]) {
            // no files
            product.productName = body.productName;
            product.description = body.description;
            product.slug = slug;
            await product.save();
            // update tran
            await ProductTran.update({
                productName: body.other_lang[0].productName,
                description: body.other_lang[0].description,
                slug: slugTran
            }, { where: { productId: id, languageId: product.ProductTrans[0].languageId } }, { transaction: transaction });

            // destroy 
            await ProductCategory.destroy({ where: { productId: product.id } }, { transaction: transaction });
            // update products categories
            await Promise.all(categeryProductId.map(async (item) => {
                await ProductCategory.create({ productId: product.id, cateProductId: item }, { transaction: transaction });
            }));

            const responseData = await Product.findByPk(product.id, {
                include:
                    [
                        { model: ProductTran, as: 'ProductTrans' },
                        { model: ProductImage, as: 'ProductImages' },
                        { model: CateProducts, as: 'cateProducts', include: [{ model: CateProductTran }] }
                    ], transaction: transaction
            });
            await transaction.commit();
            return res.json({
                success: true,
                message: "No file upload",
                data: responseData
            });
        } else {
            // have file upload
            const imageUrl = files.map((fn) => {
                return `${DOMAIN}/images/production-images/${fn.filename}`;
            });
            // update production
            product.productName = body.productName;
            product.description = body.description;
            product.slug = slug;
            await product.save();
            // update tran
            await ProductTran.update({
                productName: body.other_lang[0].productName,
                description: body.other_lang[0].description,
                slug: slugTran
            }, { where: { productId: id, languageId: product.ProductTrans[0].languageId } }, { transaction: transaction });

            // destroy 
            await ProductImage.destroy({ where: { productId: id } }, { transaction: transaction });
            await ProductCategory.destroy({ where: { productId: id } }, { transaction: transaction });

            // update products images
            await Promise.all(imageUrl.map(async (item) => {
                await ProductImage.create({ productId: id, image: item }, { transaction: transaction });
            }));
            // update products categories
            await Promise.all(categeryProductId.map(async (item) => {
                await ProductCategory.create({ productId: id, cateProductId: item }, { transaction: transaction });
            }));

            const responseData = await Product.findByPk(id, {
                include:
                    [
                        { model: ProductTran, as: 'ProductTrans' },
                        { model: ProductImage, as: 'ProductImages' },
                        { model: CateProducts, as: 'cateProducts', include: [{ model: CateProductTran }] }
                    ], transaction: transaction
            });
            await transaction.commit();
            return res.json({
                success: true,
                message: "Have file upload",
                data: responseData
            });
        }

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * To get data all production
 * @param {*require language from request headers} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findProduct = async (req, res, next) => {
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            const product = await Product.findAll({
                include:
                    [{ model: ProductTran, as: 'ProductTrans' },
                    { model: ProductImage, as: 'ProductImages' },
                    { model: CateProducts, as: 'cateProducts', include: [{ model: CateProductTran }] }]
            });

            return res.json({
                success: true,
                message: "Productions for english language",
                data: product
            });
        }
        const product = await Product.findAll({
            include:
                [{ model: ProductImage, as: 'ProductImages' },
                { model: CateProducts, as: 'cateProducts', }]
        });

        return res.json({
            success: true,
            message: "Productoins for Lao language",
            data: product
        });
    } catch (error) {
        next(error);
    }
}

/**
 * To get data one production
 * @param {*require id from request params and language from request headers} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findOneProduct = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            // eng
            const product = await Product.findByPk(id, {
                include:
                    [{ model: ProductTran, as: 'ProductTrans' },
                    { model: ProductImage, as: 'ProductImages' },
                    { model: CateProducts, as: 'cateProducts', include: [{ model: CateProductTran }] }]
            })
            if (!product) {
                throw createError.NotFound(`Production does not exist. with ID:${id}`);
            }
            return res.json({
                success: true,
                message: "Production for english language",
                data: product
            });
        }
        // la
        const product = await Product.findByPk(id, {
            include:
                [{ model: ProductImage, as: 'ProductImages' },
                { model: CateProducts, as: 'cateProducts', }]
        });

        if (!product) {
            throw createError.NotFound(`Production does not exist. with ID:${id}`);
        }
        return res.json({
            success: true,
            message: "Productoins for Lao language",
            data: product
        });
    } catch (error) {
        next(error);
    }
}

/**
 * To get data by slug production
 * @param {*require id from request params and language from request headers} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findProductBySlug = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        const language = await Languages.findOne({ where: { short: lang } });
        if (!language) {
            throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
        }
        if (language.short === _languages.ENGLISH) {
            // eng
            let product = await Product.findOne({
                where: { slug: id },
                include:
                    [{ model: ProductTran, as: 'ProductTrans' },
                    { model: ProductImage, as: 'ProductImages' },
                    { model: CateProducts, as: 'cateProducts', include: [{ model: CateProductTran }] }]
            });
            if (!product) {

                product = await Product.findOne({
                    include:
                        [{ model: ProductTran, where: { slug: id }, required: true, as: 'ProductTrans' },
                        { model: ProductImage, as: 'ProductImages' },
                        { model: CateProducts, as: 'cateProducts', include: [{ model: CateProductTran }] }]
                });

                if (!product) throw createError.NotFound(`Production does not exist. with ID:${id}`);
            }
            return res.json({
                success: true,
                message: "Production for english language",
                data: product
            });
        }
        // la
        const product = await Product.findOne({
            where: { slug: id },
            include:
                [{ model: ProductImage, as: 'ProductImages' },
                { model: CateProducts, as: 'cateProducts', }]
        });

        if (!product) {
            throw createError.NotFound(`Production does not exist. with ID:${id}`);
        }
        return res.json({
            success: true,
            message: "Productoins for Lao language",
            data: product
        });
    } catch (error) {
        next(error);
    }
}

/**
 * To remove a production
 * @param {*require id from request} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod DELETE
 * @access private
 * @returns 
 */
export const deleteProduct = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        // const productCategories = await ProductCategory.findAll({ where: { productId: id } }, { transaction: transaction });
        // if (productCategories.length > 0) {
        //     throw createError.BadRequest(`Unable to delete ID:${id} at this time. Because the productCategories table is active`);
        // }
        const production = await Product.findByPk(id, { transaction: transaction });
        if (!production) {
            throw createError.NotFound(`Production does not exist. with ID:${id}`);
        }

        // const productionTran = await ProductTran.findOne({ where: { productId: id } }, { transaction: transaction });
        // if (!productionTran) {
        //     throw createError.NotFound(`ProductionTran does not exist. with ID:${id}`);
        // }

        await ProductCategory.destroy({where: { productId: id } }, { transaction: transaction})
        await ProductImage.destroy({ where: { productId: id } }, { transaction: transaction });
        await ProductTran.destroy({ where: { productId: id } }, { transaction: transaction });
        await production.destroy();
        await transaction.commit();
        return res.json({
            success: true,
            message: `Deleted production ID: ${id} successfully`
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}