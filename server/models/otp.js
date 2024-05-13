const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    otp: {
        required: true,
        type: String,
    },
    expiresAt: {
        type: Date,
        default: function () {
            return new Date(Date.now() + 5 * 60 * 1000); // 5 minutes in milliseconds
        },
    },
});

const Otp = mongoose.model("otps", otpSchema);
module.exports = Otp;
