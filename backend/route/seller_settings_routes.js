const router = require("express").Router();
const auth = require("../middleware/auth");

const {
  sellerSendOtp,
  sellerVerifyOtp,
  sellerUpdateEmail,
  changePassword
} = require("../controller/Seller/seller_settings");
const {checkSellerApproved} = require("../middleware/checkSellerApproved");

router.put("/change-password",auth,checkSellerApproved,changePassword);
router.post("/email/send-otp", auth, checkSellerApproved, sellerSendOtp);
router.post("/email/verify-otp", auth, checkSellerApproved, sellerVerifyOtp);

module.exports = router