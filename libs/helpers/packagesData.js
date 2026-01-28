import axios from "axios";
import { PACKAGE_DATA } from '../../constants/index';

/**
 * Get list of packages
 * @param {*require action, tel, telephone and code from request} action 
 * @returns 
 */
export const packageData = async (action, tel, telephone, code) => {
    return new Promise(async (resolve, reject) => {
        let config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        // set parameter to option body
        const body = new URLSearchParams();
        body.append('action', action);
        body.append('tel', tel);
        body.append('telephone', telephone);
        body.append('code', code);
        const result = await axios.post(PACKAGE_DATA, body, config);

        return resolve(result)
    });
}