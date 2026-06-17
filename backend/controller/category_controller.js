const categoryService = require("../services/category_services");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategoriesService();
    res.json(categories);
  } catch (error) {
    console.error("Category error:", error);
    res.status(500).json({ message: "Failed to load categories" });
  }
};
