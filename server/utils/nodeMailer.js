const nodemailer = require("nodemailer");
const Otp = require("../models/otp");
const { saveOTPData, generateOTP } = require("./otpdata");
require("dotenv").config();

// Create a transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST, //  email SMTP host
    port: process.env.EMAIL_PORT, //  email SMTP port
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER, //  email address
        pass: process.env.EMAIL_PASSWORD, //  email password
    },
});

exports.sendOTPviaEmail = async (email, userId) => {
    const otp = generateOTP();
    const message = `Your OTP is: ${otp}`;
    console.log({ message });
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Login OTP",
        html: message,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error occurred:", error);
        } else {
            saveOTPData(userId, otp);
            console.log("Email sent successfully to :".yellow, info.accepted);
        }
    });
};
