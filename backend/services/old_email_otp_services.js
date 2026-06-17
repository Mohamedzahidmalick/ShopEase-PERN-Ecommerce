const pool = require("../db");
const transporter = require("./config/old_email_verify");

// ---------------- SAVE OTP ----------------
exports.saveOtp = async (user_id, otp, expires_at, type) => {
  return await pool.query(
    `INSERT INTO email_otps (user_id, otp, expires_at, type)
     VALUES ($1, $2, $3, $4)`,
    [user_id, otp, expires_at, type]
  );
};

// ---------------- VERIFY OTP ----------------
exports.verifyOtp = async (user_id, otp, type) => {
  const result = await pool.query(
    `SELECT * FROM email_otps
     WHERE user_id=$1 AND otp=$2 AND type=$3
     ORDER BY id DESC LIMIT 1`,
    [user_id, otp, type]
  );

  return result.rows[0]; // may be undefined
};

// ---------------- SEND EMAIL ----------------
exports.sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to: email,
    subject: "ShopEase Email Verification OTP",
    text: `Your OTP is: ${otp}. Valid for 5 minutes.`,
  });
};