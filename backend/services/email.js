const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendEmailOTP(to, otp) {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: "Your OTP Code",
    html: `<h1>${otp}</h1>`,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = { sendEmailOTP };
