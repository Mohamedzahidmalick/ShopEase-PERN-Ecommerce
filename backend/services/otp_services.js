const pool = require("../db");

exports.saveOTPService = async (email, otp, expiresAt) => {
  await pool.query(
    `
    INSERT INTO otp_verifications
    (email, otp, expires_at)
    VALUES ($1,$2,$3)
    `,
    [email, otp, expiresAt],
  );
};

exports.verifyOTPService = async (email, otp) => {
  const result = await pool.query(
    `
    SELECT *
    FROM otp_verifications
    WHERE email=$1
    AND otp=$2
    AND expires_at > NOW()
    ORDER BY id DESC
    LIMIT 1
    `,
    [email, otp],
  );

  return result.rows.length > 0;
};

// 🔥 MARK USER AS VERIFIED (IMPORTANT)
exports.hasbeenVerifiedService = async (email) => {
  await pool.query(
    `
    UPDATE users
    SET is_verified = true
    WHERE email = $1
    `,
    [email]
  );
};


// 🔥 DELETE OTP AFTER USE (BEST PRACTICE)
exports.deleteOTPService = async (email) => {
  await pool.query(
    `
    DELETE FROM otp_verifications
    WHERE email = $1
    `,
    [email]
  );
};