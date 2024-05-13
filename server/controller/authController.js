require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/users");
const { sendOTPviaSMS } = require("../utils/twilio");
const { sendOTPviaEmail } = require("../utils/nodeMailer");
const Otp = require("../models/otp");
const { createJWT } = require("../utils/jwt");

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneRegex = /^(\+\d{1,3})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

// @des:Register api
// method:post
// api:/register

exports.post_register = async (req, res) => {
    console.log("req body = ", req.body);
    try {
        const { username, emailOrPhone, password } = req.body;
        const userExist = await User.findOne({ emailOrPhone }); // checking if the email or phone number is already use
        if (userExist) {
            console.log("user already exist".red.bold);
            res.status(400).json({ error: true, message: "user already exist" });
            return;
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, emailOrPhone, password: hashedPassword });
        newUser.save();
        console.log("new user =".bold, newUser);
        const data = {
            username: newUser.username,
            emailOrPhone: newUser.emailOrPhone,
        };
        const token = await createJWT(data);
        console.log({ token });

        res.status(200).json({ error: false, status: true, message: "user registered successfully", data, token });
        console.log("user register successfully".yellow);
    } catch (error) {
        console.log("server error ", error);
        res.status(500).json({ error: true, status: true, message: "server error" });
    }
};

// @des:Login api
// method:post
// api:/login

exports.post_login = async (req, res) => {
    console.log("req body =", req.body);
    try {
        const { emailOrPhone, password } = req.body;
        const user = await User.findOne({ emailOrPhone });
        if (!user) {
            console.log("user not exist".red.bold);
            res.status(400).json({ error: true, message: "user not exist" });
            return;
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            console.log("password is incorrect".red.bold);
            res.status(400).json({ error: true, message: "password is incorrect" });
            return;
        }
        if (emailRegex.test(user.emailOrPhone)) {
            console.log("the request is Email".blue);
            sendOTPviaEmail(user.emailOrPhone, user._id);
        } else if (phoneRegex.test(user.emailOrPhone)) {
            console.log("the request is Phone number".blue);
            sendOTPviaSMS(user.emailOrPhone, user._id);
        }
        const data = {
            userId: user._id,
            username: user.username,
            emailOrPhone: user.emailOrPhone,
        };
        res.status(200).json({ error: false, status: true, message: "OTP sended successfully", data });
    } catch (error) {
        console.log("server error ", error);
        res.status(500).json({ error: true, status: false, message: "server error" });
    }
};

// @des:otp api
// method:post
// api:/verify_otp

exports.verify_otp = async (req, res) => {
    console.log(req.body);
    try {
        const { otp, userId } = req.body;
        const otpExist = await Otp.findOne({ userId, otp });
        console.log({ otpExist });
        if (otpExist) {
            const user = await User.findById(userId, { password: 0 });
            console.log({ user });
            if (user) {
                console.log("user logined successfully".yellow);
                res.status(200).json({ error: false, status: true, message: "user logined successfully", data: user });
            }
        } else {
            res.status(400).json({ error: true, message: "OTP is incorrect" });
        }
    } catch (error) {
        console.log("server error ", error);
        res.status(500).json({ error: true, status: false, message: "server error" });
    }
};

// @des:otp api
// method:post
// api:/send_otp

exports.send_otp = async (req, res) => {
    console.log(req.body);
    try {
        const { emailOrPhone, userId } = req.body;
        let user = null;
        if (userId) {
            user = await User.findById(userId);
        } else if (emailOrPhone) {
            user = await User.findOne({ emailOrPhone });
        }
        console.log("user = ", user);
        if (!user) {
            console.log("user not exist".bold.red);
            res.status(400).json({ error: true, message: "user not exist" });
            return;
        }
        if (emailRegex.test(user.emailOrPhone)) {
            console.log("the request is Email".blue);
            sendOTPviaEmail(user.emailOrPhone, user._id);
        } else if (phoneRegex.test(user.emailOrPhone)) {
            console.log("the request is Phone number".blue);
            sendOTPviaSMS(user.emailOrPhone, user._id);
        }
        const data = {
            userId: user._id,
            username: user.username,
            emailOrPhone: user.emailOrPhone,
        };
        res.status(200).json({ error: false, status: true, message: "OTP sended successfully", data });
    } catch (error) {
        console.log("server error ", error);
        res.status(500).json({ error: true, status: false, message: "server error" });
    }
};

// @des:otp api
// method:post
// api:/create_password

exports.create_password = async (req, res) => {
    console.log(req.body);
    try {
        const { userId, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const updatedUser = await User.findByIdAndUpdate(userId, { password: hashedPassword });
        console.log("updated user =", updatedUser);
        res.status(200).json({ error: false, status: true, message: "Password updated successfully" });
    } catch (error) {
        console.log("server error ", error);
        res.status(500).json({ error: true, status: false, message: "server error" });
    }
};
