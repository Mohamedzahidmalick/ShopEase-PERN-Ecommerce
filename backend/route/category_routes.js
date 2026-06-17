const express = require("express");
const router = express.Router();
const categoryController = require("../controller/category_controller");

router.get("/", categoryController.getAllCategories);

module.exports = router;
