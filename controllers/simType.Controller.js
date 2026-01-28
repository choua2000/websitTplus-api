import { SimType, NewPackage, NewPackageTran, NewPackageSimType, Languages, sequelize } from '../models';
import createError from 'http-errors';
import { Op } from 'sequelize';
import _languages from '../constants/language';
import {
    addSimTypeSchema,
    addSimTypePackageSchema
} from '../validators/simType.validator';

/**
 * admin --> To create a new SimType
 * @param {* require data from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const createSimType = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const body = await addSimTypeSchema.validateAsync(req.body);

        const simType = await SimType.findOne({ where: { mainProduct: body.mainProduct } }, { transaction: transaction });
        if (simType) throw createError.BadRequest(`This sim type mainProduct: ${body.mainProduct} is already exists`);

        const newSimType = await SimType.create({
            mainProduct: body.mainProduct,
            detail: body.detail,
        }, { transaction: transaction });
        await transaction.commit();

        return res.json({
            success: true,
            message: `Created sim type ${body.detail} successfully`,
            data: newSimType,
        });

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * admin --> To update sim type
 * @param {* require id and data from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod PUT
 * @access private
 * @returns 
 */
export const updateSimType = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const body = await addSimTypeSchema.validateAsync(req.body);

        // check if uniqu MainProduct
        const uniquMainProduct = await SimType.findAll({
            where:
                { mainProduct: body.mainProduct, id: { [Op.ne]: id } }
        }, { transaction: transaction });

        if (uniquMainProduct[0]) throw createError.BadRequest(`This mainProduct ${body.mainProduct} is already taken`);

        const simType = await SimType.findByPk(id, { transaction: transaction });
        if (!simType) throw createError.NotFound(`This sim type does not exist. with ID:${id}`);

        simType.mainProduct = body.mainProduct;
        simType.detail = body.detail;
        await simType.save();
        await transaction.commit();

        return res.json({
            success: true,
            message: `Updated sim type ID: ${id} successfully`,
            data: simType
        });

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 *  admin --> To get all simType
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const findSimType = async (req, res, next) => {
    try {
        const simType = await SimType.findAll({ order: [['id', 'DESC']] });

        return res.json({
            success: true,
            message: `Get all data sim types`,
            data: simType
        });
    } catch (error) {
        next(error);
    }
}

/**
 * admin --> To delete a sim type
 * @param {* require id from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod DELETE
 * @access private
 * @returns 
 */
export const deleteSimType = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const simTypePackage = await NewPackageSimType.findAll({ where: { simTypeId: id } }, { transaction: transaction });
        if (simTypePackage.length > 0) {
            throw createError.BadRequest(`Unable to delete ID:${id} at this time. Because the newPackageSimType table is active`);
        }

        const simType = await SimType.findByPk(id, { transaction: transaction });
        if (!simType) throw createError.NotFound(`This sim type does not exist. with ID:${id}`);
        await simType.destroy();
        await transaction.commit();

        return res.json({
            success: true,
            message: `Deleted simType ID:${id} successfully`,
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

/**
 * admin --> To add packages to sim type
 * @param {* require id package} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const addSimTypePackage = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const body = await addSimTypePackageSchema.validateAsync(req.body);

        const simTypePackageId = body.map((item) => item.packageId);

        const simType = await SimType.findByPk(id, { transaction: transaction });
        if (!simType) throw createError.NotFound(`This sim type does not exist. with ID:${id}`);

        await simType.addNewPackage(simTypePackageId);
        await transaction.commit();

        const responseData = await SimType.findByPk(id, { include: [{ model: NewPackage, as: 'newPackages' }] });
        return res.json({
            success: true,
            message: `simType add packages successfully.`,
            data: responseData
        });

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
}

/**
 * admin --> To get one simType has packages
 * @param {* require id simType from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findSimTypeHasPackages = async (req, res, next) => {
    const { id } = req.params;
    const lang = req.query.lang || req.headers.content_language;
    try {
        if (lang !== undefined) {
            // check language
            const language = await Languages.findOne({ where: { short: lang } });
            if (!language) throw createError.NotFound("Languages not found just the moment. Please choose language supported now.");
            if (language.short === _languages.ENGLISH) {
                // eng
                const simType = await SimType.findByPk(id,
                    { include: [{ model: NewPackage, as: 'newPackages', include: [{ model: NewPackageTran }] }], order: [['newPackages', 'id', 'DESC']] });
                if (!simType) throw createError.NotFound(`This simtype package does not exist. with ID:${id}`);

                return res.json({
                    success: true,
                    message: `Get a simType has packages successfully.`,
                    data: simType
                });
            }
            // la
            const simType = await SimType.findByPk(id,
                { include: [{ model: NewPackage, as: 'newPackages', }], order: [['newPackages', 'id', 'DESC']] });
            if (!simType) throw createError.NotFound(`This simtype package does not exist. with ID:${id}`);

            return res.json({
                success: true,
                message: `Get a simType has packages successfully.`,
                data: simType
            });

        } else {
            // set default language
            const simType = await SimType.findByPk(id,
                { include: [{ model: NewPackage, as: 'newPackages', }], order: [['newPackages', 'id', 'DESC']] });
            if (!simType) throw createError.NotFound(`This simtype package does not exist. with ID:${id}`);

            return res.json({
                success: true,
                message: `Get a simType has packages successfully.`,
                data: simType
            });
        }


    } catch (error) {
        next(error);
    }
}

/**
 * admin --> To delete a simType package
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const deleteSimTypePackage = async (req, res, next) => {
    const { simType_id, package_id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const simTypePackage = await NewPackageSimType.findOne({
            where:
                { simTypeId: simType_id, newpackageId: package_id }
        }, { transaction: transaction });
        if (!simTypePackage) throw createError.NotFound(`This sim type package does not exist`);

        await simTypePackage.destroy();
        await transaction.commit();
        return res.json({
            success: true,
            message: `Deleted simType ID:${simType_id} and package ID:${package_id} successfully`,
        });

    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}