import { TypeJob, sequelize } from "../models";
import createError from "http-errors";
import { createTypeJobSchema } from "../validators/type.validator";


export const createTypeJob = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const body = await createTypeJobSchema.validateAsync(req.body);
        const checkName = await TypeJob.findOne({
            where: {
                name: body.name
            }
        });
        if (checkName) {
            throw createError.BadRequest("Type job name already exists.");
        }
        const typeJob = await TypeJob.create({
            name: body.name,
        }, { transaction: transaction });
        await transaction.commit();
        return res.json({
            success: true,
            message: "Type job created successfully",
            data: typeJob
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

// MEAN: Find all type job

export const findAllTypeJob = async (req, res, next) => {
    try {
        const typeJobs = await TypeJob.findAll();
        return res.json({
            success: true,
            message: "Type jobs fetched successfully",
            data: typeJobs
        });
    } catch (error) {
        next(error);
    }
}


// MEAN: delete type job
export const deleteTypeJob = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const typeJob = await TypeJob.destroy({
            where: {
                id: req.params.id
            },
            transaction: transaction
        });
        await transaction.commit();
        return res.json({
            success: true,
            message: "Type job deleted successfully",
            data: typeJob
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}



