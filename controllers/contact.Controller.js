import { Contact, sequelize } from '../models';
import createError from 'http-errors';
import { validateEmail } from '../libs/utils/regex';
import { contactSchema } from '../validators/contact.validator';
import { sendEmail } from '../libs/utils/sendEmail';

/**
 * clietn --> To send information contact Tplus team
 * @param {* require data from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod POST
 * @access public
 * @returns 
 */
export const createContact = async (req, res, next) => {
    const transaction = await sequelize.transaction();
    try {
        const body = await contactSchema.validateAsync(req.body);
        const email = validateEmail(body.email);

        if (!email) {
            throw createError.BadRequest(`Please enter your email address`);
        }
        const newContact = await Contact.create({
            name: body.name,
            email: body.email,
            title: body.title,
            description: body.description,
        }, { transaction: transaction });
        // send contact email to customercare@tplus.la
        await sendEmail(body.title, body.name, body.email, body.description);
        await transaction.commit();

        return res.json({
            success: true,
            message: "Your information contact sent successfully",
            newContact
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}

/**
 * admin --> To get all contacts from customers
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @type mothod GET
 * @access private
 * @returns 
 */
export const findContact = async (req, res, next) => {
    try {
        const contact = await Contact.findAll({ order: [['id', 'DESC']] });
        return res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        next(error);
    }
}

/**
 * admin --> To get one contacts from customers
 * @param {* require id from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access private
 * @returns 
 */
export const findOneContact = async (req, res, next) => {
    const { id } = req.params;
    try {
        const contact = await Contact.findByPk(id);
        if (!contact) {
            throw createError.NotFound(`Information does not exist. with ID:${id}`);
        }
        return res.json({
            success: true,
            data: contact
        });
    } catch (error) {
        next(error);
    }
}

/**
 * admin --> To get one contacts from customers
 * @param {* require id from request} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod DELETE
 * @access private
 * @returns 
 */
export const deleteContact = async (req, res, next) => {
    const { id } = req.params;
    const transaction = await sequelize.transaction();
    try {
        const contact = await Contact.findByPk(id, { transaction: transaction });
        if (!contact) {
            throw createError.NotFound(`Information does not exist. with ID:${id}`);
        }
        await contact.destroy();
        await transaction.commit();
        return res.json({
            success: true,
            message: `Deleted information contact with ID:${id} successfully`
        });
    } catch (error) {
        await transaction.rollback();
        next(error);
    }
}