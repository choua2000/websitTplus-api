import { Users, Roles, Permissions, UserRoles, Employees, Customer, UserPermissions, sequelize } from '../models';
import createError from 'http-errors';
import { adminUpdateSchema, clientUpdateSchema } from '../validators/user.Validator';
import { hashPassword, comparePassword } from '../libs/utils/security';


/**
 * admin & client --> To find user
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const findOneUser = async (req, res, next) => {
    const userInfo = req.user;
    try {
        const user = await Users.findByPk(userInfo.id, { include: [{ model: Employees }, { model: Customer }] });
        if (!user) throw createError.NotFound(`This user does not exist.`);

        return res.json({
            success: true,
            message: `Get user successfully`,
            data: user,
        });

    } catch (error) {
        next(error);
    }
}

/**
 * To update a user admin
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */
export const updateUserAd = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const body = await adminUpdateSchema.validateAsync(req.body);

        const user = await Users.findByPk(id, { transaction: transaction });
        if (!user) {
            throw createError.NotFound(`This user does not exist. with ID:${id}`);
        }

        const employee = await Employees.findOne({ where: { userId: user.id } }, { transaction: transaction });
        if (!employee) {
            throw createError.NotFound(`This employee does not exist. with ID:${id}`);
        }

        user.username = body.username;
        user.email = body.email;
        user.password = body.password ? hashPassword(body.password) : user.password;
        user.status = body.status ? body.status : user.status;
        await user.save();

        employee.firtName = body.firstName;
        employee.surName = body.surName;
        await employee.save();
        await transaction.commit();

        const responseData = await Users.findByPk(id, {
            include: [{ model: Employees, as: 'Employee' }, {
                model: Roles, as: 'roles',
                include: [{ model: Permissions, as: 'permissions' }]
            }],
        });

        return res.json({
            success: true,
            message: `Updated user profile ID:${id} successfully`,
            data: responseData
        });

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * admin --> To update user customer profile 
 * @param {* require id and data from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @ type mothod PUT
 * @access private
 * @returns 
 */
export const updateUser_Cli = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const body = await clientUpdateSchema.validateAsync(req.body);

        const user = await Users.findByPk(id, { transaction: transaction });
        if (!user) {
            throw createError.NotFound(`This user does not exist. with ID:${id}`);
        }

        const customer = await Customer.findOne({ where: { userId: user.id } }, { transaction: transaction });
        if (!customer) {
            throw createError.NotFound(`This employee does not exist. with ID:${id}`);
        }

        // user.username = body.username;
        // user.email = body.email;
        // user.password = body.password ? hashPassword(body.password) : user.password;
        user.status = body.status ? body.status : user.status;
        await user.save();

        // customer.firtName = body.firstName;
        // customer.surName = body.surName;
        // await customer.save();
        await transaction.commit();

        const responseData = await Users.findByPk(id, {
            include: [{ model: Customer }, {
                model: Roles, as: 'roles',
                include: [{ model: Permissions, as: 'permissions' }]
            }],
        });

        return res.json({
            success: true,
            message: `Updated user customer profile ID:${id} successfully`,
            data: responseData
        });

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * To get all employee
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const findUsers = async (req, res, next) => {
    try {
        const user = await Users.findAll({
            include: [{ model: Employees, required: true }, {
                model: Roles, as: 'roles',
                include: [{ model: Permissions, as: 'permissions' }]
            }], order: [['id', 'DESC']]
        });

        return res.json({
            success: true,
            message: "OK",
            data: user
        });
    } catch (error) {
        next(error);
    }
}

/**
 * 
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const findAllUserCustomer = async (req, res, next) => {
    try {
        const user = await Users.findAll({
            include: [{ model: Customer, required: true }, {
                model: Roles, as: 'roles',
                include: [{ model: Permissions, as: 'permissions' }]
            }], order: [['id', 'DESC']]
        });

        return res.json({
            success: true,
            message: "Get all customers successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
}

/**
 * To get a employee has roles and permissions
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @returns 
 */
export const findOneUserRolesPermiss = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await Users.findByPk(id, {
            include: [{ model: Employees }, {
                model: Roles, as: 'roles',
                include: [{ model: Permissions, as: 'permissions' }]
            }]
        });
        if (!user) {
            throw createError.NotFound("This user does not exist");
        }
        return res.json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
}

/**
 * To get a user has roles
 * @param {* require id from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findUserhasRole = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await Users.findByPk(id, { include: [{ model: Employees }, { model: Roles, as: 'roles' }] });
        if (!user) throw createError.NotFound(`This user does not exist. with ID:${id}`);
        return res.json({
            success: true,
            message: "Get a user has roles",
            data: user
        });
    } catch (error) {
        next(error);
    }
}

/**
 * To get a user has permissions
 * @param {* require id from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const findUserhasPermiss = async (req, res, next) => {
    const { id } = req.params;
    try {
        const user = await Users.findByPk(id, { include: [{ model: Permissions, as: 'permissions' }] });
        if (!user) throw createError.NotFound(`This user does not exist. with ID:${id}`);
        return res.json({
            success: true,
            message: "Get a user has permissions",
            data: user
        });
    } catch (error) {
        next(error);
    }
}

/**
 * To add new userRole 
 * @param {required id and data from request} req
 * @param {if error is true} next
 * @type method POST
 * ເພີ່ມບົດບາດຜູ້ໃຊ້ໃຫ້ກັບ ຜູ້ໃຊ້
 */
