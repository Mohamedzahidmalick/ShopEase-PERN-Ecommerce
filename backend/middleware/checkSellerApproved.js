const pool = require("../db");

exports.checkSellerApproved = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      "SELECT seller_status FROM users WHERE id=$1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (result.rows[0].seller_status !== "approved") {
      return res.status(403).json({
        message: "Access denied. Seller not approved",
      });
    }

    next(); //  allow request

  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Error checking seller status",
    });
  }
};