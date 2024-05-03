const twilio = require('twilio');
require('dotenv').config()
// twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// Initialize Twilio client
const twilioClient = twilio(accountSid, authToken);


// Function to generate OTP
const generateOTP = () => {
    console.log("otp generated".blue);
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Function to send OTP via SMS
exports.sendOTPviaSMS = (phoneNumber) => {
    const otp = generateOTP()
    const message = `Your OTP is: ${otp}`;
    console.log({message});
    twilioClient.messages
        .create({
            body: message,
            from: twilioPhoneNumber,
            to: "+91" + phoneNumber,
        })
        .then((message) => console.log("OTP sent successfully via SMS to :".yellow, message.to.bold.yellow))
        .catch((error) => console.error("Error sending OTP via SMS:", error));
};