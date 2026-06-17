const pool = require("../db");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {

  try {

    const {
      page = 1,
      limit = 5,
      search = "",
      role = ""
    } = req.query;

    const offset = (page - 1) * limit;

    // COUNT

    const countRes = await pool.query(
      `
      SELECT COUNT(*)
      FROM users
      WHERE
      first_name ILIKE $1
      AND ($2 = '' OR role = $2)
      `,
      [`%${search}%`, role]
    );

    const total = parseInt(countRes.rows[0].count);

    const totalPages = Math.ceil(total / limit);

    // DATA

    const result = await pool.query(
      `
      SELECT
        id,
        first_name || ' ' || last_name AS name,
        email,
        role,
        image,
        created_at

      FROM users

      WHERE
      first_name ILIKE $1
      AND ($2 = '' OR role = $2)

      ORDER BY id DESC

      LIMIT $3 OFFSET $4
      `,
      [
        `%${search}%`,
        role,
        limit,
        offset
      ]
    );

    res.json({

      users: result.rows,
      totalPages

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed"
    });

  }

};

exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;

    await pool.query("DELETE FROM users WHERE id=$1", [id]);

    res.json({
      message: "User deleted",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Delete failed",
    });
  }
};

// ================= ADMIN GET ALL PRODUCTS =================

exports.getAllProductsAdmin = async (req, res) => {
  try {
    const { page = 1, limit = 5, search = "", category = "" } = req.query;

    const offset = (page - 1) * limit;

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.category,
        p.price,
        p.stock,
        p.is_active_admin,
        p.is_active_seller,
        p.created_at,

        COALESCE(
          (
            SELECT image_url
            FROM product_images
            WHERE product_id = p.id
            ORDER BY id ASC
            LIMIT 1
          ),
          p.image_url
        ) AS image_url,

        u.first_name || ' ' || u.last_name AS seller_name

      FROM products p

      JOIN users u
      ON p.seller_id = u.id

      WHERE p.name ILIKE $1
      AND p.category ILIKE $2

      ORDER BY p.created_at DESC

      LIMIT $3 OFFSET $4

      `,
      [`%${search}%`, `%${category}%`, limit, offset],
    );

    // add BASE_URL like seller

    const products = result.rows.map((p) => ({
      ...p,

      image_url: p.image_url ? process.env.BASE_URL + p.image_url : null,
    }));

    res.json({
      products,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
};

// ================= ADMIN DELETE PRODUCT =================

exports.deleteProductAdmin = async (req, res) => {
  try {
    const id = req.params.id;

    await pool.query("DELETE FROM products WHERE id=$1", [id]);

    res.json({
      message: "Product deleted",
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Delete failed",
    });
  }
};

// ================= ADMIN TOGGLE PRODUCT =================
exports.toggleProductAdmin = async (req, res) => {
  try {
    const id = req.params.id;

    const result = await pool.query(
      "SELECT is_active_admin FROM products WHERE id=$1",
      [id],
    );

    const current = result.rows[0].is_active_admin;

    const newStatus = !current;

    await pool.query("UPDATE products SET is_active_admin=$1 WHERE id=$2", [
      newStatus,
      id,
    ]);
    console.log("UPDATED:", id, newStatus);

    res.json({
      message: newStatus
        ? "Product enabled"
        : "Product disabled and now Seller can't enable",
      is_active_admin: newStatus,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: "Toggle failed",
    });
  }
};
exports.getAllProductsAdmin = async (req, res) => {
  try {

    const {
      page = 1,
      limit = 5,
      search = "",
      seller = ""
    } = req.query;

    const offset = (page - 1) * limit;

    // ---------- COUNT ----------

    const countRes = await pool.query(
      `
      SELECT COUNT(*)
      FROM products p
      JOIN users u ON p.seller_id = u.id

      WHERE p.name ILIKE $1

      AND (
        $2 = ''
        OR u.first_name || ' ' || u.last_name ILIKE $2
      )
      `,
      [`%${search}%`, `%${seller}%`]
    );

    const total = parseInt(countRes.rows[0].count);

    const totalPages = Math.ceil(total / limit);

    // ---------- DATA ----------

    const result = await pool.query(
      `
      SELECT
        p.id,
        p.name,
        p.category,
        p.price,
        p.stock,
        p.is_active_admin,
        p.is_active_seller,
        p.created_at,

        u.first_name || ' ' || u.last_name AS seller_name,
        u.email,
        u.role,

        COALESCE(
          (
            SELECT image_url
            FROM product_images
            WHERE product_id = p.id
            LIMIT 1
          ),
          p.image_url
        ) AS image_url

      FROM products p

      JOIN users u
      ON p.seller_id = u.id

      WHERE p.name ILIKE $1

      AND (
        $2 = ''
        OR u.first_name || ' ' || u.last_name ILIKE $2
      )

      ORDER BY p.created_at DESC

      LIMIT $3 OFFSET $4
      `,
      [
        `%${search}%`,
        `%${seller}%`,
        limit,
        offset
      ]
    );

    const products = result.rows.map((p) => ({
      ...p,
      image_url: p.image_url
        ? process.env.BASE_URL + p.image_url
        : null
    }));

    res.json({
      products,
      totalPages
    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed"
    });

  }
};

exports.getAdminStats = async (req, res) => {

  try {

    const users = await pool.query(
      `SELECT COUNT(*) FROM users`
    );

    const sellers = await pool.query(
      `SELECT COUNT(*) FROM users WHERE role='seller' OR role='both'`
    );

    const buyers = await pool.query(
      `SELECT COUNT(*) FROM users WHERE role='buyer'`
    );

    const products = await pool.query(
      `SELECT COUNT(*) FROM products`
    );

    // optional (only if orders table exists)

    let ordersCount = 0;

    try {

      const orders = await pool.query(
        `SELECT COUNT(*) FROM orders`
      );

      ordersCount = orders.rows[0].count;

    } catch {
      ordersCount = 0;
    }

    res.json({

      users: users.rows[0].count,
      sellers: sellers.rows[0].count,
      buyers: buyers.rows[0].count,
      products: products.rows[0].count,
      orders: ordersCount

    });

  } catch (err) {

    console.log(err);

    res.status(500).json({
      message: "Failed"
    });

  }

};