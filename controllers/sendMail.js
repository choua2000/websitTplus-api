import nodemailer from 'nodemailer';


// let transporter = nodemailer.createTransport({
//     service: 'gmail',
//     // host: "smtp.ethereal.email",
//     // port: 587,
//     // secure: false, // true for 465, false for other ports
//     auth: {
//         user: 'oska.deverloper2022@gmail.com',
//         pass: 'tquhetenrkxjlzfg'
//     }
// });

// let mailOptions = {
//     from: 'oska.deverloper2022@gmail.com',
//     to: 'hormphaengdev@gmail.com',
//     subject: 'Sending Email using Node.js',
//     text: 'That was easy!'
// };

// transporter.sendMail(mailOptions, function (error, info) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// });

export const sendEmail = () => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        // secure: false, // true for 465, false for other ports
        
        auth: {
            user: 'oska.developer2022@gmail.com',
            pass: 'jnnsdmzygnclhpnn'
        }
    });
    
    let mailOptions = {
        from: 'oska.deverloper2022@gmail.com',
        to: 'hormphaengdev@gmail.com',
        subject: 'Sending Email using Node.js',
        text: 'That was easy!'
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}