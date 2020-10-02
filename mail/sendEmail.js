const nodemailer = require("nodemailer");

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(email, subject, text, tryAgain = true) {
    console.log('sendEmail', email, subject, text)
    try{   // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: process.env.EMAIL_SECURE, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USERNAME, // generated ethereal user
            pass: process.env.EMAIL_PASSOWRD, // generated ethereal password
        }
        });
    
        // send mail with defined transport object
        let info = await transporter.sendMail({
        from: `"${process.env.SERVICE_NAME}" <${process.env.EMAIL}>`, // sender address
        to: email, // list of receivers
        subject: `${subject}`, // Subject line
        text:  `${text}`, // plain text body
 //       html: "<b>Hello world?</b>" // html body
        });
    
        console.log("Message sent: %s", info.messageId);
        return {status: 200}
    } catch   (error) {
        console.error('Message not sent:', error)
        if (tryAgain === true) return await sendEmail(email, subject, text, false);
        return {status: 500, msg: error, tryAgain}
    }
}

exports.sendEmail = sendEmail;

//sendEmail('michal.jadach@gmail.com', 'test', 'text');
