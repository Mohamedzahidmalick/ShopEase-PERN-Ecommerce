const express = require("express");
const router = express.Router();
const { getBuyerOrders ,getOrderDetails,getSellerOrders,updateOrderStatus} = require("../controller/order_controller");
const auth = require("../middleware/auth");

// Buyer Orders routes
router.get("/order-details/:id", auth, getOrderDetails);
router.get("/", auth, getBuyerOrders);


// Seller Orders routes
router.get("/seller", auth, getSellerOrders);
router.put("/seller/:id", auth, updateOrderStatus);

module.exports = router;
