const express = require("express");
const router = express.Router();
const adminAuth = require("../middleware/Adminauth");
const {
  adminLogin,
  getSellers,
  approveSeller,
  rejectSeller,
  restoreSeller,
  getUserDetails,
  toggleBlockUser
} = require("../controller/admin_controller");

const {
  getAllUsers,
  deleteUser,
  getAllProductsAdmin,
  deleteProductAdmin,
  toggleProductAdmin,
  getAdminStats,
} = require("../controller/admin_panel_controller");

//Get all users route
router.get("/users", adminAuth, getAllUsers);

//Delete user route
router.delete("/users/:id", adminAuth, deleteUser);

//Admin login route
router.post("/login", adminLogin);

//Admin product management routes
router.get("/products", adminAuth, getAllProductsAdmin);

//Delete product route
router.delete("/products/:id", adminAuth, deleteProductAdmin);

//Toggle product availability route
router.put("/products/toggle/:id", adminAuth, toggleProductAdmin);

//Admin dashboard stats route
router.get("/stats", adminAuth, getAdminStats);

// Pending seller routes
router.get("/sellers", adminAuth, getSellers);

// Approve seller route
router.put("/approve-seller/:id", adminAuth, approveSeller);

// Reject seller route
router.put("/reject-seller/:id", adminAuth, rejectSeller);

// Restore seller route
router.put("/restore-seller/:id", adminAuth, restoreSeller);

// Get user details route
router.get("/users/:id", adminAuth, getUserDetails);

//router.get("/test", (req, res) => {res.json({ message: "Admin route working!" });});

router.put("/block/:id",adminAuth,toggleBlockUser);
module.exports = router;