export const addUserRole = async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;
    const transaction = await sequelize.transaction();
    try {
        const userRoleId = body.map((id) => id.roleId);

        const user = await Users.findByPk(id, { transaction: transaction });

        if (!user) {
            throw createError.NotFound("This user does not exist");
        }
        await user.addRoles(userRoleId);

        await transaction.commit();
        return res.json({
            success: true,
            message: "Updated user role successfully",
            data: user
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

/**
 * To delete a userRole 
 * @param {required userId and roleId} req
 * @param {if error is true} next
 * @type method DELETE
 * ລຶບບົດບາດຜູ້ໃຊ້ອອກຈາກ ຜູ້ໃຊ້
 */
export const deleteUserRole = async (req, res, next) => {
    const { user_id } = req.params;
    const { role_id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const userRole = await UserRoles.findOne({
            where:
                { userId: user_id, roleId: role_id }
        }, { transaction: transaction });

        if (!userRole) {
            throw createError.NotFound("This userRole does not exist");
        }
        await userRole.destroy();

        await transaction.commit();
        return res.json({
            success: true,
            message: "Deleted user role successfully"
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

/**
 * To add a new userPermission
 * @param {required id and data from request} req
 * @param {if error is true} next
 * @type method POST
 * ເພີ່ມສິດທິການເຂົ້າໃຊ້ໃຫ້ກັບ ຜູ້ໃຊ້
 */
export const addUserPermissions = async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;
    const transaction = await sequelize.transaction();
    try {
        const userPermissionId = body.map((id) => id.permId);

        const user = await Users.findByPk(id, { transaction: transaction });

        if (!user) {
            throw createError.NotFound("This user does not exist");
        }
        await user.addPermissions(userPermissionId);

        await transaction.commit();
        return res.json({
            success: true,
            message: "User added permissions successfully",
            data: user
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

/**
 * To delete a userPermission
 * @param {required userId and permId} req
 * @param {if error is true} next
 * @type method POST
 * ລຶບສິດທິການເຂົ້າໃຊ້ອອກຈາກ ຜູ້ໃຊ້
 */
export const deleteUserPermissions = async (req, res, next) => {
    const { user_id } = req.params;
    const { perm_id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const userPermission = await UserPermissions.findOne({
            where:
                { userId: user_id, permId: perm_id }
        }, { transaction: transaction });

        if (!userPermission) {
            throw createError.NotFound("This userPermission does not exist");
        }
        await userPermission.destroy();

        await transaction.commit();
        return res.json({
            success: true,
            message: "Deleted user permissions successfully"
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}


// ------------------> report all user <----------------------
export const reportAllUsers = async (req, res, next) => {
    try {
        const countUsers = await Users.findAndCountAll({
            attributes: ['id', 'phone', 'status', 'createdAt', 'updatedAt']
        });

        return res.json({
            success: true,
            message: `Total number of system users: ${countUsers.count}`,
            data: countUsers
        });

    } catch (error) {
        next(error);
    }
}

// --------------> report all employees <---------------
export const reportAllEmployees = async (req, res, next) => {
    try {
        const countUsersEmployees = await Users.findAndCountAll({
            include: [{ model: Employees, required: true }], order: [['id', 'DESC']]
        });

        return res.json({
            success: true,
            message: `Total number of system user employees: ${countUsersEmployees.count}`,
            data: countUsersEmployees
        });

    } catch (error) {
        next(error);
    }
}

// ---------------> report all customers <----------------
export const reportAllCustomer = async (req, res, next) => {
    try {
        const countUserCustomers = await Users.findAndCountAll({
            attributes: ['id', 'phone', 'status', 'createdAt', 'updatedAt', 'type_user'],
            include: [{ model: Customer, required: true }], order: [['id', 'DESC']]
        });

        return res.json({
            success: true,
            message: `Total number of system user customers: ${countUserCustomers.count}`,
            data: countUserCustomers,
        });
    } catch (error) {
        next(error);
    }
}

// --------------> report all users <---------------
export const reportUserGenerate = async (req, res, next) => {
    try {
        const countUserGenerate = await Users.findAndCountAll({
            where: { type_user: 'fake_user' },
            attributes: ['id', 'type_user', 'username', 'status', 'createdAt', 'updatedAt'], order: [['id', 'DESC']]
        });

        return res.json({
            success: true,
            message: `Total number of system user generate: ${countUserGenerate.count}`,
            data: countUserGenerate,
        });
    } catch (error) {
        next(error);
    }
}