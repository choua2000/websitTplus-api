import { Users, Roles, Permissions, Customer, Employees, OTPs, sequelize } from '../models';
import createError from 'http-errors';
import { Op } from 'sequelize';
import JWT from '../libs/utils/authenticate';
import faker from 'faker';
import { generatePassword } from '../libs/utils/random';
import {
    validateEmail,
    validateNumber
} from '../libs/utils/regex';
import OTP from 'otp-generator';
import role from '../libs/auth/roles';
import {
    hashPassword,
    comparePassword,
    hashOTP,
    compareOTP
} from '../libs/utils/security';
import {
    customerSchema,
    adminSchema,
    customSignInSchema,
    verificationSchema,
    forgetPswSchema,
    resetPswSchema,
} from '../validators/auth.validator';
import { AddMinutesToDate, message, dates } from '../libs/helpers/sendSMS';
import status from '../libs/utils/status';

/**
 *  Creates new user customer
 * @param {need data from body} req 
 * @param {new user} res 
 * @param {if error is true} next 
 * @access method POST
 */
export const signUpCustomer = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const body = await customerSchema.validateAsync(req.body);

        // create otp
        const otp = OTP.generate(6, { alphabets: false, upperCase: false, specialChars: false });
        const enCodedOTP = hashOTP(otp);
        const now = new Date();
        const expiration_time = AddMinutesToDate(now, 1);

        // Check if user available in DB
        const user = await Users.findOne({ where: { phone: body.phone }, include: [{ model: OTPs }] }, { transaction: transaction });

        if (user) {
            if (user.status === status.INACTIVE) {
                // inactive
                // user not verfied
                let amountRecall_OTP = await OTPs.findAndCountAll({ where: { userId: user.id } });

                // Check if amount client recall OTP and allow 3 
                if (amountRecall_OTP.count > 2) {
                    throw createError.RequestTimeout(`Your OTP request count has been completed. Please contact admin`);
                }

                if (user.OTP) {
                    await OTPs.create({
                        userId: user.id,
                        otp: enCodedOTP,
                        expiration_time: expiration_time,
                    }, { transaction: transaction });
                    message(user.phone, otp);

                    await transaction.commit();

                    // return res.status(400).send({ success: false, message: `This phone number ${body.phone} does't verify. Please verified your OTP` })
                    const responseData = await Users.findByPk(user.id, {
                        include: [{ model: Customer, as: 'Customer' }],
                    });
                    return res.json({
                        success: true,
                        message: `Sent OTP verification to phone number:${body.phone} successfully`,
                        newUser: responseData,
                    });
                }

                throw createError.BadRequest(`This phone number ${body.phone} is already taken`);

            } else if (user.status === status.ACTIVE) {
                // active
                throw createError.BadRequest(`This phone number ${body.phone} is already exists`);
            } else {
                // suspended
                throw createError.Unauthorized(`Your phone number ${body.phone} suspended. Please contact admin`);
            }
        }

        // create new account
        const passwordEncrypt = hashPassword(body.password);
        const newUser = await Users.create({
            phone: body.phone,
            password: passwordEncrypt,
        }, { transaction: transaction });

        const userRole = await Roles.findOne({ where: { name: role.CUSTOMER } }, { transaction: transaction });
        newUser.addRoles(userRole);

        // create profile
        await Customer.create({
            userId: newUser.id,
            firstName: body.firstName,
            surName: body.surName,
        }, { transaction: transaction });

        await OTPs.create({
            userId: newUser.id,
            otp: enCodedOTP,
            expiration_time: expiration_time,
        }, { transaction: transaction });
        message(body.phone, otp);
        await transaction.commit();

        const responseData = await Users.findByPk(newUser.id, {
            include: [{ model: Customer, as: 'Customer' }],
        });

        return res.json({
            success: true,
            message: `Sent OTP verification to phone number:${body.phone} successfully`,
            newUser: responseData,
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * To verify OTP register
 * @param {*require phone and otp from request body} req 
 * @param {*send data success response} res 
 * @param {*if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const verifyCustomer = async (req, res, next) => {
    let currentDate = new Date();
    const verify = true;
    // const status = 'active';
    const transaction = await sequelize.transaction();
    try {
        const body = await verificationSchema.validateAsync(req.body);

        // Check if user
        const user = await Users.findOne({ where: { phone: body.phone }, attributes: ['id', 'phone'] }, { transaction: transaction });
        if (!user) {
            throw createError.NotFound(`This user does not exist. with phone:${body.phone}`);
        }

        const otp_instance = await OTPs.findOne({ where: { userId: user.id }, order: [['createdAt', 'DESC']] }, { transaction: transaction });

        //Check if OTP is available in the DB
        if (otp_instance) {
            //Check if OTP is already used or not
            if (otp_instance.verified != true) {
                //Check if OTP is expired or not
                if (dates.compare(otp_instance.expiration_time, currentDate) == 1) {
                    const isOTP = compareOTP(body.otp, otp_instance.otp);
                    if (isOTP) {
                        otp_instance.verified = verify;
                        await otp_instance.save();
                        await OTPs.destroy({ where: { userId: user.id } });

                        user.status = status.ACTIVE;
                        await user.save();
                        await transaction.commit();
                        return res.json({
                            success: true,
                            message: `Your phone number:${user.phone} registered successfully`,
                        });
                    } else {
                        throw createError.BadRequest("OTP invalid");
                    }
                } else {
                    throw createError.BadRequest("OTP expired");
                }
            } else {
                throw createError.BadRequest("OTP is already in used");
            }
        } else {
            throw createError.BadRequest("Invalid OTP or expired");
        }

    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 *  Creates new user admin
 * @param {need data from body} req 
 * @param {new user} res 
 * @param {if error is true} next 
 * @access method POST
 */
export const signUpAdmin = async (req, res, next) => {
    // const status = 'active';
    const transaction = await sequelize.transaction();
    try {
        const body = await adminSchema.validateAsync(req.body);
        const user = await Users.findOne({ where: { [Op.or]: [{ username: body.username }, { email: body.email }, { phone: body.phone }] } }, { transaction: transaction });
        if (user) {
            throw createError.UnprocessableEntity(`This Email, Phone or Username is already taknes`);
        }
        const passwordEncrypt = hashPassword(body.password);
        const newUser = await Users.create({
            username: body.username,
            email: body.email,
            phone: body.phone,
            password: passwordEncrypt,
            status: status.ACTIVE,
        }, { transaction: transaction });

        const userRole = await Roles.findOne({ where: { name: role.EMPLOYEE } }, { transaction: transaction });
        newUser.addRoles(userRole);

        // Create profile
        await Employees.create({
            userId: newUser.id,
            firtName: body.firstName,
            surName: body.surName,
        }, { transaction: transaction });
        await transaction.commit();

        const responseData = await Users.findByPk(newUser.id, {
            include: [{ model: Employees, as: 'Employee' }, {
                model: Roles, as: 'roles',
                include: [{ model: Permissions, as: 'permissions' }]
            }],
        });

        return res.json({
            success: true,
            message: "User registered successfully",
            newUser: responseData
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 *  Login user customers
 * @param {phone, password} req 
 * @param {accessToken, refreshToken } res 
 * @param {if error is true} next 
 * @access method POST
 */
export const signInCustomer = async (req, res, next) => {
    try {
        const body = await customSignInSchema.validateAsync(req.body);

        const user = await Users.findOne({
            where:
                { phone: body.phone },
            include: [{ model: Roles, as: 'roles', attributes: ['id', 'name'] }],
            order: [
                ['roles', 'id', 'ASC']
            ],
        });
        if (!user) throw createError.NotFound("User not found");

        if (user.status !== status.ACTIVE) {
            throw createError.BadRequest("Your account has been inactive or suspended. Contact admin");
        }
        const isMatch = comparePassword(body.password, user.password);
        if (isMatch) {
            const payload = {
                id: user.id,
                phone: user.phone,
            }
            const accessToken = JWT.genAccessJWT(payload);
            const refreshToken = JWT.genRefreshJWT(payload);

            return res.json({
                success: true,
                message: "Login successful",
                accessToken: accessToken,
                refreshToken: refreshToken,
                role: user.roles,
            });
        } else {
            throw createError.Unauthorized(`Invalid phone number: ${user.phone} or password`);
        }
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        next(error);
    }
}

/**
 *  Login user admin
 * @param {username or email or phone, password} req 
 * @param {accessToken, refreshToken } res 
 * @param {if error is true} next 
 * @access method POST
 */
export const signInAdmin = async (req, res, next) => {
    const { body } = req;
    try {
        const email = validateEmail(body.data);  // regex type input email validate
        const number = validateNumber(body.data);  // regex type input number validate
        let emailValue = "";
        let phoneValue = "";
        let usernameValue = "";
        let user = null;
        // Check type input
        if (email) {
            emailValue = body.data;
            user = await Users.findOne({
                where:
                    { email: emailValue },
                include: [{ model: Employees }, { model: Roles, as: 'roles', attributes: ['id', 'name'] }],
                order: [
                    ['roles', 'id', 'ASC']
                ],
            });
        } else if (number) {
            phoneValue = body.data;
            user = await Users.findOne({
                where: { phone: phoneValue },
                include: [{ model: Employees }, { model: Roles, as: 'roles', attributes: ['id', 'name'] }],
                order: [
                    ['roles', 'id', 'ASC']
                ],
            });
        } else {
            usernameValue = body.data;
            user = await Users.findOne({
                where:
                    { username: usernameValue },
                include: [{ model: Employees }, { model: Roles, as: 'roles', attributes: ['id', 'name'] }],
                order: [
                    ['roles', 'id', 'ASC']
                ],
            });
        }

        if (!user) {
            throw createError.NotFound("This user doesn't not exist");
        }
        if (user.status !== 'active') {
            throw createError.BadRequest("Your account has been inactive or suspended. Contact admin");
        }
        const isMatch = comparePassword(body.password, user.password);
        if (isMatch) {
            const payload = {
                id: user.id,
            }

            const accessToken = JWT.genAccessJWT(payload);
            const refreshToken = JWT.genRefreshJWT(payload);

            return res.json({
                success: true,
                message: "Login successful",
                accessToken: accessToken,
                refreshToken: refreshToken,
                role: user.roles,
            });
        } else {
            throw createError.Unauthorized(`Invalid User or Password`);
        }
    } catch (error) {
        next(error);
    }
}

/**
 * To get otp for reset password login
 * @param {* require phone want to sent otp} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const forGotPassword = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const body = await forgetPswSchema.validateAsync(req.body);

        const user = await Users.findOne({ where: { phone: body.phone } }, { transaction: transaction });
        if (!user) {
            throw createError.NotFound(`This user does not exist. with phone number:${body.phone}`);
        }
        if (user.status !== 'active') {
            throw createError.BadRequest("Your account has been inactive or suspended. Contact admin");
        }
        // make otp
        const otp = OTP.generate(6, { alphabets: false, upperCase: false, specialChars: false });
        const enCodedOTP = hashOTP(otp);
        const now = new Date();
        const expiration_time = AddMinutesToDate(now, 2);
        await OTPs.create({
            userId: user.id,
            otp: enCodedOTP,
            expiration_time: expiration_time,
        }, { transaction: transaction });
        message(body.phone, otp);
        await transaction.commit();
        return res.json({
            success: true,
            message: `Sent OTP Reset Password to phone number ${body.phone} successfully`
        });
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 * To reset new password
 * @param {* require phone, otp, new password} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const reSetPassword = async (req, res, next) => {
    const verify = true;
    let currentDate = new Date();
    const transaction = await sequelize.transaction();
    try {
        const body = await resetPswSchema.validateAsync(req.body);

        const user = await Users.findOne({ where: { phone: body.phone } }, { transaction: transaction });
        if (!user) {
            throw createError.NotFound(`This  user does not exist. with phone number:${body.phone}`);
        }
        if (user.status !== 'active') {
            throw createError.BadRequest(`Please contact admin. your phone number maybe suspended or inactive`);
        }
        const otp_instance = await OTPs.findOne({ where: { userId: user.id }, order: [['createdAt', 'DESC']], }, { transaction: transaction });
        //Check if OTP is available in the DB
        if (otp_instance) {
            //Check if OTP is already used or not
            if (otp_instance.verified != true) {
                //Check if OTP is expired or not
                if (dates.compare(otp_instance.expiration_time, currentDate) == 1) {
                    const isOTP = compareOTP(body.otp, otp_instance.otp);
                    if (isOTP) {
                        otp_instance.verified = verify;
                        await otp_instance.save();
                        user.password = hashPassword(body.newPassword);
                        await user.save();
                        await OTPs.destroy({ where: { userId: user.id } });
                        await transaction.commit();
                        return res.json({
                            success: true,
                            message: `Reset your new password success`,
                        });
                    } else {
                        throw createError.BadRequest("OTP invalid");
                    }
                } else {
                    throw createError.BadRequest("OTP expired");
                }
            } else {
                throw createError.BadRequest("OTP is already in used");
            }
        } else {
            throw createError.BadRequest("Invalid OTP or expired");
        }
    } catch (error) {
        if (error.isJoi === true) error.status = 422;
        await transaction.rollback();
        next(error);
    }
}

/**
 *  To kill refreshToken from storeRefreshToken
 * @param {need refresh token from body} req
 * @param {kill refresh token} res 
 * @param {if error is true} next 
 * @access POST
 */
export const refreshJWT = async (req, res, next) => {
    const refreshToken = req.headers.refresh_token;
    try {
        if (!refreshToken) {
            throw createError.Unauthorized(`Please! provided your token`);
        }
        const decoded = JWT.verifyJWT(refreshToken);

        const user = await Users.findByPk(decoded.id);

        if (!user) throw createError.NotFound(`This user does not exist`);
        if (user.id !== decoded.id) {
            throw createError.Forbidden(`You do not authenticate`);
        } else {
            const payload = { id: user.id }
            const accessToken = JWT.genAccessJWT(payload);
            const refreshToken = JWT.genRefreshJWT(payload);
            return res.json({
                success: true,
                message: `build new token successfully`,
                new_AccessToken: accessToken,
                new_RefreshToken: refreshToken
            });
        }
    } catch (error) {
        if (error.message === 'invalid token' || error.message === 'jwt malformed') error.status = 403;
        next(error);
    }
}

export const generateUser = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        let passwordGenerated = generatePassword(8);
        let user_generate = await Users.create({
            username: faker.name.firstName(),
            password: hashPassword(passwordGenerated),
            status: 'active',
            type_user: 'fake_user',
        }, { transaction: transaction });
        await transaction.commit();

        const isMatch = comparePassword(passwordGenerated, user_generate.password);
        if (isMatch) {
            const payload = { id: user_generate.id, username: user_generate.username }
            const accessToken = JWT.genAccessJWT(payload);
            const refreshToken = JWT.genRefreshJWT(payload);

            return res.json({
                success: true,
                message: "Login successful",
                data: payload,
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
        } else {
            throw createError.Unauthorized(`Invalid`);
        }
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

// /**
//  *  To kill refreshToken from storeRefreshToken
//  * @param {need refresh token from body} req
//  * @param {kill refresh token} res
//  * @param {if error is true} next
//  * @access POST
//  */
// export const signOut = async (req, res, next) => { }