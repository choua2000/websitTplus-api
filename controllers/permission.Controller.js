import { Permissions, RolePermissions, UserPermissions, sequelize } from '../models'
import createError from 'http-errors'
import { permissSchema } from '../validators/permission.validator';

export const createPermission = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const body = await permissSchema.validateAsync(req.body);

        const permission = await Permissions.findOne({ where: { name: body.name } }, { transaction: transaction });
        if (permission) {
            await transaction.rollback();
            return res.status(200).send({ success: false, message: "This permission is already exists" });
        }
        const newPermission = await Permissions.create({
            name: body.name,
            description: body.description,
        }, { transaction: transaction });
        await transaction.commit();
        return res.json({
            success: true,
            message: "Created permission successfully",
            newPermission
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

export const updatePermission = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const body = await permissSchema.validateAsync(req.body);

        const permission = await Permissions.findByPk(id, { transaction: transaction });
        if (!permission) {
            throw createError.NotFound("This permission does not exist");
        }
        permission.name = body.name;
        permission.description = body.description;
        await permission.save();
        await transaction.commit();
        return res.json({
            success: true,
            message: "Permission updated successfully",
            data: permission
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

export const findPermission = async (req, res, next) => {
    try {
        const permission = await Permissions.findAll({ order: [['id', 'DESC']] });
        return res.json({
            success: true,
            message: "Get all of permissions successfully",
            data: permission
        });
    } catch (error) {
        next(error);
    }
}

export const findOnePermission = async (req, res, next) => {
    const { id } = req.params;
    try {
        const permission = await Permissions.findByPk(id);
        if (!permission) {
            throw createError.NotFound("This permission does not exist");
        }
        return res.json({
            success: true,
            message: "Get a permission successfully",
            data: permission
        });
    } catch (error) {
        next(error);
    }
}

export const deletePermission = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        // Check permissions in partner
        const rolePermissions = await RolePermissions.findAll({ where: { permId: id } }, { transaction: transaction });
        if (rolePermissions.length > 0) {
            throw createError.BadRequest(`Unable to delete ID:${id} at this time. Because the rolepermissions table is active`);
        }
        // check permissions in partner
        const userPermissions = await UserPermissions.findAll({ where: { permId: id } }, { transaction: transaction });
        if (userPermissions.length > 0) {
            throw createError.BadRequest(`Unable to delete ID:${id} at this time. Because the userpermissions table is active`);
        }
        // check permissions
        const permission = await Permissions.findByPk(id, { transaction: transaction });
        if (!permission) {
            throw createError.NotFound("This permission does not exist");
        }
        await permission.destroy();
        await transaction.commit();
        return res.json({
            success: true,
            message: `Deleted Permission ID:${id} successfully`,
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}