const express = require('express');
const { post_register, post_login, verify_otp } = require('../controller/authController');
const router = express.Router()



router.post('/register',post_register)
router.post('/login',post_login)
router.post('/verify_otp',verify_otp)






module.exports = router