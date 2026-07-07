const pool = require("../db");

// ---------------- ADD PRODUCT ----------------
exports.addProductService = async (seller_id, data, files) => {
  const { name, description, price, category, stock } = data;

  const productResult = await pool.query(
    `INSERT INTO products (seller_id, name, description, price, category, stock)
     VALUES ($1,$2,$3,$4,$5,$6)
     RETURNING *`,
    [seller_id, name, description, price, category, stock],
  );

  const product = productResult.rows[0];

  // MULTI IMAGE INSERT
  if (files?.length > 0) {
    for (let file of files) {
      const image_url = `/uploads/${file.filename}`;
      await pool.query(
        `INSERT INTO product_images (product_id, image_url) VALUES ($1,$2)`,
        [product.id, image_url],
      );
    }
  }

  return product;
};

// ---------------- GET PRODUCT BY ID ----------------
exports.getProductByIdService = async (product_id) => {
  const productRes = await pool.query(`SELECT * FROM products WHERE id=$1 `, [
    product_id,
  ]);

  if (productRes.rows.length === 0) return null;

  const product = productRes.rows[0];

  const imgRes = await pool.query(
    `SELECT image_url 
     FROM product_images 
     WHERE product_id=$1 
     ORDER BY id ASC`,
    [product_id],
  );

  product.images = imgRes.rows.map((img) => ({
    ...img,
    image_url: process.env.BASE_URL + img.image_url,
  })); // return only real images
  product.image_url = imgRes.rows[0]
    ? process.env.BASE_URL + imgRes.rows[0].image_url
    : null; // fallback

  return product;
};

// ---------------- UPDATE PRODUCT ----------------
exports.updateProductService = async (
  product_id,
  data,
  files,
  deletedImages,
) => {
  const { name, description, price, stock, category } = data;

  // UPDATE PRODUCT DETAILS
  await pool.query(
    `UPDATE products
     SET name=$1, description=$2, price=$3, stock=$4, category=$5
     WHERE id=$6`,
    [name, description, price, stock, category, product_id],
  );

  // DELETE SELECTED IMAGES
  if (Array.isArray(deletedImages) && deletedImages.length > 0) {
    await pool.query(
      `DELETE FROM product_images
       WHERE product_id=$1 AND image_url = ANY($2::text[])`,
      [product_id, deletedImages],
    );
  }

  // ADD NEW IMAGES
  if (files && files.length > 0) {
    for (const file of files) {
      const image_url = `/uploads/${file.filename}`;
      await pool.query(
        `INSERT INTO product_images(product_id, image_url)
         VALUES ($1, $2)`,
        [product_id, image_url],
      );
    }
  }

  // FETCH CLEAN LIST OF IMAGES (AFTER DELETE & INSERT)
  const updatedImages = await pool.query(
    `SELECT image_url 
     FROM product_images 
     WHERE product_id=$1 
     ORDER BY id ASC`,
    [product_id],
  );

  return {
    id: product_id,
    images: updatedImages.rows.map((p) => ({
      ...p,
      image_url: p.image_url ? process.env.BASE_URL + p.image_url : null,
    })),
  };
};

// ---------------- SOFT DELETE ----------------

exports.deleteProductService = async (product_id) => {
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [product_id]);

    return { success: true };
  } catch (err) {
    console.log("Delete Service Error:", err);
    return { success: false, message: "Delete failed" };
  }
};

// ---------------- GET SELLER PRODUCTS ----------------
exports.getSellerProductsService = async (seller_id, query) => {
  const { search = "", category = "", page = 1, limit = 5 } = query;
  const offset = (page - 1) * limit;

  // -------- COUNT TOTAL PRODUCTS (both active + inactive) --------
  const countRes = await pool.query(
    `
    SELECT COUNT(*) 
    FROM products
    WHERE seller_id = $1
    AND ($2 = '' OR category = $2)
    AND (name ILIKE $3 OR category ILIKE $3)
    `,
    [seller_id, category, `%${search}%`],
  );

  const total = parseInt(countRes.rows[0].count);
  const totalPages = Math.ceil(total / limit);

  // -------- FETCH PAGINATED PRODUCTS (NO active filter here) --------
  const dataRes = await pool.query(
    `
    SELECT p.*,
      COALESCE(
        (SELECT image_url 
         FROM product_images 
         WHERE product_id = p.id 
         ORDER BY id ASC LIMIT 1),
        p.image_url
      ) AS image_url
    FROM products p
    WHERE p.seller_id = $1
    AND ($2 = '' OR p.category = $2)
    AND (p.name ILIKE $3 OR p.category ILIKE $3)
    ORDER BY p.created_at DESC
    LIMIT $4 OFFSET $5
    `,
    [seller_id, category, `%${search}%`, limit, offset],
  );
  //console.log("products returned:",dataRes.rows);
  const products = dataRes.rows.map((p) => ({
    ...p,
    image_url: p.image_url ? process.env.BASE_URL + p.image_url : null,
  }));
  return {
    products,
    currentPage: page,
    totalPages,
  };
};

