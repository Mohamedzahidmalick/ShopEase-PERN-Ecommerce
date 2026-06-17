const transporter = require("../../services/config/old_email_verify");
const {
  sendEmailOtpService,
  verifyEmailOtpService,
  updateEmailService,
  changePassword
} = require("../../services/settings_services");
const pool = require("../../db");



exports.changePassword = async (req, res) => {
  const seller_id = req.user.id;


  const { old_password, new_password } = req.body;

  const result = await changePassword(
    "users",
    seller_id,
    old_password,
    new_password
  );

  if (!result.success) {
    return res.status(400).json({ message: result.message });
  }

  res.json({ message: "Password updated successfully" });
};


exports.sellerSendOtp = async (req, res) => {
  const { new_email } = req.body;

  const result = await sendEmailOtpService(req.user.id, new_email, "seller");

  if (result.error) return res.status(400).json({ message: result.error });

  await transporter.sendMail({
    to: new_email,
    subject: "Seller Email Verification OTP",
    text: `Your OTP is: ${result.otp}`,
  });

  res.json({ message: "OTP sent" });
};

// ---------------- VERIFY OTP ----------------
exports.sellerVerifyOtp = async (req, res) => {
  try {
    const { otp, new_email } = req.body;
    const seller = req.user;

    if (!new_email) {
      return res.status(400).json({ message: "New email required" });
    }

    const result = await verifyEmailOtpService(
      seller.id,
      otp,
      "seller"
    );

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    // ✅ UPDATE EMAIL USING SERVICE
    const updateResult = await updateEmailService(seller.id, new_email);

    if (updateResult.error) {
      return res.status(400).json({ message: updateResult.error });
    }

    // ✅ INVALIDATE TOKEN (VERY IMPORTANT)
    await pool.query(
      "UPDATE users SET token_version = token_version + 1 WHERE id=$1",
      [seller.id]
    );

    console.log("✅ Email updated:", new_email);

    res.json({ message: "OTP verified & email updated successfully" });

  } catch (err) {
    console.error("Verify OTP Error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};