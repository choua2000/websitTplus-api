import axios from 'axios';

// let url = `http://115.84.121.242:5656/webapi/smsapi.php`

import { URL_SMS } from '../../constants/index';



export const message = (number, otp) => {
    // console.log(number);
    // console.log(otp);
    let config = {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    }

    const body = new URLSearchParams();
    body.append('msisdn', number)
    body.append('msg', otp)

    axios.post(URL_SMS, body, config
    ).then((responseData) => {
        console.log(responseData.data);
        return responseData;
    }).catch((err) => {
        console.log(err);
    })
}