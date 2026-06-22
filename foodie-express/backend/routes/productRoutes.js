const express = require("express");
const router = express.Router();
const { getProducts, getProductById, createProduct, updateProduct, deleteProduct } = require("../controllers/productController");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const { uploadProduct } = require("../config/s3");

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", protect, adminOnly, uploadProduct.single("image"), createProduct);
router.put("/:id", protect, adminOnly, uploadProduct.single("image"), updateProduct);
router.delete("/:id", protect, adminOnly, deleteProduct);

module.exports = router;