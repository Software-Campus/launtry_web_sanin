const express = require("express");
const bcrypt = require('bcrypt');
const User = require("../models/users");
const { sendOTPviaSMS } = require("../utils/twilio");


// @des:Register api
// method:post
// api:/api/register

exports.post_register = async (req, res) => {
    console.log("req body = ", req.body);
    try {
        const { username, emailOrPhone, password } = req.body;
        const userExist = await User.findOne({emailOrPhone})
        if(userExist){
            console.log('user already exist'.red.bold);
            res.status(400).json({error:true,message:"user already exist"})
            return
        }
       
        const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, emailOrPhone, password: hashedPassword });
            newUser.save()
            console.log("new user =".bold, newUser);
        const data = {
            username: newUser.username,
            emailOrPhone: newUser.emailOrPhone,
        };
        res.status(200).json({ error: false,status:"success" , message: "user registered successfully",data });
        console.log('user register successfully'.yellow);
    } catch (error) {
        res.status(500).json({ error: true,status:"failure", message: "server error" });
    }
};
