const mongoose = require("mongoose");
const Otp = require("../models/otp");

exports.saveOTPData = async (userId, otp) => {
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const userIdExist = await Otp.findOne({ userId });
    if (userIdExist) {
        const newOtpData = await Otp.findOneAndUpdate({ userId }, { otp, expiresAt });
    } else {
        const newOtpData = new Otp({ userId, otp });
        newOtpData.save();
    }
    console.log("OTP data saved successfully ".bold.yellow);
};

// Function to generate OTP
exports.generateOTP = () => {
    console.log("otp generated".blue);
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// Function to clean up expired OTPs
async function checkOTPexpiration() {
    try {
        // Find and delete OTPs where expiresAt is less than current time
        await Otp.deleteMany({ expiresAt: { $lt: new Date() } });
    } catch (error) {
        console.error("Error cleaning up expired OTPs:", error);
    }
}

// Schedule the cleanup function to run every second
setInterval(checkOTPexpiration, 1000); // 60000 milliseconds = 1 minute
