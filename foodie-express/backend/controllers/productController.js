const Product = require("../models/Product");
const { s3 } = require("../config/s3");
const { DeleteObjectCommand } = require("@aws-sdk/client-s3");

const deleteFromS3 = async (imageKey) => {
  if (!imageKey) return;
  try {
    await s3.send(new DeleteObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET,
      Key: imageKey,
    }));
  } catch (err) {
    console.error("S3 delete error:", err.message);
  }
};

const getProducts = async (req, res) => {
  try {
    const { search, category, minPrice, maxPrice, page = 1, limit = 8 } = req.query;
    let query = {};
    if (search) query.$or = [
      { name: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
    if (category && category !== "All") query.category = category;
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }
    const skip = (Number(page) - 1) * Number(limit);
    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));
    res.json({ success: true, products, currentPage: Number(page), totalPages: Math.ceil(total / Number(limit)), total });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error fetching product" });
  }
};

const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, preparationTime } = req.body;
    if (!name || !description || !price || !category)
      return res.status(400).json({ success: false, message: "Name, description, price and category are required" });
    if (Number(price) <= 0)
      return res.status(400).json({ success: false, message: "Price must be greater than 0" });
    if (!req.file)
      return res.status(400).json({ success: false, message: "Product image is required" });

    const product = await Product.create({
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      image: req.file.location,
      imageKey: req.file.key,
      isAvailable: isAvailable === "false" ? false : true,
      preparationTime: Number(preparationTime) || 20,
    });
    res.status(201).json({ success: true, message: "Product added successfully", product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error creating product" });
  }
};

const updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, isAvailable, preparationTime } = req.body;
    if (!name || !description || !price || !category)
      return res.status(400).json({ success: false, message: "All fields are required" });
    if (Number(price) <= 0)
      return res.status(400).json({ success: false, message: "Price must be greater than 0" });

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const updateData = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      category,
      isAvailable: isAvailable === "false" ? false : true,
      preparationTime: Number(preparationTime) || 20,
    };

    if (req.file) {
      await deleteFromS3(product.imageKey);
      updateData.image = req.file.location;
      updateData.imageKey = req.file.key;
    }

    const updated = await Product.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json({ success: true, message: "Product updated successfully", product: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error updating product" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });
    await deleteFromS3(product.imageKey);
    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting product" });
  }
};

module.exports = { getProducts, getProductById, createProduct, updateProduct, deleteProduct };