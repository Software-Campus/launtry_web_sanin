const nodemailer = require("nodemailer");
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

exports.sendMailFunction = (email) => {
    let mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Login Message",
        html: `<h1>Welcome to OLX</h1>
           <h4>Thank you for signing up!</h4>`,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error occurred:", error);
        } else {
            console.log("Email sent successfully:".yellow, info.messageId);
        }
    });
};

// Function to generate OTP
exports.generateOTP = () => {
    console.log("otp generated".blue);
    return Math.floor(100000 + Math.random() * 900000).toString();
};
