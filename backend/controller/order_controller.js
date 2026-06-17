const pool = require("../db");

//Buyer Orders
exports.getBuyerOrders = async (req, res) => {
  try {
    const buyer_id = req.user.id;
    const { filter } = req.query;

    const orders = await getOrdersByBuyer(buyer_id, filter);

    res.json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Failed to load orders" });
  }
};

exports.getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    //console.log("Fetching details for order ID:", id);
    //console.log("Logged in user:",req.user.id);


    if (!id) {
      return res.status(400).json({ message: "Order ID is required" });
    }

    const order = await pool.query("SELECT * FROM orders WHERE order_id=$1", 
      [id]
  );

  if (order.rows.length===0){
    return res.status(404).json({message:"Order not found"});
  }


    const items = await pool.query(
      `SELECT oi.*, p.name,
        (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1) AS image_url
       FROM order_items oi
       JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id=$1`,
      [id],
    );
    // console.log("Items from DB:", items.rows);
    const processedItems = items.rows.map((item) => ({
      ...item,
      image_url: item.image_url ? process.env.BASE_URL + item.image_url : null,
    }));
    res.json({
      order: order.rows[0],
      items: processedItems,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching order details" });
  }
};

//Seller Orders
exports.getSellerOrders = async (req, res) => {
  try {
    const seller_id = req.user.id;

    const orders = await pool.query(
      `SELECT 
        o.order_id,
        o.created_at,
        o.status,
        oi.quantity,
        oi.price,
        p.name,
        COALESCE(
          (SELECT image_url FROM product_images WHERE product_id = p.id LIMIT 1),
          p.image_url
        ) AS image_url
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      WHERE p.seller_id = $1
      ORDER BY o.created_at DESC`,
      [seller_id],
    );

    const processed = orders.rows.map((row) => ({
      ...row,
      image_url: row.image_url ? process.env.BASE_URL + row.image_url : null,
    }));

    res.json(processed);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching seller orders" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await pool.query("UPDATE orders SET status=$1 WHERE order_id=$2", [
      status,
      id,
    ]);

    res.json({ message: "Order updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};
