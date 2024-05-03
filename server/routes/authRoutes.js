const express = require('express');
const { post_register } = require('../controller/authController');
const router = express.Router()



router.post('/register',post_register)






module.exports = router