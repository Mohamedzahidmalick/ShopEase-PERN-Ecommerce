const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  buyerSendOtp,
  buyerVerifyOtp,
  buyerUpdateEmail,
 changePassword
} = require("../controller/Buyer/buyer_settings");

router.put("/change-password",auth,changePassword);
router.post("/email/send-otp", auth, buyerSendOtp);
router.post("/email/verify-otp", auth ,buyerVerifyOtp);

module.exports = router;