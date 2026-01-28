import createError from 'http-errors';
import { tplusBookSim } from '../libs/helpers/tplus_book';
import {
    LIST_PHONE_NUMBER,
    SEARCH_PHONE_NUMBER,
    BOOK_PHONE_NUMBER,
    LIST_NICE_PHONE_NUMBER,
    SEARCH_NICE_PHONE_NUMBER,
    BOOK_NICE_PHONE_NUMBER,
} from '../constants/index';

/**
 * To get all of phone numbers
 * @param {* require custom namber} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const showListphoneNumbers = async (req, res, next) => {
    const { id } = req.params;
    try {
        const listPhoneNumber = await tplusBookSim(LIST_PHONE_NUMBER, id);

        if (listPhoneNumber.data[0].code === '112') {
            throw createError.BadRequest(`You can Searched number by yourseft`);
        }

        return res.json({
            success: true,
            messaage: "Get all of the phone numbers",
            data: listPhoneNumber.data[0],
        });
    } catch (error) {
        next(error);
    }
}

/**
 * client --> To search phone numbers 
 * @param {* required phone number to search} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod POST
 * @access public
 * @returns 
 */
export const searchPhoneNumber = async (req, res, next) => {
    const { body } = req;
    let custname = '';
    try {
        const searchPhoneNumber = await tplusBookSim(SEARCH_PHONE_NUMBER, custname, body.searchPhoneNumber);
        return res.json({
            success: true,
            messaage: "Search phone number success",
            data: searchPhoneNumber.data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * client --> To book phone numbers
 * @param {* require name and phone number} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod POST
 * @access public
 * @returns 
 */
export const bookPhoneNumber = async (req, res, next) => {
    const { body } = req;
    try {
        const bookNumber = await tplusBookSim(BOOK_PHONE_NUMBER, body.custname, body.phoneNo);
       
        if (bookNumber.data[0].code === '20') {
            return res.json({
                success: true,
                message: "Booking successfully"
            });
        } else {
            throw createError.BadRequest(`Book failed`);
        }
       
    } catch (error) {
        next(error);
    }
}

// ----------> list nice phone number <-----------------

/**
 * client --> To get all nice phone numbers
 * @param {* require id or paginate from request params} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const listNicePhoneNumbers = async (req, res, next) => {
    const { id } = req.params;
    try {
        const nicePhoneNumber = await tplusBookSim(LIST_NICE_PHONE_NUMBER, id);

        if (nicePhoneNumber.data[0].code === '12') {
            throw createError.BadRequest(`You can Searched number by yourseft`);
        }

        return res.json({
            success: true,
            messaage: "Get all list of nice phone numbers successfully",
            data: nicePhoneNumber.data[0],
        });
    } catch (error) {
        next(error);
    }
}

/**
 * client --> To search nice phone numbers
 * @param {* require phone number to search} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod GET
 * @access public
 * @returns 
 */
export const searchNicePhoneNumbers = async (req, res, next) => {
    const { body } = req;
    let custname = '';
    try {
        const searchNice = await tplusBookSim(SEARCH_NICE_PHONE_NUMBER, custname, body.searchPhoneNumber);

        return res.json({
            success: true,
            messaage: "Search nice phone numbers successfully",
            data: searchNice.data,
        });
    } catch (error) {
        next(error);
    }
}

/**
 * client --> To book nice phone numbers
 * @param {* require name and phone number} req 
 * @param {* send data success response} res 
 * @param {* if error is true} next 
 * @type mothod POST
 * @access private
 * @returns 
 */
export const bookNicePhoneNumber = async (req, res, next) => {
    const { body } = req;
    try {
        const bookNicePhoneNumber = await tplusBookSim(BOOK_NICE_PHONE_NUMBER, body.custname, body.phoneNo);

        if (bookNicePhoneNumber.data[0].code === '20') {
            return res.json({
                success: true,
                message: "Booking successful",
            });
        } else {
            throw createError.BadRequest(`Book failed`);
        }

    } catch (error) {
        next(error);
    }
}