const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const cartController = require("../controller/cart_controller");
//const authMiddleware=require("../middleware/auth");
//const getbuyerorders=require("../controller/cart_controller");
//const {addToCart,getCart,removeCart,checkout}=require("../controller/cart_controller");

router.post("/add", auth, cartController.addToCart);
router.get("/", auth, cartController.getCart);
router.get("/count", auth, cartController.getCartCount);
router.delete("/:cart_id", auth, cartController.removeCart);
router.post("/checkout", auth, cartController.checkout);
router.put("/update/:cart_id", auth, cartController.updateQuantity);
router.put("/save/:cart_id", auth, cartController.toggleSaveForLater);

router.get("/orders", auth,cartController.getBuyerOrders);
router.get("/seller-orders", auth, cartController.getSellerOrders);
router.put("/orders/status/:order_id", auth, cartController.updateOrderStatus);


module.exports = router;
