import { Position, JobRecuit, sequelize } from '../models';
import createError from 'http-errors';
import { PositionSchema } from '../validators/position.validator';

export const createPosition = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const body = await PositionSchema.validateAsync(req.body);

        const position = await Position.findOne({ where: { name: body.name } }, { transaction: transaction });
        if (position) {
            await transaction.rollback();
            return res.status(200).json({ success: false, message: `This position ${body.name} is already exists` });
        }
        const newPosition = await Position.create({
            name: body.name,
            description: body.description,
        }, { transaction: transaction });
        await transaction.commit();
        return res.json({
            success: true,
            message: "Created position successfully",
            newPosition
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

export const updatePosition = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const body = await PositionSchema.validateAsync(req.body);

        const position = await Position.findByPk(id, { transaction: transaction });
        if (!position) {
            throw createError.NotFound(`Position does not exist. with ID:${id}`);
        }
        position.name = body.name;
        position.description = body.description
        await position.save();
        await transaction.commit();
        return res.json({
            success: true,
            message: "Position updated successfully",
            data: position
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

export const findPosition = async (req, res, next) => {
    try {
        const position = await Position.findAll({ order: [['id', 'DESC']] });
       
        return res.json({
            success: true,
            message: "Get all positions successfully",
            data: position
        });
    } catch (error) {
        next(error);
    }
}

export const findOnePosition = async (req, res, next) => {
    const { id } = req.params;
    try {
        const position = await Position.findByPk(id);
        if (!position) {
            throw createError.NotFound(`Position does not exist. with ID:${id}`);
        }
        return res.json({
            success: true,
            data: position,
        });
    } catch (error) {
        next(error);
    }
}

export const deletePosition = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const jobRecuit = await JobRecuit.findAll({ where: { positionId: id } }, { transaction: transaction });
        if (jobRecuit.length > 0) {
            throw createError.BadRequest(`Unable to delete ID:${id} at this time. Because the jobRecuit table is active`);
        }

        const position = await Position.findByPk(id, { transaction: transaction });
        if (!position) {
            throw createError.NotFound(`Position does not exist. with ID:${id}`);
        }
        await position.destroy();
        await transaction.commit();
        return res.json({
            success: true,
            message: `Deleted position ID: ${id} successfully`,
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}