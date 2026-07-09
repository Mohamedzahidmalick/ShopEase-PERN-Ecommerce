require("dotenv").config();

const cors = require("cors");
const express = require("express");
const pool = require("./db");

const routes = require("./route/routes");
const wishlistRoutes = require("./route/wishlist_routes");

const app = express();

const PORT = process.env.PORT || 3000;


// CORS FIRST
const allowedOrigins = [
  "http://localhost:3001",
  "https://shopease-pern-ecommerce.vercel.app"
];

app.use(
  cors({
    origin: function(origin, callback) {

      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app")
      ) {
        callback(null, true);
      } 
      else {
        callback(new Error("Blocked by CORS"));
      }
    },

    credentials: true,
    methods: ["GET","POST","PUT","DELETE","OPTIONS"],
    allowedHeaders: ["Content-Type","Authorization"]
  })
);

app.use((req,res,next)=>{
  console.log("REQUEST FROM:", req.headers.origin);
  next();
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended:true }));

app.use("/uploads", express.static("uploads"));
app.use("/profile_uploads", express.static("profile_uploads"));


app.get("/", async (req,res)=>{
  try{
    const result = await pool.query("SELECT NOW()");
    res.send(`DB Connected: ${result.rows[0].now}`);
  }
  catch(err){
    console.log(err);
    res.status(500).send(err.message);
  }
});


app.use("/api/auth", routes);

app.use("/api/admin", require("./route/admin_routes"));

app.use("/api/products", require("./route/product_routes"));

app.use("/api/cart", require("./route/cart_routes"));

app.use("/api/orders", require("./route/order_routes"));

app.use("/api/categories", require("./route/category_routes"));

app.use("/api/wishlist", wishlistRoutes);

app.use("/api/seller", require("./route/seller_settings_routes"));

app.use("/api/buyer", require("./route/buyer_settings_routes"));

app.use("/api/profile", require("./route/Profile_routes"));


// VERY IMPORTANT FOR RENDER
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});