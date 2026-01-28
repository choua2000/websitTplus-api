import {
    Roles,
    RolePermissions,
    Permissions,
    UserRoles,
    sequelize
} from '../models';
import { Op } from 'sequelize';
import createError from 'http-errors';
import { roleSchema, rolePermissSchema } from '../validators/role.validator';

/**
* To create a new role
@param {required data from request} req
* @param { created role success} res 
* @param {if error is true} next 
* @access private
* @type method POST
* @returns 
*/
export const createRole = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const body = await roleSchema.validateAsync(req.body);

        const role = await Roles.findOne({ where: { name: body.name } }, { transaction: transaction });
        if (role) {
            await transaction.rollback();
            return res.status(200).json({ message: "This role is already exists" });
        }
        const newRole = await Roles.create({
            name: body.name,
            description: body.description,
        }, { transaction: transaction });

        await transaction.commit();
        return res.json({
            success: true,
            message: "Created role successfully",
            newRole
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
* To update a role
@param {required id and data from request} req
* @param { Updated role success} res 
* @param {if error is true} next 
* @access private
* @type method PUT
* @returns 
*/
export const updateRole = async (req, res, next) => {
    const { id } = req.params
    const transaction = await sequelize.transaction();
    try {
        const body = await roleSchema.validateAsync(req.body);

        // check if unique role exists
        const uniqueRole = await Roles.findAll({ where: { name: body.name, id: { [Op.ne]: id } } });
        if (uniqueRole[0]) throw createError.BadRequest(`This role ${body.name} is already taken`);

        const role = await Roles.findByPk(id, { transaction: transaction });
        if (!role) {
            throw createError.NotFound("This role does not exist");
        }
        role.name = body.name;
        role.description = body.description;
        await role.save();
        await transaction.commit();
        return res.json({
            success: true,
            message: "Role updated successfully",
            data: role
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
* To get all role
* @param { response role success} res 
* @param {if error is true} next 
* @access public
* @type method GET
* @returns 
*/
export const findRole = async (req, res, next) => {
    try {
        const role = await Roles.findAll({ order: [['id', 'DESC']] });
        return res.json({
            success: true,
            message: "Get all of roles successfully",
            data: role
        });
    } catch (error) {
        next(error);
    }
}

/**
* To get one role by id
@param {required id from request} req
* @param { response role success} res 
* @param {if error is true} next 
* @access public
* @type method GET
* @returns 
*/
export const findOneRole = async (req, res, next) => {
    const { id } = req.params;
    try {
        const role = await Roles.findByPk(id);
        if (!role) {
            throw createError.NotFound("This role does not exist");
        }
        return res.json({
            success: true,
            message: "Get a role successfully",
            data: role
        });
    } catch (error) {
        next(error);
    }
}

export const findRolePermissions = async (req, res, next) => {
    const { id } = req.params;
    try {
        const rolePermissions = await Roles.findByPk(id, { include: [{ model: Permissions, as: 'permissions' }] });
        if (!rolePermissions) {
            throw createError.NotFound(`This rolePermissions does not exist. with ID:${id}`);
        }
        return res.json({
            success: true,
            message: `get one role of permissions successfully`,
            data: rolePermissions,
        });
    } catch (error) {
        next(error);
    }
}

/**
* To delete a role
@param {required id from request} req
* @param { deleted role success} res 
* @param {if error is true} next 
* @access private
* @type method DELETE
* @returns 
*/
export const deleteRole = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const rolePermissions = await RolePermissions.findAll({ where: { roleId: id } }, { transaction: transaction });
        if (rolePermissions.length > 0) {
            throw createError.BadRequest(`Unable to delete ID:${id} at this time. Because the rolepermissions table is active`);
        }
        const userRoles = await UserRoles.findAll({ where: { roleId: id } }, { transaction: transaction });
        if (userRoles.length > 0) {
            throw createError.BadRequest(`Unable to delete ID:${id} at this time. Because the userroles table is active`);
        }
        const role = await Roles.findByPk(id, { transaction: transaction });
        if (!role) {
            throw createError.NotFound("This role does not exist");
        }
        await role.destroy();
        await transaction.commit();
        return res.json({
            success: true,
            message: `Deleted role ID:${id} successfully`
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

export const addRolesPermission = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const body = await rolePermissSchema.validateAsync(req.body);

        const rolePermissionId = body.map((id) => id.permId);

        const role = await Roles.findByPk(id, { transaction: transaction });
        if (!role) {
            throw createError.NotFound("This role does not exist");
        }
        await role.addPermissions(rolePermissionId);

        await transaction.commit();
        return res.json({
            success: true,
            message: "Role added Permissions successfully",
            data: role
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

export const deleteRolesPermission = async (req, res, next) => {
    const { role_id, perm_id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const rolePermission = await RolePermissions.findOne({
            where:
                { roleId: role_id, permId: perm_id }
        }, { transaction: transaction });

        if (!rolePermission) {
            throw createError.NotFound("This rolePermission does not exist");
        }
        await rolePermission.destroy();
        await transaction.commit();
        return res.json({
            success: true,
            message: "Delete role permission successfully",
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}