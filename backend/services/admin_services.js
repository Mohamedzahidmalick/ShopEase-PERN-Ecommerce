const pool = require("../db");
const bcrypt = require("bcryptjs");

exports.adminLoginService = async (
  email,
  password
) => {

  const result = await pool.query(
    "SELECT * FROM admins WHERE email=$1",
    [email]
  );

  if (result.rows.length === 0) {
    throw new Error("Admin not found");
  }

  const admin = result.rows[0];

  const valid = await bcrypt.compare(
    password,
    admin.password
  );

  if (!valid) {
    throw new Error("Wrong password");
  }

  return admin;

};
exports.getUserDetailsService = async (userId) => {
  try {
    const userRes = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    const user = userRes.rows[0];

    let stats = {};

    // ================= SELLER =================
    if (user.role === "seller") {
      const products = await pool.query(
        "SELECT COUNT(*) FROM products WHERE seller_id = $1",
        [userId]
      );

      const orders = await pool.query(`
        SELECT COUNT(DISTINCT oi.order_id) AS count
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE p.seller_id = $1
      `, [userId]);

      const revenue = await pool.query(`
        SELECT COALESCE(SUM(oi.price * oi.quantity),0) AS revenue
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE p.seller_id = $1
      `, [userId]);

      // 🔥 AOV
      const aov = await pool.query(`
        SELECT 
          COALESCE(SUM(oi.price * oi.quantity),0) / 
          NULLIF(COUNT(DISTINCT oi.order_id),0) AS aov
        FROM order_items oi
        JOIN products p ON oi.product_id = p.id
        WHERE p.seller_id = $1
      `, [userId]);

      // 🔥 Order Status Breakdown
      const status = await pool.query(`
        SELECT o.status, COUNT(*) 
        FROM orders o
        JOIN order_items oi ON o.order_id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE p.seller_id = $1
        GROUP BY o.status
      `, [userId]);

      let statusMap = { delivered: 0, pending: 0, cancelled: 0 };
      status.rows.forEach(row => {
        statusMap[row.status] = parseInt(row.count);
      });

      stats = {
        products: parseInt(products.rows[0].count),
        orders: parseInt(orders.rows[0].count),
        revenue: parseFloat(revenue.rows[0].revenue),
        aov: parseFloat(aov.rows[0].aov || 0),
        status: statusMap
      };
    }

    // ================= BUYER =================
    if (user.role === "buyer") {
      const orders = await pool.query(
        "SELECT COUNT(*) FROM orders WHERE buyer_id = $1",
        [userId]
      );

      const spent = await pool.query(
        "SELECT COALESCE(SUM(total_amount),0) AS spent FROM orders WHERE buyer_id = $1",
        [userId]
      );

      const items = await pool.query(`
        SELECT COALESCE(SUM(oi.quantity),0) AS items
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.buyer_id = $1
      `, [userId]);

      const avgSize = await pool.query(`
        SELECT 
          COALESCE(SUM(oi.quantity),0) / 
          NULLIF(COUNT(DISTINCT o.order_id),0) AS avg
        FROM order_items oi
        JOIN orders o ON oi.order_id = o.order_id
        WHERE o.buyer_id = $1
      `, [userId]);

      stats = {
        orders: parseInt(orders.rows[0].count),
        revenue: parseFloat(spent.rows[0].spent),
        items: parseInt(items.rows[0].items),
        avgSize: parseFloat(avgSize.rows[0].avg || 0)
      };
    }

    return { user, stats };

  } catch (err) {
    console.error(err);
    throw err;
  }
};

