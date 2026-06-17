const pool = require("../db");

// Add to cart
exports.addToCartService = async (buyer_id, product_id, qty) => {
  const check = await pool.query(
    `SELECT * FROM cart WHERE buyer_id=$1 AND product_id=$2`,
    [buyer_id, product_id],
  );

  const product = await pool.query("SELECT stock FROM products WHERE id=$1", [
    product_id,
  ]);

  if (!product.rows.length) {
    throw new Error("Product not found");
  }

  if (product.rows[0].stock < qty) {
    throw new Error("Not enough stock available");
  }

  if (check.rows.length) {
    return await pool.query(
      `UPDATE cart SET quantity = quantity + $1 
       WHERE buyer_id=$2 AND product_id=$3 RETURNING *`,
      [qty, buyer_id, product_id],
    );
  }

  return await pool.query(
    `INSERT INTO cart (buyer_id, product_id, quantity)
     VALUES ($1, $2, $3) RETURNING *`,
    [buyer_id, product_id, qty],
  );
};

// Get Cart Items
exports.getCartService = async (buyer_id) => {
  try {
    const result = await pool.query(
      `
      SELECT 
        c.cart_id,
        c.quantity,
        c.is_saved_for_later,
        p.id AS product_id,
        p.name,
        p.price,
        p.category,(u.first_name || ' ' || u.last_name) as seller_name,

        COALESCE(
          (SELECT image_url 
           FROM product_images 
           WHERE product_id = p.id 
           LIMIT 1),
          p.image_url
        ) AS image_url

      FROM cart c
      JOIN products p ON c.product_id = p.id
      join users u on p.seller_id=u.id
      WHERE c.buyer_id = $1
      ORDER BY c.created_at DESC
      `,
      [buyer_id],
    );

    return result.rows.map((p) => ({
      ...p,
      image_url: p.image_url ? process.env.BASE_URL + p.image_url : null,
    }));
  } catch (error) {
    console.error("error in getcart", error);
    throw error;
  }
};

// Remove cart item
exports.removeCartService = async (cart_id, buyer_id) => {
  return await pool.query(
    `DELETE FROM cart WHERE cart_id=$1 AND buyer_id=$2 RETURNING *`,
    [cart_id, buyer_id],
  );
};

// Create order
exports.createOrder = async (
  buyer_id,
  totalAmount,
  status,
  payment_method,
  payment_status,
) => {
  const result = await pool.query(
    `
    INSERT INTO orders 
    (buyer_id, total_amount, status, payment_method, payment_status)
    VALUES ($1, $2, $3, $4,$5)
    RETURNING *
    `,
    [buyer_id, totalAmount, status, payment_method, payment_status],
  );

  return result.rows[0];
};

// Add order items
exports.addOrderItem = async (order_id, product_id, quantity, price) => {
  await pool.query(
    `INSERT INTO order_items (order_id, product_id, quantity, price)
     VALUES ($1, $2, $3, $4)`,
    [order_id, product_id, quantity, price],
  );
};

//Buyer orders
exports.getOrdersByBuyer = async (buyer_id, filter = "month") => {
  let condition = "";
  let values = [buyer_id];

  if (filter === "today") {
    condition = "AND created_at >= CURRENT_DATE";
  } else if (filter === "yesterday") {
    condition =
      "AND created_at >= CURRENT_DATE - INTERVAL '1 day' AND created_at < CURRENT_DATE";
  } else if (filter === "week") {
    condition = "AND created_at >= CURRENT_DATE - INTERVAL '7 days'";
  } else if (filter === "month") {
    condition = "AND created_at >= CURRENT_DATE - INTERVAL '1 month'";
  } else if (filter === "6months") {
    condition = "AND created_at >= CURRENT_DATE - INTERVAL '6 months'";
  } else {
    condition = ""; // All orders
  }

  const query = `
    SELECT *
    FROM orders
    WHERE buyer_id = $1
    ${condition}
    ORDER BY created_at DESC
  `;

  console.log("QUERY:", query); // 👈 debug

  const result = await pool.query(query, values);

  return result.rows;
};

exports.getSellerOrders = async (seller_id) => {
  const result = await pool.query(
    `
    SELECT o.order_id, o.status, o.created_at,
           p.name, p.image_url,
           oi.quantity, oi.price
    FROM orders o
    JOIN order_items oi ON o.order_id = oi.order_id
    JOIN products p ON oi.product_id = p.id
    WHERE p.seller_id = $1
    ORDER BY o.created_at DESC
    `,
    [seller_id],
  );

  return result.rows;
};

exports.Reducestock = async (product_id, quantity) => {
  const result = await pool.query(
    `
    UPDATE products
    SET stock = stock - $1
    WHERE id = $2 AND stock >= $1
    RETURNING *
    `,
    [quantity, product_id],
  );

  return result;
};

//quantity update function
exports.updateQuantityService = async (cart_id, buyer_id, quantity) => {
  const result = await pool.query(
    `UPDATE cart 
     SET quantity=$1 
     WHERE cart_id=$2 AND buyer_id=$3 
     RETURNING *`,
    [quantity, cart_id, buyer_id],
  );

  return result;
  e;
};

// Clear cart
exports.clearCart = async (buyer_id) => {
  await pool.query(`DELETE FROM cart WHERE buyer_id=$1`, [buyer_id]);
};
