import express from 'express';
const router = express.Router();
import axios from 'axios';
import { PACKAGE_DATA, URL_SMS } from '../constants/index';

import { message } from '../libs/helpers/sendSMS';

// import { sendEmail } from '../controllers/sendMail'
import { sendEmail } from '../libs/utils/sendEmail';

router.get('/sendMail', sendEmail);

const packageDATA = async (otp) => {
    let config = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }

    const body = new URLSearchParams();
    body.append('msisdn', '2076782728');
    body.append('msg', otp);

    return await axios.post(URL_SMS, body, config
    )
    // .then((responseData) => {
    //     // console.log(responseData);
    //     return responseData;
    // }).catch((err) => {
    //     console.log(err);
    // })
}

let pk = async (ac) => {
    return new Promise(async (resolve, reject) => {
        let config = {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
        const body = new URLSearchParams();
        body.append('action', ac);
        const result = await axios.post(PACKAGE_DATA, body, config);
        // console.log(result);
        return resolve(result)

    })
}


router.post('/sms/send', async (req, res) => {
    const data = message(2076782728, 999888);
    console.log(data);
    // console.log('You', data);
    // return res.json([]);
    // let action = 'GK';
    // // const rs = packageDATA(action)
    // const rs = await pk(action);
    // console.log("newPromise",rs.data);
    // packageDATA('123345')

    return res.json({
        success: true,
        message: "send otp",
        data: data
    });
});

export default router;