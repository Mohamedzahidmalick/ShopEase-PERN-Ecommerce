const jwt = require("jsonwebtoken");
const pool = require("../db");
const { adminLoginService } = require("../services/admin_services");
const { getUserDetailsService } = require("../services/admin_services");

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await adminLoginService(email, password);

    const token = jwt.sign(
      {
        id: admin.id,
        role: "admin",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.json({
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        phone_no: admin.phone_no,
        image: admin.image,
        role: "admin",
      },
    });
  } catch (err) {
    res.status(400).json({
      message: err.message,
    });
  }
};

// GET pending sellers
exports.getSellers = async (req, res) => {
  try {
    const { status } = req.query;

    let query = `
      SELECT id, first_name, last_name, email, seller_status,created_at
      FROM users
      WHERE role='seller' AND is_verified = true`;

    let values = [];

    if (status) {
      query += ` AND seller_status = $1`;
      values.push(status);
    }

    const result = await pool.query(query, values);

    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching sellers", err);
    res.status(500).json({ message: "Error fetching sellers" });
  }
};

// APPROVE seller
exports.approveSeller = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query("UPDATE users SET seller_status='approved', is_seller_approved=true WHERE id=$1", [
      id,
    ]);

    res.json({ message: "Seller approved" });
  } catch (err) {
    console.error("Error approving seller", err);
    res.status(500).json({ message: "Error approving seller" });
  }
};

// REJECT seller
exports.rejectSeller = async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("UPDATE users SET seller_status='rejected', is_seller_approved=false WHERE id=$1", [
      id,
    ]);

    res.json({ message: "Seller rejected" });
  } catch (err) {
    console.error("Error rejecting seller", err);
    res.status(500).json({ message: "Error rejecting seller" });
  }
};

exports.restoreSeller = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      "UPDATE users SET seller_status = 'pending', is_seller_approved = false WHERE id = $1",
      [id],
    );

    res.json({ message: "Seller restored to pending" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error restoring seller" });
  }
};
exports.getUserDetails = async (req, res) => {
  try {
    const userId = req.params.id;

    const data = await getUserDetailsService(userId);

    res.json(data);
  } catch (err) {
    console.error("User details error", err);
    res.status(500).json({ message: "Error fetching user details" });
  }
};

exports.toggleBlockUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await pool.query(
      "SELECT is_blocked FROM users WHERE id = $1",
      [id],
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const newStatus = !user.rows[0].is_blocked;

    await pool.query("UPDATE users SET is_blocked = $1 WHERE id = $2", [
      newStatus,
      id,
    ]);

    const response = {
      message: newStatus ? "User Blocked" : "User Unblocked",
      is_blocked: newStatus,
    };

    console.log(" Block API Response:", response);

    return res.status(200).json(response);
  } catch (err) {
    console.error(" BLOCK ERROR:", err);

    return res.status(500).json({
      message: "Error updating user",
    });
  }
};
