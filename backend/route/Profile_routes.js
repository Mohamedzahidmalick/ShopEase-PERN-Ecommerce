const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { checkSellerApproved } = require("../middleware/checkSellerApproved");

const { updateProfile } = require("../controller/Profile_controller");
const profileUpload = require("../middleware/profile_upload");
const adminauth = require("../middleware/Adminauth");
const { updateAdminProfile } = require("../controller/Profile_controller");

router.put("/buyer", auth, profileUpload.single("image"), updateProfile);

router.put(
  "/seller",
  auth,
  checkSellerApproved,
  profileUpload.single("image"),
  updateProfile,
);

router.put(
  "/admin",
  adminauth,
  profileUpload.single("image"),
  updateAdminProfile,
);

//router.put("/buyer", auth, updateProfile);

//router.put("/seller", auth, updateProfile);

module.exports = router;
