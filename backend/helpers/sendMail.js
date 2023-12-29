const nodemailer = require("nodemailer");
const sendMail = async (data) => {
    try {
        let transporter = nodemailer.createTransport({
            // host: "smtp.gmail.com",
            service: "gmail",
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: "tvi83447@gmail.com", // generated ethereal user
                pass: "tihr wqwo knua zfgn", // generated ethereal password
            },
        });

        // send mail with defined transport object
        let info = await transporter.sendMail(data);

        return info;
    } catch (error) {
        console.log(error);
    }
};

module.exports = sendMail;
