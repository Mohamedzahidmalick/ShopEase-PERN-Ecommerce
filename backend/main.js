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
  "https://shopease-pern-ecommerce-1q3wih4hz-zahid-projects.vercel.app"
];

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
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