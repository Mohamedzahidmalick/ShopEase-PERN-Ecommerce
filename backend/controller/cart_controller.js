const {
  addToCartService,
  getCartService,
  removeCartService,
  createOrder,
  addOrderItem,
  clearCart,
  getOrdersByBuyer,
  getSellerOrders,
  updateQuantityService,
  Reducestock,
} = require("../services/cart_services");
const pool = require("../db");

exports.addToCart = async (req, res) => {
  try {
    const buyer_id = req.user.id;
    const { product_id, quantity } = req.body;

    const CartItem = await addToCartService(
      buyer_id,
      product_id,
      quantity || 1,
    );

    res.json({ message: "Added to cart", data: CartItem.rows[0] });
  } catch (err) {
    console.log("Add to Cart error", err);
    res.status(500).json({ message: "Error in adding to cart" });
  }
};

exports.getCart = async (req, res) => {
  try {
    const buyer_id = req.user.id; // important
    const cart = await getCartService(buyer_id);
    res.json(cart);
  } catch (error) {
    console.error("error in getcart", error);
    res.status(500).json({ message: "Failed to load cart" });
  }
};

exports.removeCart = async (req, res) => {
  try {
    const buyer_id = req.user.id;
    const cart_id = req.params.cart_id;

    const removed = await removeCartService(cart_id, buyer_id);

    if (removed.rowCount === 0) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Item removed successfully" });
  } catch (error) {
    console.error("Remove Cart Error:", error);
    res.status(500).json({ message: "Unable to remove item" });
  }
};

exports.checkout = async (req, res) => {
  try {
    const buyer_id = req.user.id;

    const { payment_method } = req.body;

    if (!payment_method) {
      return res.status(400).json({ message: "Payment Failed" });
    }

    console.log("Payment Method:", payment_method);

    //  Get cart items and exclude saved items
    const items = (await getCartService(buyer_id)).filter(
      (item) => !item.is_saved_for_later,
    );

    if (items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    //  Calculate order total
    let totalAmount = 0;
    items.forEach((item) => {
      totalAmount += item.price * item.quantity;
    });

    console.log("Total Amount:", totalAmount);

    const isPaymentSuccess = true;

    const payment_status = isPaymentSuccess ? "Paid" : "Unpaid";

    const status = isPaymentSuccess ? "Pending" : "Payment Failed";

    if (!isPaymentSuccess) {
      return res.status(400).json({ message: "Payment Failed" });
    }

    //  Create order (returns order_id)
    const order = await createOrder(
      buyer_id,
      totalAmount,
      status,
      payment_method,
      payment_status,
    );

    //  Insert each cart item into order_items table
    for (const item of items) {
      const stockUpdate = await Reducestock(item.product_id, item.quantity);

      if (stockUpdate.rowCount === 0) {
        return res.status(400).json({
          message: `${item.name} is out of stock`,
        });
      }

      await addOrderItem(
        order.order_id,
        item.product_id,
        item.quantity,
        item.price,
      );
    }

    //  Clear cart
    await clearCart(buyer_id);

    return res.json({
      message: "Checkout completed",
      order_id: order.order_id,
      total_amount: totalAmount,
      items,
    });
  } catch (err) {
    console.error("Checkout Error:", err);
    res.status(500).json({ message: "Checkout failed" });
  }
};

exports.updateQuantity = async (req, res) => {
  try {
    const buyer_id = req.user.id;
    const cart_id = req.params.cart_id;
    const { quantity } = req.body;

    if (quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const updated = await updateQuantityService(cart_id, buyer_id, quantity);

    if (updated.rowCount === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Quantity updated", item: updated.rows[0] });
  } catch (err) {
    console.error("Update Quantity Error:", err);
    res.status(500).json({ message: "Failed to update quantity" });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { order_id } = req.params;

    await pool.query(`UPDATE orders SET status=$1 WHERE order_id=$2`, [
      status,
      order_id,
    ]);

    res.json({ message: "Order status updated" });
  } catch (err) {
    console.error("Status Update Error:", err);
    res.status(500).json({ message: "Failed to update status" });
  }
};

exports.getBuyerOrders = async (req, res) => {
  try {
    const buyer_id = req.user.id;
    const { filter } = req.query;
    console.log("Filter received:", filter);
    const orders = await getOrdersByBuyer(buyer_id, filter);

    res.json(orders);
  } catch (err) {
    console.error("get orders error:", err);
    res.status(500).json({ message: "Failed to load orders" });
  }
};

exports.getSellerOrders = async (req, res) => {
  try {
    // true
    const seller_id = req.user.id;

    const orders = await getSellerOrders(seller_id);
    res.json(orders);
  } catch (err) {
    console.error("Seller Orders Error:", err);
    res.status(500).json({ message: "Failed to load seller orders" });
  } finally {
    // false
  }
};

exports.getCartCount = async (req, res) => {
  try {
    const buyer_id = req.user.id;
    const cart = await getCartService(buyer_id);
    res.json({ count: cart.length });
  } catch (err) {
    console.error("Cart Count Error:", err);
    res.status(500).json({ message: "Failed to get cart count" });
  }
};

exports.toggleSaveForLater = async (req, res) => {
  try {
    const buyer_id = req.user.id;
    const cart_id = req.params.cart_id;

    const result = await pool.query(
      `UPDATE cart 
       SET is_saved_for_later = NOT is_saved_for_later 
       WHERE cart_id = $1 AND buyer_id = $2
       RETURNING *`,
      [cart_id, buyer_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Toggled save for later", item: result.rows[0] });
  } catch (err) {
    console.error("Toggle Save Error:", err);
    res.status(500).json({ message: "Failed to toggle save for later" });
  }
};