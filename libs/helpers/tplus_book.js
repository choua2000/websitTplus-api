import axios from 'axios';
import { TPLUS_BOOK_URL, USER_BOOK, PASS_BOOK } from '../../constants/index';

/**
 * To list all phone numbers and books
 * @param {*} action 
 * @param {*} custname 
 * @param {*} phoneNo 
 * @param {*} price 
 * @returns 
 */
export const tplusBookSim = async (action, custname, phoneNo, price) => {
    return new Promise(async (resolve, reject) => {
        let config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }

        const body = new URLSearchParams();
        body.append('user', USER_BOOK);
        body.append('passw', PASS_BOOK);
        body.append('action', action);
        body.append('custname', custname);
        body.append('phoneno', phoneNo);
        body.append('price', price);

        const result = await axios.post(TPLUS_BOOK_URL, body, config);

        return resolve(result);
    });
}