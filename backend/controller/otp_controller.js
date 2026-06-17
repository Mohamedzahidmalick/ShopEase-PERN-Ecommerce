const {
  saveOTPService,
  verifyOTPService,
  hasbeenVerifiedService,
  deleteOTPService
} = require("../services/otp_services");

const { sendEmailOTP } = require("../services/email");

const generateOTP = () =>
  Math.floor(100000 + Math.random() * 900000).toString();

exports.sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    const otp = generateOTP();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await saveOTPService(email, otp, expiresAt);

    await sendEmailOTP(email, otp);

    res.json({
      message: "OTP sent",
    });
  } catch (err) {
    res.status(500).json({
      message: "OTP failed",
    });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const valid = await verifyOTPService(email, otp);

    if (!valid) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    await hasbeenVerifiedService(email);

    await deleteOTPService(email);
    
    res.json({
      message: "OTP verified",
    });
  } catch (err) {
    res.status(500).json({
      message: "Verify failed",
    });
  }
};
