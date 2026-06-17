const express = require("express");
const router = express.Router();
const productController = require("../controller/product_controller");
const auth = require("../middleware/auth");
const { checkSellerApproved } = require("../middleware/checkSellerApproved");

const upload = require("../middleware/upload");
const { deleteProduct } = require("../controller/product_controller");

// ---------------- SELLER ROUTES ----------------

// Add product (multi-image)
router.post(
  "/add",
  auth,
  checkSellerApproved,
  upload.array("images", 10),
  productController.addProduct,
);

// Get seller products (with pagination)
router.get("/", auth, checkSellerApproved, productController.getSellerProducts);

// Get details of specific product
router.get(
  "/details/:product_id",
  auth,
  checkSellerApproved,
  productController.getProductById,
);

// Update product
router.put(
  "/update/:product_id",
  auth,
  checkSellerApproved,
  upload.array("images", 10),
  productController.updateProduct,
);

// Soft delete product (set inactive)
router.delete("/delete/:product_id", auth, checkSellerApproved, deleteProduct);

// Toggle Active / Inactive
router.put(
  "/toggle-status/:product_id",
  auth,
  checkSellerApproved,
  productController.toggleStatus,
);

// Seller Dashboard stats
router.get(
  "/seller-dashboardpage",
  auth,
  checkSellerApproved,
  productController.getSellerDashboardController,
);

// ---------------- BUYER ROUTES ----------------

// Get all active products (with pagination & search)
router.get("/all", productController.getAllProducts);

// Get filtered products (category, search)
router.get("/filter", productController.getFilteredProducts);

// Buyer dashboard stats
router.get(
  "/buyer-dashboardpage",
  auth,
  productController.getBuyerDashboardController,
);

router.get("/:id",productController.getProductByIdPublic);

module.exports = router;
