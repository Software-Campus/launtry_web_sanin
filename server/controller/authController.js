const express = require("express");
require("dotenv").config();
const bcrypt = require("bcrypt");
const User = require("../models/users");
const { sendOTPviaSMS } = require("../utils/twilio");
const { sendOTPviaEmail } = require("../utils/nodeMailer");

const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const phoneRegex = /^(\+\d{1,3})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/;

// @des:Register api
// method:post
// api:/api/register

exports.post_register = async (req, res) => {
    console.log("req body = ", req.body);
    try {
        const { username, emailOrPhone, password } = req.body;
        const userExist = await User.findOne({ emailOrPhone });   // checking if the email or phone number is already use
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
        res.status(200).json({ error: false, status: "success", message: "user registered successfully", data });
        console.log("user register successfully".yellow);
    } catch (error) {
        res.status(500).json({ error: true, status: "failure", message: "server error" });
    }
};

// @des:Login api
// method:post
// api:/api/login

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
            const email = emailOrPhone;
            sendOTPviaEmail(user.emailOrPhone,user._id);
        } else if (phoneRegex.test(user.emailOrPhone)) {
            console.log("the request is Phone number".blue);
            sendOTPviaSMS(user.emailOrPhone, user._id);
        }
        const data = {
            username: user.username,
            emailOrPhone: user.emailOrPhone,
        }
        res.status(200).json({ error: false, status: "success", message: "OTP sended successfully", data });


    } catch (error) {
        res.status(500).json({ error: true, status: "failure", message: "server error" });
    }
};


// @des:otp api
// method:post
// api:/api/verify_otp

exports.verify_otp = async (req,res)=>{
    console.log(req.body);
    try {
        const {otp} = req.body
        
    } catch (error) {
        
    }

}