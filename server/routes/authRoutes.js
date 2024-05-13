const express = require("express");
const { post_register, post_login, verify_otp, send_otp, create_password } = require("../controller/authController");
const { authentication } = require("../utils/jwt");
const router = express.Router();

router.post("/register", post_register);
router.post("/login", post_login);
router.post("/verify_otp", verify_otp);
router.post("/send_otp", send_otp);
router.patch("/create_password", create_password);
router.get("/authentication", authentication);

module.exports = router;