// ---------------- BUYER (ACTIVE ONLY) ----------------
exports.getAllProductsService = async () => {
  const result = await pool.query(
    `
    SELECT p.*,
      COALESCE(
        (SELECT image_url FROM product_images 
         WHERE product_id = p.id ORDER BY id ASC LIMIT 1),
        p.image_url
      ) AS image_url
    FROM products p
   WHERE is_active_admin = true
AND is_active_seller = true
    ORDER BY created_at DESC
    `,
  );

  return result.rows.map((p) => ({
    ...p,
    image_url: p.image_url ? process.env.BASE_URL + p.image_url : null,
  }));
};

// ---------------- FILTER PRODUCTS ----------------
exports.getFilteredProductsService = async (filters) => {
  const {
    search = "",
    category = "",
    rating = 0,
    price_min = 0,
    price_max = 999999999,
    sort = "latest",
  } = filters;

  let orderBy = "p.created_at DESC";
  if (sort === "low") orderBy = "p.price ASC";
  if (sort === "high") orderBy = "p.price DESC";
  if (sort === "rating") orderBy = "p.rating DESC";

  const result = await pool.query(
    `
    SELECT p.*,
      COALESCE(
        (SELECT image_url FROM product_images 
         WHERE product_id = p.id ORDER BY id ASC LIMIT 1),
        p.image_url
      ) AS image_url
    FROM products p
    WHERE 
      p.is_active=TRUE
      AND p.price BETWEEN $1 AND $2
      AND ($3='' OR p.category=$3)
      AND (p.name ILIKE '%' || $4 || '%')
      AND ($5=0 OR p.rating >= $5)
    ORDER BY ${orderBy}
    `,
    [Number(price_min), Number(price_max), category, search, Number(rating)],
  );

  return result.rows.map((p) => ({
    ...p,
    image_url: p.image_url ? process.env.BASE_URL + p.image_url : null,
  }));
};

// ---------------- TOGGLE STATUS ----------------
exports.toggleStatusService = async (product_id, seller_id) => {
  const check = await pool.query(
    `
    SELECT is_active_admin, is_active_seller
    FROM products
    WHERE id=$1 AND seller_id=$2
    `,
    [product_id, seller_id],
  );

  if (!check.rows.length) return null;

  const p = check.rows[0];

  //  admin disabled
  if (!p.is_active_admin) {
    const error = new Error("Product disabled by admin. Contact admin.");

    error.status = 403;

    throw error;
  }

  const res = await pool.query(
    `
    UPDATE products
    SET is_active_seller = NOT is_active_seller
    WHERE id=$1 AND seller_id=$2
    RETURNING *
    `,
    [product_id, seller_id],
  );

  return res.rows[0];
};
exports.getSellerDashboardService = async (seller_id) => {
  const sales = await pool.query(
    `
    SELECT COALESCE(SUM(o.total_amount),0) AS total_sales
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE p.seller_id=$1
  `,
    [seller_id],
  );

  const pending = await pool.query(
    `
    SELECT COUNT(DISTINCT o.order_id) AS pending_orders
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE p.seller_id=$1 AND o.status='pending'
  `,
    [seller_id],
  );

  const products = await pool.query(
    `
    SELECT COUNT(*) AS total_products
    FROM products
    WHERE seller_id=$1
  `,
    [seller_id],
  );

  const completed = await pool.query(
    `
SELECT COUNT(DISTINCT o.order_id) AS completed_orders
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id
JOIN products p ON oi.product_id = p.id
WHERE p.seller_id=$1 AND o.status='completed'
`,
    [seller_id],
  );

  return {
    total_sales: sales.rows[0].total_sales,
    pending_orders: pending.rows[0].pending_orders,
    total_products: products.rows[0].total_products,
    completed_orders: completed.rows[0].completed_orders,
  };
};

exports.getBuyerDashboardService = async (buyerId) => {
  const result = await pool.query(
    `
    SELECT
      COUNT(*) AS total_orders,
      COUNT(*) FILTER (WHERE status = 'Pending') AS pending_orders,
      COUNT(*) FILTER (WHERE status = 'Completed') AS completed_orders
    FROM orders
    WHERE buyer_id = $1
    `,
    [buyerId],
  );

  const wishlist = await pool.query(
    "SELECT COUNT(*) FROM wishlist WHERE buyer_id = $1",
    [buyerId],
  );

  return {
    total_orders: parseInt(result.rows[0].total_orders),
    pending_orders: parseInt(result.rows[0].pending_orders),
    completed_orders: parseInt(result.rows[0].completed_orders),
    wishlist_count: parseInt(wishlist.rows[0]?.count || 0),
  };
};
