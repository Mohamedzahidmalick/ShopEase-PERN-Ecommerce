const jwt = require("jsonwebtoken");
const pool = require("../db");

const { signupService, loginService } = require("../services/auth_services");

exports.signup = async (req, res) => {
  try {
    const { first_name, last_name, email, phone_no, password, role } = req.body;

    await signupService(first_name, last_name, email, phone_no, password, role);

    res.json({
      message: "Signup success",
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log(req.body);
    const user = await loginService(email, password);

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
        is_blocked: user.is_blocked,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );
    res.json({
      token,
      role: user.role,
      user: {
        id: user.id,
        name: user.first_name + " " + user.last_name,
        email: user.email,
        phone_no: user.phone_no,
        role: user.role,
        image: user.image,
        status: user.status,
        seller_status: user.seller_status,
        is_seller_approved: user.is_seller_approved,
        is_verified: user.is_verified,
      },
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await pool.query(
      "SELECT id, email, role, status, seller_status, is_seller_approved FROM users WHERE id = $1",
      [req.user.id],
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching user" });
  }
};
