const pool = require("../db");
const bcrypt = require("bcryptjs");


exports.changePassword = async (table, user_id, old_password, new_password) => {
  try {
    // 1. Fetch current password
    const result = await pool.query(
        `SELECT password FROM ${table} WHERE id=$1`,
      [user_id]
    );

    if (result.rows.length === 0) {
      return { success: false, message: "User not found" };
    }

    const hashedPassword = result.rows[0].password;

    // 2. Compare
    const match = await bcrypt.compare(old_password, hashedPassword);
    if (!match) {
      return { success: false, message: "Old password is incorrect" };
    }

    // 3. Hash new password
    const newHash = await bcrypt.hash(new_password, 10);

    // 4. Update
    await pool.query(
        `UPDATE ${table} SET password=$1 WHERE id=$2`,
      [newHash, user_id]
    );

    return { success: true };
  } catch (err) {
    console.error("Change Password Error:", err);
    return { success: false, message: "Server error" };
  }
};
// ---------------- SEND OTP SERVICE ----------------
exports.sendEmailOtpService = async (user_id, new_email, type) => {
  try{
  // Check email belongs to user
  const exists = await pool.query("SELECT id FROM users WHERE email=$1", [
    new_email
  ]);

  if (exists.rows.length > 0)
    return { error: "Email already exists" };

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 5 * 60 * 1000);

  await pool.query(
    `INSERT INTO email_otps (user_id, otp, expires_at, type)
     VALUES ($1, $2, $3, $4)`,
    [user_id, otp, expires, type]
  );

  return { otp }; // Controller will send using nodemailer
}catch(err){
  console.log(err);
  return{error:"OTP failed"};

}


};

// ---------------- VERIFY OTP SERVICE ----------------
exports.verifyEmailOtpService = async (user_id, otp, type) => {
  const result = await pool.query(
    `SELECT * FROM email_otps
     WHERE user_id=$1 AND otp=$2 AND type=$3
     ORDER BY id DESC LIMIT 1`,
    [user_id, otp, type]
  );

  if (result.rows.length === 0)
    return { error: "Invalid OTP" };

  if (new Date(result.rows[0].expires_at) < new Date())
    return { error: "OTP expired" };

  return { success: true };
};

// ---------------- UPDATE EMAIL SERVICE ----------------
exports.updateEmailService = async (user_id, new_email) => {
  try {
    if(!new_email) return{
      error:"Email is missing"
    };
    // Check if email exists
    const exists = await pool.query(
      "SELECT id FROM users WHERE email=$1",
      [new_email]
    );

    if (exists.rows.length > 0)
      return { error: "Email already exists" };

    // Update inside USERS TABLE
    await pool.query(
      "UPDATE users SET email=$1 WHERE id=$2",
      [new_email, user_id]
    );

    return { success: true };
  } catch (err) {
    console.log("Update Email Error:", err);
    return { error: "Update failed" };
  }
};