import nodemailer from 'nodemailer';
require('dotenv').config()


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
// const outputOption = `
// <p>You have a new contact request</p>
// <h3>Contact Details</h3>
// <ul>  
//   <li>Name: ${name}</li>
//   <li>Company: Phonehong</li>
//   <li>Email: ${email}</li>
//   <li>Phone: 02077779999</li>
// </ul>
// <h3>Descriptions</h3>
// <p>${decription}</p>
// `;

export const sendEmail = async(title, name, email, decription) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER, // youremail@gmail.com
            pass: process.env.MAIL_PASS, // yourpassword
        },
        tls:{
            rejectUnauthorized:false
          }
    });

    const outputOption = `
    <p>You have a new contact request</p>
    <h3>Contact Details</h3>
    <ul>  
      <li>Name: ${name}</li>
      <li>Email: ${email}</li>
    </ul>
    <h3>Descriptions</h3>
    <p>${decription}</p>
  `;
    
    let mailOptions = {
        from: process.env.MAIL_USER, // youremail@gmail.com
        // to: 'hormphaengdev@gmail.com',  // myfriend@yahoo.com
        to: process.env.MAIL_TPLUS,  // myfriend@yahoo.com
        subject: `${title}`, // subject contacts
        // text: '',
        html: outputOption, // html body
    };
    
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}