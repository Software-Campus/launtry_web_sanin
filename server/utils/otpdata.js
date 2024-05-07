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