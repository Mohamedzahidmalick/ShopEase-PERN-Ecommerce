const express = require("express");
const router = express.Router();
const { signup, login } = require("../controller/auth_controller");
const { sendOTP, verifyOTP } = require("../controller/otp_controller");
const auth = require("../middleware/auth");
const { getMe } = require("../controller/auth_controller");

router.post("/signup", signup);
router.post("/login", login);
router.get("/me", auth, getMe);
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

module.exports = router;
