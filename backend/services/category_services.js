const pool = require("../db");

exports.getAllCategoriesService = async () => {
  const result = await pool.query(
    `SELECT id, name FROM categories ORDER BY name ASC`
  );
  return result.rows;
};
