require("dotenv").config();

const cors = require("cors");
const express = require("express");
const pool = require("./db");

const routes = require("./route/routes");
const wishlistRoutes = require("./route/wishlist_routes");

const app = express();

const PORT = process.env.PORT || 3000;


// CORS FIRST
app.use(cors({
  origin: [
    "http://localhost:3001",
    "https://shopease-pern-ecommerce-1q3wih4hz-zahid-projects.vercel.app"
  ],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));

app.options("*", cors());


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended:true }));