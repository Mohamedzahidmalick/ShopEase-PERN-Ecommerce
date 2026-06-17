const pool = require("../db");

exports.addWishlistService = async (buyer_id, product_id) => {

  await pool.query(
    "INSERT INTO wishlist (buyer_id, product_id) VALUES ($1,$2) ON CONFLICT DO NOTHING",
    [buyer_id, product_id]
  );

};


exports.removeWishlistService = async (buyer_id, product_id) => {

  await pool.query(
    "DELETE FROM wishlist WHERE buyer_id=$1 AND product_id=$2",
    [buyer_id, product_id]
  );

};


exports.getWishlistService = async (buyer_id) => {

  const result = await pool.query(
`
SELECT
  w.product_id,
  p.name,
  p.price,

  COALESCE(
    (
      SELECT image_url
      FROM product_images
      WHERE product_id = p.id
      ORDER BY id ASC
      LIMIT 1
    ),
    p.image_url
  ) AS image_url

FROM wishlist w
JOIN products p ON w.product_id = p.id
WHERE w.buyer_id = $1
`,
[buyer_id]
);

  return result.rows;

};