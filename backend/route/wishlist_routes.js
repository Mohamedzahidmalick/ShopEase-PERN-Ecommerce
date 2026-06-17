const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const wishlistController = require("../controller/wishlist_controller");

router.post("/add", auth, wishlistController.addToWishlist);
router.delete("/remove/:product_id", auth, wishlistController.removeFromWishlist);
router.get("/", auth, wishlistController.getWishlist);

module.exports = router;