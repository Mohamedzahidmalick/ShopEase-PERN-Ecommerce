const {
  addProductService,
  getSellerProductsService,
  getProductByIdService,
  updateProductService,
  deleteProductService,
  getAllProductsService,
  getFilteredProductsService,
  toggleStatusService,
  getSellerDashboardService,
  getBuyerDashboardService,
} = require("../services/product_services");

// ---------------- ADD PRODUCT ----------------
exports.addProduct = async (req, res) => {
  try {
    const product = await addProductService(req.user.id, req.body, req.files);

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (err) {
    console.error("Add Product Error:", err);
    res.status(500).json({ message: "Failed to add product" });
  }
};

// ---------------- GET SELLER PRODUCTS ----------------
exports.getSellerProducts = async (req, res) => {
  try {
    const data = await getSellerProductsService(req.user.id, req.query);

    res.json({
      products: data.products,
      totalPages: data.totalPages,
      currentPage: data.currentPage,
    });
  } catch (err) {
    console.error("Get Seller Products Error:", err);
    res.status(500).json({ message: "Failed to fetch products" });
  }
};

// ---------------- GET PRODUCT BY ID ----------------
exports.getProductById = async (req, res) => {
  try {
    const product = await getProductByIdService(req.params.product_id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    console.error("Get Product Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- UPDATE PRODUCT ----------------
exports.updateProduct = async (req, res) => {
  try {
    const product_id = req.params.product_id;

    const data = req.body;
    const files = req.files || [];

    const deletedImages = JSON.parse(req.body.deleted_images || "[]");

    const updated = await updateProductService(
      product_id,
      data,
      files,
      deletedImages,
    );

    res.json({ message: "Product updated successfully", product: updated });
  } catch (error) {
    console.error("Update Product Error:", error);

    res.status(500).json({ message: "Update failed" });
  }
};
// ---------------- DELETE PRODUCT (SOFT DELETE) ----------------
exports.deleteProduct = async (req, res) => {
  try {
    const product_id = req.params.product_id;
    console.log("Deleting product:", product_id);

    const result = await deleteProductService(product_id);

    if (!result.success) {
      return res.status(400).json({ message: result.message });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.log("Delete Product Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- GET ALL BUYER PRODUCTS ----------------
exports.getAllProducts = async (req, res) => {
  try {
    const products = await getAllProductsService();
    res.json(products);
  } catch (err) {
    console.error("Buyer Products Error:", err);
    res.status(500).json({ message: "Failed to load products" });
  }
};

// ---------------- FILTER PRODUCTS ----------------
exports.getFilteredProducts = async (req, res) => {
  try {
    const products = await getFilteredProductsService(req.query);
    res.json({ products });
  } catch (err) {
    console.error("Filter Error:", err);
    res.status(500).json({ message: "Failed to filter" });
  }
};

// ---------------- TOGGLE ACTIVE/INACTIVE ----------------
exports.toggleStatus = async (req, res) => {
  try {
    const result = await toggleStatusService(
      req.params.product_id,
      req.user.id,
    );

    if (!result)
      return res
        .status(404)
        .json({ message: "Product not found or unauthorized" });

    res.json({ message: "Status updated", product: result });
  } catch (err) {
    if (err.status === 403) {
      console.error("Toggle error due to admin change the status", err);
      return res.status(403).json({
        message: err.message,
      });
    }

    res.status(500).json({
      message: "Failed to update status",
    });
  }
};

// ---------------- SELLER DASHBOARD STATS ----------------
exports.getSellerDashboardController = async (req, res) => {
  const seller_id = req.user.id; // from token

  try {
    const stats = await getSellerDashboardService(seller_id);

    res.json(stats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Dashboard error" });
  }
};

exports.getBuyerDashboardController = async (req, res) => {
  try {
    const buyer_id = req.user.id; // from verifyBuyer middleware

    const stats = await getBuyerDashboardService(buyer_id);

    res.status(200).json(stats);
  } catch (error) {
    console.error("Buyer dashboard error:", error);
    res.status(500).json({
      message: error.message || "Failed to load buyer dashboard",
    });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const seller_id = req.user.id; //  from token

    const { name, price, category, stock, description } = req.body;

    await pool.query(
      `
      INSERT INTO products
      (name, price, category, stock, description, seller_id)
      VALUES ($1,$2,$3,$4,$5,$6)
      `,
      [name, price, category, stock, description, seller_id],
    );

    res.json({ message: "Product added" });
  } catch (err) {
    console.log(err);
  }
};

const pool = require("../db"); // adjust path if needed

exports.getProductByIdPublic = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query("SELECT * FROM products WHERE id = $1", [
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }

    const product = result.rows[0];

    // OPTIONAL: fetch images
    const images = await pool.query(
      "SELECT * FROM product_images WHERE product_id = $1",
      [id],
    );

    //product.images = images.rows;

    product.images = images.rows.map((img) => ({
      ...img,
      image_url: process.env.BASE_URL + img.image_url,
    })); // return only real images
    product.image_url = images.rows[0]
      ? process.env.BASE_URL + images.rows[0].image_url
      : null; // fallback

    res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    res.status(500).json({ message: "Server error" });
  }
};
