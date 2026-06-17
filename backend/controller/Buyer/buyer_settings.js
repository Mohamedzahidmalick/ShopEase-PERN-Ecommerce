const transporter = require("../../services/config/old_email_verify");
const {
  sendEmailOtpService,
  verifyEmailOtpService,
  updateEmailService,
  changePassword,
} = require("../../services/settings_services");
const pool = require("../../db");


exports.changePassword = async (req, res) => {
  const buyer_id = req.user.id;

  const { old_password, new_password } = req.body;

  const result = await changePassword(
    "users",
    buyer_id,
    old_password,
    new_password,
  );

  if (!result.success) {
    return res.status(400).json({ message: result.message });
  }

  res.json({ message: "Password updated successfully" });
};
// ---------------- SEND OTP ----------------
exports.buyerSendOtp = async (req, res) => {
  const { new_email } = req.body;

  const result = await sendEmailOtpService(req.user.id, new_email, "buyer");

  if (result.error) return res.status(400).json({ message: result.error });

  await transporter.sendMail({
    to: new_email,
    subject: "Buyer Email Verification OTP",
    text: `Your OTP is: ${result.otp}`,
  });

  res.json({ message: "OTP sent" });
};

// ---------------- VERIFY OTP ----------------
exports.buyerVerifyOtp = async (req, res) => {
  try {
    const { otp, new_email } = req.body;
    const buyer = req.user;

    if (!new_email) {
      return res.status(400).json({ message: "New email required" });
    }

    // ✅ verify OTP
    const result = await verifyEmailOtpService(buyer.id, otp, "buyer");

    if (result.error) {
      return res.status(400).json({ message: result.error });
    }

    // ✅ update email
    const updateResult = await updateEmailService(buyer.id, new_email);

    if (updateResult.error) {
      return res.status(400).json({ message: updateResult.error });
    }

    // ✅ invalidate token (IMPORTANT)
    await pool.query(
      "UPDATE users SET token_version = token_version + 1 WHERE id=$1",
      [buyer.id],
    );

    console.log("✅ Buyer email updated:", new_email);

    res.json({ message: "OTP verified & email updated successfully" });
  } catch (err) {
    console.error("Buyer Verify OTP Error:", err);
    res.status(500).json({ message: "OTP verification failed" });
  }
};
