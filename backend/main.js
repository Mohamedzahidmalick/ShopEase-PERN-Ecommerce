require("dotenv").config();
const cors = require("cors");
const express = require("express");
const pool = require("./db"); 
const routes = require("./route/routes");   
const wishlistRoutes = require("./route/wishlist_routes");
const app = express();
const PORT = process.env.PORT || 3000;

// CORS FIRST
{/*app.use(cors({
  origin: "http://localhost:3001",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));*/}

app.use(cors({
  origin: [
    "http://localhost:3001",
    process.env.FRONTEND_URL
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

//app.options("*", cors());

// MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));
app.use("/profile_uploads", express.static("profile_uploads"));

// Test DB
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.send(`DB Connected: ${result.rows[0].now}`);
  } catch (err) { 
  console.log("FULL DB ERROR:", err); 
  res.status(500).send(err.message);
}
});

// AUTH ROUTES
app.use("/api/auth", routes);

// ADMIN ROUTE
app.use("/api/admin", require("./route/admin_routes"));

// PRODUCT ROUTES
app.use("/api/products", require("./route/product_routes"));

// CART ROUTES
app.use("/api/cart", require("./route/cart_routes"));

// Seller and Buyer ORDERS ROUTES
app.use("/api/orders", require("./route/order_routes"));

// CATEGORIES ROUTES
app.use("/api/categories", require("./route/category_routes"));

// WISHLIST ROUTES
app.use("/api/wishlist", wishlistRoutes);

// SETTINGS ROUTES (MUST BE LAST)
app.use("/api/seller", require("./route/seller_settings_routes"));
app.use("/api/buyer", require("./route/buyer_settings_routes"));

app.use("/api/profile", require("./route/Profile_routes"));



// START
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});