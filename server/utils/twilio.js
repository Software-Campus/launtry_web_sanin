const twilio = require("twilio");
const Otp = require("../models/otp");
const { saveOTPData, generateOTP } = require("./otpdata");
require("dotenv").config();
// twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
// Initialize Twilio client
const twilioClient = twilio(accountSid, authToken);



// Function to send OTP via SMS
exports.sendOTPviaSMS = async (phoneNumber, userId) => {
    const otp = generateOTP();
    const message = `Your OTP is: ${otp}`;
    console.log({ message });
    twilioClient.messages
        .create({
            body: message,
            from: twilioPhoneNumber,
            to: "+91" + phoneNumber,
        })
        .then(async (message) => {
            await saveOTPData(userId, otp);
            console.log("OTP sent successfully via SMS to :".yellow, message.to.bold.yellow);
        })
        .catch((error) => console.error("Error sending OTP via SMS:", error));
};


